export default function(stateMachine) {
    return {
        toTerm: function() {
            stateMachine.setState('Term Contric');
        },
        toInstance: function() {
            stateMachine.setState('Instance / Relation');
        },
        toRelation: function() {
            stateMachine.setState('Relation Edit');
        }
    };
}
