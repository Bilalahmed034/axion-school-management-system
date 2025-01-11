const express = require('express');
const router = express.Router();
const SchoolManager = require('../managers/entities/school/School.manager');
const authMw = require('../mws/__auth.mw');

const schoolManager = new SchoolManager({
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

// Apply auth middleware to all routes
router.use(authMw);

// Routes
router.get('/getAllSchools', async (req, res) => {
    const { page, limit } = req.query;
    const result = await schoolManager.getAllSchools({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        __token: { userId: req.user.id }
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.post('/createSchool', async (req, res) => {
    const result = await schoolManager.createSchool({
        __token: { userId: req.user.id },
        ...req.body
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getSchoolById/:schoolId', async (req, res) => {
    const result = await schoolManager.getSchoolById({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

module.exports = router; 