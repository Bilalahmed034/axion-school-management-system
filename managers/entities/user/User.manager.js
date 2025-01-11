const User = require('./user.schema');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

module.exports = class UserManager {
    constructor({ config, cortex, validators, mongomodels, managers }) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.shark = managers.shark;
        this.httpExposed = [
            "createUser",
            "__token=updateUser",
            "__token=deleteUser",
            "__token=getUserById",
            "login"
        ];
    }

    async login({ email, password }) {
        try {
            const user = await User.findOne({
                email,
                password: md5(password),
                status: 'active'
            });

            if (!user) {
                return { error: 'Invalid credentials', code: 401 };
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                this.config.jwt.secret,
                { expiresIn: '24h' }
            );

            return { token, user: { id: user._id, role: user.role } };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }

    async createUser({ name, email, password, role }) {
        try {
            const user = new User({
                name,
                email,
                password: md5(password),
                role
            });

            await user.save();
            return { user };
        } catch (error) {
            return { error: error.message, code: 400 };
        }
    }
}
