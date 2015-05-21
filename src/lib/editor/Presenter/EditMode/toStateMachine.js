import StateMachine from './StateMachine';

export default function(transition) {
    let stateMachine = new StateMachine();

    stateMachine
        .on('transition', function(e) {
            // For debug.
            // console.log(editor.editorId, 'from:', e.from, ' to:', e.to);
        })
        .on('enter:Term Contric', transition.toTerm)
        .on('enter:Instance / Relation', transition.toInstance)
        .on('enter:Relation Edit', transition.toRelation)
        .on('enter:View Term', transition.toViewTerm)
        .on('enter:View Instance', transition.toViewInstance);

    return stateMachine;
}
