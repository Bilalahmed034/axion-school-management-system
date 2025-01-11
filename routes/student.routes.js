const express = require('express');
const router = express.Router();
const StudentManager = require('../managers/entities/student/Student.manager');
const authMw = require('../mws/__auth.mw');

const studentManager = new StudentManager({
    config: {},
    cortex: {},
    validators: {},
    mongomodels: {},
    managers: {
        shark: {
            isGranted: async () => true
        },
        classroom: {
            getClassroomCapacity: async () => ({ available: 10 })
        }
    }
});

router.use(authMw);

router.post('/enrollStudent/:schoolId/:classroomId', async (req, res) => {
    const result = await studentManager.enrollStudent({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId,
        ...req.body
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getStudents/:schoolId/:classroomId', async (req, res) => {
    const { page, limit } = req.query;
    const result = await studentManager.getStudents({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.put('/updateStudent/:schoolId/:classroomId/:studentId', async (req, res) => {
    const result = await studentManager.updateStudent({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId,
        studentId: req.params.studentId,
        updateData: req.body
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.post('/transferStudent/:studentId', async (req, res) => {
    const result = await studentManager.transferStudent({
        __token: { userId: req.user.id },
        studentId: req.params.studentId,
        newClassroomId: req.body.newClassroomId,
        newSchoolId: req.body.newSchoolId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getStudentById/:schoolId/:classroomId/:studentId', async (req, res) => {
    const result = await studentManager.getStudentById({
        __token: { userId: req.user.id },
        schoolId: req.params.schoolId,
        classroomId: req.params.classroomId,
        studentId: req.params.studentId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

router.get('/getStudentProfile/:studentId', async (req, res) => {
    const result = await studentManager.getStudentProfile({
        __token: { userId: req.user.id },
        studentId: req.params.studentId
    });
    if (result.error) {
        return res.status(result.code || 400).json({ error: result.error });
    }
    res.json(result);
});

module.exports = router;
