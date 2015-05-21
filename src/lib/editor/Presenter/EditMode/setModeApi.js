import ApiForViewMode from './ApiForViewMode';
import ApiForEditMode from './ApiForEditMode';

export default function setModeApi(api, stateMachine, isEditable) {
    let viewModeApi = new ApiForViewMode(stateMachine),
        editModeApi = new ApiForEditMode(stateMachine);

    if (isEditable) {
        _.extend(api, editModeApi);
    } else {
        _.extend(api, viewModeApi);
    }
}
