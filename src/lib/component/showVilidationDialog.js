var GetEditorDialog = require('./dialog/GetEditorDialog'),
    Handlebars = require('handlebars'),
    source = `
    <div class="textae-editor__valiondate-dialog__content">
        {{#if annotation.relationSubj}}
            <div>
                <h2>subjects of relations are not exists. </h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>pred</th>
                            <th>subj</th>
                            <th>obj</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#annotation.relationSubj}}
                        <tr>
                            <td>{{id}}</td>
                            <td>{{pred}}</td>
                            <td class="alert">{{subj}}</td>
                            <td>{{obj}}</td>
                        </tr>
                        {{/annotation.relationSubj}}
                    </thead>
                </table>
            </div>
        {{/if}}
        {{#if annotation.modification}}
            <div>
                <h2>objects of modifications are not exists. </h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>obj</th>
                            <th>pred</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#annotation.modification}}
                        <tr>
                            <td>{{id}}</td>
                            <td class="alert">{{obj}}</td>
                            <td>{{pred}}</td>
                        </tr>
                        {{/annotation.modification}}
                    </tbody>
            </div>
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
