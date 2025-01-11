require('dotenv').config();
const mongoose = require('mongoose');
require('./mocks/user.schema');

// Configure Mongoose
mongoose.set('strictQuery', true);

// Mock SharkFin manager for testing
jest.mock('../managers/shark_fin/SharkFin.manager', () => {
    return class MockSharkFin {
        constructor() { }

        async isGranted() {
            return true;
        }

        async addDirectAccess() {
            return true;
        }
    }
});

// Global test setup
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Global test teardown
afterAll(async () => {
    await mongoose.connection.close();
}); 