module.exports = [
    { userId: 'superadmin', action: 'config', layer: 'school' },
    { userId: 'schooladmin', action: 'audit', layer: 'school' },
    { userId: 'schooladmin', action: 'config', layer: 'school.classroom' },
    { userId: 'schooladmin', action: 'config', layer: 'school.classroom.student' }
]