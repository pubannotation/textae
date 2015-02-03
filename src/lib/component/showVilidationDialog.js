var GetEditorDialog = require('../util/dialog/GetEditorDialog'),
    Handlebars = require('handlebars'),
    source = `
    <div class="textae-editor__valiondate-dialog__content">
        {{#if annotation.relationSubj}}
            <h2>subjects of relations are not exists. </h2>
            <ul>
                {{#annotation.relationSubj}}
                <li>id: {{id}} obj: {{obj}} pred: {{pred}}</liv>
                {{/annotation.relationSubj}}
            </ul>
        {{/if}}
        {{#if annotation.modification}}
            <h2>objects of modifications are not exists. </h2>
            <ul>
                {{#annotation.modification}}
                <li>id: {{id}} obj: {{obj}} pred: {{pred}}</liv>
                {{/annotation.modification}}
            </ul>
        {{/if}}
    </div>`,
    tepmlate = Handlebars.compile(source);

module.exports = function(editor, reject) {
    if (reject.hasError) {

        console.log(tepmlate(reject));
        console.log(reject);

        var $dialog = new GetEditorDialog(editor)(
            'textae.dialog.validation',
            'The following erronious annotations ignored',
            $('<div>').attr('id', 'textae.dialog.validation.content'),
            true
        );

        $dialog
            .find('div')[0]
            .innerHTML = tepmlate(reject);

        $dialog.open();
    }
};
