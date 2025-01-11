// managers/school/School.manager.js

const School = require("./school.schema");
const mongoose = require('mongoose');

module.exports = class SchoolManager {
  constructor({ config, cortex, validators, mongomodels, managers }) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.shark = managers.shark;
    this.httpExposed = [
      "__token=createSchool",
      "get=getAllSchools",
      "__token=updateSchool",
      "__token=deleteSchool",
      "__token=getSchoolById",
      "__token=addSchoolAdmin"
    ];
  }

  async createSchool({ __token, name, location, contactNumber, email, capacity }) {
    try {
      const isGranted = await this.shark.isGranted({
        layer: 'school',
        nodeId: 'create',
        action: 'create',
        userId: __token.userId
      });

      if (!isGranted) {
        return { error: 'Unauthorized', code: 401 };
      }

      const school = new School({
        name,
        location,
        contactNumber,
        email,
        capacity,
        status: 'active',
        createdBy: new mongoose.Types.ObjectId(__token.userId)
      });

      await school.save();
      return { school };
    } catch (error) {
      return { error: error.message, code: 400 };
    }
  }

  async getAllSchools({ page = 1, limit = 10, __token }) {
    try {
      const isGranted = await this.shark.isGranted({
        layer: 'school',
        nodeId: 'read',
        action: 'read',
        userId: __token.userId
      });

      if (!isGranted) {
        return { error: 'Unauthorized', code: 401 };
      }

      const skip = (page - 1) * limit;

      const [schools, total] = await Promise.all([
        School.find({ status: 'active' })
          .skip(skip)
          .limit(limit)
          .select('-administrators')
          .lean(),
        School.countDocuments({ status: 'active' })
      ]);

      return {
        schools,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return { error: error.message, code: 400 };
    }
  }

  async updateSchool({ __token, schoolId, updateData }) {
    try {
      const isGranted = await this.shark.isGranted({
        layer: 'school',
        nodeId: schoolId,
        action: 'update',
        userId: __token.userId
      });

      if (!isGranted) {
        return { error: 'Unauthorized' };
      }

      const school = await School.findByIdAndUpdate(
        schoolId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!school) {
        return { error: 'School not found' };
      }

      return { school };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteSchool({ __token, schoolId }) {
    try {
      const isGranted = await this.shark.isGranted({
        layer: 'school',
        nodeId: schoolId,
        action: 'delete',
        userId: __token.userId
      });

      if (!isGranted) {
        return { error: 'Unauthorized', code: 401 };
      }

      const school = await School.findByIdAndDelete(schoolId);
      if (!school) {
        return { error: 'School not found', code: 404 };
      }

      return { message: 'School deleted successfully' };
    } catch (error) {
      return { error: error.message, code: 400 };
    }
  }

  async getSchoolById({ __token, schoolId }) {
    try {
      const school = await School.findById(schoolId)
        .populate('administrators', 'name email')
        .populate({
          path: 'classrooms',
          populate: {
            path: 'students',
            match: { status: 'active' }
          }
        });

      if (!school) {
        return { error: 'School not found', code: 404 };
      }

      return { school };
    } catch (error) {
      return { error: error.message, code: 400 };
    }
  }

  async addSchoolAdmin({ __token, schoolId, adminId }) {
    try {
      const isGranted = await this.shark.isGranted({
        layer: 'school',
        nodeId: schoolId,
        action: 'config',
        userId: __token.userId
      });

      if (!isGranted) {
        return { error: 'Unauthorized', code: 401 };
      }

      const school = await School.findById(schoolId);
      if (!school) {
        return { error: 'School not found', code: 404 };
      }

      if (school.administrators.includes(adminId)) {
        return { error: 'User is already an administrator', code: 400 };
      }

      school.administrators.push(adminId);
      await school.save();

      // Grant admin permissions
      await this.shark.addDirectAccess({
        userId: adminId,
        nodeId: schoolId,
        action: 'audit'
      });

      return { school };
    } catch (error) {
      return { error: error.message, code: 400 };
    }
  }
};
