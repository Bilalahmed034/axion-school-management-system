const mongoose = require('mongoose');

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

const generateMockToken = (userId = 'superadmin') => ({
    userId,
    role: 'admin'
});

module.exports = {
    clearDatabase,
    generateMockToken
}; 