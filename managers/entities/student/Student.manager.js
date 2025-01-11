const Student = require("./student.schema");

module.exports = class StudentManager {
    constructor({ config, cortex, validators, mongomodels, managers }) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.shark = managers.shark;
        this.classroom = managers.classroom;
        this.httpExposed = [
            "__token=enrollStudent",
            "__token=getStudents",
            "__token=updateStudent",
            "__token=transferStudent",
            "__token=getStudentById",
            "__token=getStudentProfile"
        ];
    }

    async enrollStudent({ __token, schoolId, classroomId, ...studentData }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom.student',
                nodeId: `${schoolId}.${classroomId}`,
                action: 'create',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            // Check classroom capacity
            const capacityCheck = await this.classroom.getClassroomCapacity({
                __token,
                classroomId
            });

            if (capacityCheck.available <= 0) {
                return { error: 'Classroom is at full capacity', code: 400 };
            }

            const student = new Student({
                ...studentData,
                school: schoolId,
                classroom: classroomId,
                createdBy: __token.userId
            });

            await student.save();
            return { student };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async transferStudent({ __token, studentId, newClassroomId, newSchoolId }) {
        try {
            const student = await Student.findById(studentId);
            if (!student) {
                return { error: 'Student not found', code: 404 };
            }

            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom.student',
                nodeId: `${student.school}.${student.classroom}`,
                action: 'update',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            // Check new classroom capacity
            const capacityCheck = await this.classroom.getClassroomCapacity({
                __token,
                classroomId: newClassroomId
            });

            if (capacityCheck.available <= 0) {
                return { error: 'Target classroom is at full capacity', code: 400 };
            }

            student.classroom = newClassroomId;
            student.school = newSchoolId;
            student.status = 'transferred';

            await student.save();
            return { student };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async getStudents({ __token, schoolId, classroomId, page = 1, limit = 10 }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom.student',
                nodeId: `${schoolId}.${classroomId}`,
                action: 'read',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const skip = (page - 1) * limit;
            const students = await Student.find({
                school: schoolId,
                classroom: classroomId,
                status: 'active'
            })
                .skip(skip)
                .limit(limit)
                .populate('classroom', 'name grade section')
                .lean();

            const total = await Student.countDocuments({
                school: schoolId,
                classroom: classroomId,
                status: 'active'
            });

            return {
                students,
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

    async updateStudent({ __token, studentId, schoolId, classroomId, updateData }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom.student',
                nodeId: `${schoolId}.${classroomId}`,
                action: 'update',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const student = await Student.findOneAndUpdate(
                { _id: studentId, school: schoolId, classroom: classroomId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!student) {
                return { error: 'Student not found', code: 404 };
            }

            return { student };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async getStudentById({ __token, studentId, schoolId, classroomId }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom.student',
                nodeId: `${schoolId}.${classroomId}`,
                action: 'read',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const student = await Student.findOne({
                _id: studentId,
                school: schoolId,
                classroom: classroomId
            })
                .populate('classroom', 'name grade section')
                .populate('school', 'name');

            if (!student) {
                return { error: 'Student not found', code: 404 };
            }

            return { student };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }
} 