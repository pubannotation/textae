import state from './state';

export default function(stateMachine) {
    return {
        toTerm: function() {
            stateMachine.setState(state.TERM);
        },
        toInstance: function() {
            stateMachine.setState(state.INSTANCE);
        },
        toViewTerm: function() {
            stateMachine.setState(state.VIEW_TERM);
        },
        toViewInstance: function() {
            stateMachine.setState(state.VIEW_INSTANCE);
        },
        pushView: function() {
            switch (stateMachine.currentState) {
                case state.TERM:
                    stateMachine.setState(state.VIEW_TERM);
                    break;
                case state.INSTANCE:
                case state.RELATION:
                    stateMachine.setState(state.VIEW_INSTANCE);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        },
        upView: function() {
            switch (stateMachine.currentState) {
                case state.VIEW_TERM:
                    stateMachine.setState(state.TERM);
                    break;
                case state.VIEW_INSTANCE:
                    stateMachine.setState(state.INSTANCE);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        },
        pushRelation: function() {
            stateMachine.setState(state.RELATION);
        },
        upRelation: function() {
            stateMachine.setState(state.INSTANCE);
        },
        pushSimple: function() {
            switch (stateMachine.currentState) {
                case state.INSTANCE:
                case state.RELATION:
                    stateMachine.setState(state.TERM);
                    break;
                case state.VIEW_INSTANCE:
                    stateMachine.setState(state.VIEW_TERM);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        },
        upSimple: function() {
            switch (stateMachine.currentState) {
                case state.TERM:
                    stateMachine.setState(state.INSTANCE);
                    break;
                case state.VIEW_TERM:
                    stateMachine.setState(state.VIEW_INSTANCE);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        }
    };
}
