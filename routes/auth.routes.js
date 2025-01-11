const express = require('express');
const router = express.Router();
const UserManager = require('../managers/entities/user/User.manager');

const userManager = new UserManager({
    config: {
        jwt: {
            secret: process.env.JWT_SECRET || 'your-secret-key'
        }
    },
    cortex: {},
    validators: {},
    mongomodels: {},
    managers: {
        shark: {
            isGranted: async () => true
        }
    }
});

// Register
router.post('/register', async (req, res) => {
    const result = await userManager.createUser(req.body);
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }

    // Auto login after registration
    const loginResult = await userManager.login({
        email: req.body.email,
        password: req.body.password
    });

    res.json(loginResult);
});

// Login
router.post('/login', async (req, res) => {
    const result = await userManager.login(req.body);
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

module.exports = router; 