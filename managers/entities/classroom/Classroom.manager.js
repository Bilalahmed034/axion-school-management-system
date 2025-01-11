const Classroom = require("./classroom.schema");

module.exports = class ClassroomManager {
    constructor({ config, cortex, validators, mongomodels, managers }) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.shark = managers.shark;
        this.httpExposed = [
            "__token=createClassroom",
            "__token=getClassrooms",
            "__token=updateClassroom",
            "__token=deleteClassroom",
            "__token=getClassroomById",
            "__token=getClassroomCapacity"
        ];
    }

    async createClassroom({ __token, schoolId, ...classroomData }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom',
                nodeId: schoolId,
                action: 'create',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const classroom = new Classroom({
                ...classroomData,
                school: schoolId,
                createdBy: __token.userId
            });

            await classroom.save();
            return { classroom };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async deleteClassroom({ __token, classroomId, schoolId }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom',
                nodeId: schoolId,
                action: 'delete',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const classroom = await Classroom.findOneAndDelete({
                _id: classroomId,
                school: schoolId
            });

            if (!classroom) {
                return { error: 'Classroom not found', code: 404 };
            }

            return { message: 'Classroom deleted successfully' };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async getClassroomCapacity({ __token, classroomId }) {
        try {
            const classroom = await Classroom.findById(classroomId)
                .populate({
                    path: 'students',
                    match: { status: 'active' }
                });

            if (!classroom) {
                return { error: 'Classroom not found', code: 404 };
            }

            return {
                capacity: classroom.capacity,
                currentStudents: classroom.students.length,
                available: classroom.capacity - classroom.students.length
            };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async getClassrooms({ __token, schoolId, page = 1, limit = 10 }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom',
                nodeId: schoolId,
                action: 'read',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const skip = (page - 1) * limit;
            const classrooms = await Classroom.find({ school: schoolId })
                .skip(skip)
                .limit(limit)
                .populate('school', 'name')
                .lean();

            const total = await Classroom.countDocuments({ school: schoolId });

            return {
                classrooms,
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

    async updateClassroom({ __token, schoolId, classroomId, updateData }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom',
                nodeId: schoolId,
                action: 'update',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const classroom = await Classroom.findOneAndUpdate(
                { _id: classroomId, school: schoolId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!classroom) {
                return { error: 'Classroom not found', code: 404 };
            }

            return { classroom };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async getClassroomById({ __token, schoolId, classroomId }) {
        try {
            const isGranted = await this.shark.isGranted({
                layer: 'school.classroom',
                nodeId: schoolId,
                action: 'read',
                userId: __token.userId
            });

            if (!isGranted) {
                return { error: 'Unauthorized', code: 401 };
            }

            const classroom = await Classroom.findOne({
                _id: classroomId,
                school: schoolId
            })
                .populate('school', 'name')
                .populate({
                    path: 'students',
                    match: { status: 'active' }
                });

            if (!classroom) {
                return { error: 'Classroom not found', code: 404 };
            }

            return { classroom };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }
} 