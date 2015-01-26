module.exports = function(stateMachine) {
    return {
        toInstance: function() {
            stateMachine.setState('View Instance');
        },
        toTerm: function() {
            stateMachine.setState('View Term');
        },
        toRelation: function() {}
    };
};
