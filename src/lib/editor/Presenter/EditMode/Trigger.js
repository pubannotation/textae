import state from './state';

export default function(stateMachine) {
    return {
        toTerm: function() {
            stateMachine.setState(state.TERM);
        },
        toInstance: function() {
            stateMachine.setState(state.INSTANCE);
        },
        toRelation: function() {
            stateMachine.setState(state.RELATION);
        },
        toViewTerm: function() {
            stateMachine.setState(state.VIEW_TERM);
        },
        toViewInstance: function() {
            stateMachine.setState(state.VIEW_INSTANCE);
        }
    };
}
