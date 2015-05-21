export default function(stateMachine) {
    return {
        toTerm: function() {
            stateMachine.setState('View Term');
        },
        toInstance: function() {
            stateMachine.setState('View Instance');
        },
        toRelation: function() {}
    };
}
