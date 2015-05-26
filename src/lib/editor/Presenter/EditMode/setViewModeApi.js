import ApiForViewMode from './ApiForViewMode';

export default function(api, stateMachine) {
    let viewModeApi = new ApiForViewMode(stateMachine);

    _.extend(api, viewModeApi);
}
