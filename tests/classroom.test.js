const mongoose = require('mongoose');
const ClassroomManager = require('../managers/entities/classroom/Classroom.manager');
const Classroom = require('../managers/entities/classroom/classroom.schema');

describe('Classroom Manager Tests', () => {
    let classroomManager;
    const mockToken = {
        userId: new mongoose.Types.ObjectId().toString()
    };
    const mockSchoolId = new mongoose.Types.ObjectId();

    beforeAll(async () => {
        classroomManager = new ClassroomManager({
            config: {},
            cortex: {},
            validators: {},
            mongomodels: {},
            managers: {
                shark: {
                    isGranted: async () => true
                }
            }
        });
    });

    beforeEach(async () => {
        await Classroom.deleteMany({});
    });

    test('Should create a new classroom', async () => {
        const classroomData = {
            name: 'Class A',
            capacity: 30,
            grade: '10',
            section: 'A',
            academicYear: '2024-2025'
        };

        const result = await classroomManager.createClassroom({
            __token: mockToken,
            schoolId: mockSchoolId,
            ...classroomData
        });

        expect(result.classroom).toBeDefined();
        expect(result.classroom.name).toBe(classroomData.name);
    });
}); 