const express = require('express');
const router = express.Router();
const ClassroomManager = require('../managers/entities/classroom/Classroom.manager');
const authMw = require('../mws/__auth.mw');

const classroomManager = new ClassroomManager({
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

// Apply auth middleware to all routes
router.use(authMw);

router.post('/createClassroom/:schoolId', async (req, res) => {
    const result = await classroomManager.createClassroom({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        ...req.body
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getClassrooms/:schoolId', async (req, res) => {
    const { page, limit } = req.query;
    const result = await classroomManager.getClassrooms({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getClassroomById/:schoolId/:classroomId', async (req, res) => {
    const result = await classroomManager.getClassroomById({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.put('/updateClassroom/:schoolId/:classroomId', async (req, res) => {
    const result = await classroomManager.updateClassroom({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId,
        updateData: req.body
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.delete('/deleteClassroom/:schoolId/:classroomId', async (req, res) => {
    const result = await classroomManager.deleteClassroom({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getClassroomCapacity/:classroomId', async (req, res) => {
    const result = await classroomManager.getClassroomCapacity({
        __token: { userId: req.user.id },
        classroomId: req.params.classroomId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

module.exports = router; 