const layers = {
    school: {
        _default: { anyoneCan: 'read' },
        _private: { anyoneCan: 'none' },

        classroom: {
            _default: { inherit: true },
            _private: { inherit: true },

            student: {
                _default: { inherit: true },
                _private: { inherit: true }
            }
        }
    }
}

const actions = {
    blocked: -1,
    none: 1,
    read: 2,
    create: 3,
    update: 4,
    delete: 5,
    audit: 6,
    config: 7
}

module.exports = {
    layers,
    actions
}