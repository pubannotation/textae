import ApiForEditMode from './ApiForEditMode';

export default function(api, stateMachine) {
    let editModeApi = new ApiForEditMode(stateMachine);

    _.extend(api, editModeApi);
}
