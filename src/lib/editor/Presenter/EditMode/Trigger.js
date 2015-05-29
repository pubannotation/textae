import state from './state';

export default function(stateMachine) {
    return {
        toTerm: () => stateMachine.setState(state.TERM),
        toInstance: () => stateMachine.setState(state.INSTANCE),
        toViewTerm: () => stateMachine.setState(state.VIEW_TERM),
        toViewInstance: () => stateMachine.setState(state.VIEW_INSTANCE),
        pushView: () => {
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
        upView: () => {
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
        pushTerm: () => {
            switch (stateMachine.currentState) {
                case state.TERM:
                case state.RELATION:
                    stateMachine.setState(state.INSTANCE);
                    break;
                case state.VIEW_TERM:
                    stateMachine.setState(state.VIEW_INSTANCE);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        },
        upTerm: () => {
            switch (stateMachine.currentState) {
                case state.INSTANCE:
                    stateMachine.setState(state.TERM);
                    break;
                case state.VIEW_INSTANCE:
                    stateMachine.setState(state.VIEW_TERM);
                    break;
                default:
                    throw new Error(`Invalid state: ${stateMachine.currentState}`);
            }
        },
        pushRelation: () => stateMachine.setState(state.RELATION),
        upRelation: () => stateMachine.setState(state.INSTANCE),
        pushSimple: () => {
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
        upSimple: () => {
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
        },
        toggleInstaceRelation: () => {
            switch (stateMachine.currentState) {
                case state.INSTANCE:
                    stateMachine.setState(state.RELATION);
                    break;
                case state.RELATION:
                    stateMachine.setState(state.INSTANCE);
                    break;
                default:
                    // Do nothig.
            }
        }
    };
}
