const mongoose = require('mongoose');
const SchoolManager = require('../managers/entities/school/School.manager');
const School = require('../managers/entities/school/school.schema');

describe('School Manager Tests', () => {
    let schoolManager;
    const mockToken = {
        userId: new mongoose.Types.ObjectId().toString()
    };

    beforeAll(async () => {
        schoolManager = new SchoolManager({
            config: {},
            cortex: {},
            validators: {},
            mongomodels: {},
            managers: {
                shark: {
                    isGranted: async () => true,
                    addDirectAccess: async () => true
                }
            }
        });
    });

    beforeEach(async () => {
        await School.deleteMany({});
    });

    test('Should create a new school', async () => {
        const schoolData = {
            name: 'Test School',
            location: 'Test Location',
            contactNumber: '1234567890',
            email: 'test@school.com',
            capacity: 1000,
            status: 'active'
        };

        const result = await schoolManager.createSchool({
            __token: mockToken,
            ...schoolData
        });

        expect(result).toBeDefined();
        expect(result.school).toBeDefined();
        expect(result.school.name).toBe(schoolData.name);
        expect(result.school.status).toBe('active');
    });

    test('Should get all schools with pagination', async () => {
        const schools = [
            {
                name: 'School 1',
                location: 'Location 1',
                contactNumber: '1234567890',
                email: 'school1@test.com',
                capacity: 1000,
                status: 'active',
                createdBy: new mongoose.Types.ObjectId()
            },
            {
                name: 'School 2',
                location: 'Location 2',
                contactNumber: '0987654321',
                email: 'school2@test.com',
                capacity: 1000,
                status: 'active',
                createdBy: new mongoose.Types.ObjectId()
            }
        ];

        await School.insertMany(schools);

        const result = await schoolManager.getAllSchools({
            page: 1,
            limit: 10,
            __token: mockToken
        });

        if (result.error) {
            throw new Error(`Failed to get schools: ${result.error}`);
        }

        expect(result).toBeDefined();
        expect(result.schools).toBeDefined();
        expect(Array.isArray(result.schools)).toBe(true);
        expect(result.schools).toHaveLength(2);
        expect(result.pagination).toBeDefined();
        expect(result.pagination.total).toBe(2);
    });
}); 