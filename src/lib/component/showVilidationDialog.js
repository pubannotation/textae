var GetEditorDialog = require('./dialog/GetEditorDialog'),
    Handlebars = require('handlebars'),
    source = `
    <div class="textae-editor__valiondate-dialog__content">
        <h1>{{name}}</h1>
        {{#if denotationHasLength}}
            <table>
                <caption>Spans are broken.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>begin</th>
                        <th>end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationHasLength}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationHasLength}}
                </tbody>
            </table>
        {{/if}}
        {{#if denotationInText}}
            <table>
                <caption>Spans are out of text.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>begin</th>
                        <th>end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationInText}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationInText}}
                </tbody>
            </table>
        {{/if}}
        {{#if denotationInParagraph}}
            <table>
                <caption>Spans are out of paragraphs.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>begin</th>
                        <th>end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationInParagraph}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationInParagraph}}
                </tbody>
            </table>
        {{/if}}
        {{#if relationObj}}
            <table>
                <caption>Objects of relations are not exists.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>pred</th>
                        <th>subj</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#relationObj}}
                    <tr>
                        <td>{{id}}</td>
                        <td>{{pred}}</td>
                        <td>{{subj}}</td>
                        <td class="alert">{{obj}}</td>
                    </tr>
                    {{/relationObj}}
                </tbody>
            </table>
        {{/if}}
        {{#if relationSubj}}
            <table>
                <caption>Subjects of relations are not exists.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>pred</th>
                        <th>subj</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#relationSubj}}
                    <tr>
                        <td>{{id}}</td>
                        <td>{{pred}}</td>
                        <td class="alert">{{subj}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/relationSubj}}
                </tbody>
            </table>
        {{/if}}
        {{#if modification}}
            <table>
                <caption>Objects of modifications are not exists.</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>obj</th>
                        <th>pred</th>
                    </tr>
                </thead>
                <tbody>
                    {{#modification}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{obj}}</td>
                        <td>{{pred}}</td>
                    </tr>
                    {{/modification}}
                </tbody>
            </table>
        {{/if}}
    </div>`,
    tepmlate = Handlebars.compile(source),
    hasError = function(rejects) {
        return rejects.reduce(function(result, reject) {
            return result || reject.hasError;
        }, false);
    };

module.exports = function(editor, rejects) {
    if (hasError(rejects)) {
        var $content = $('<div>'),
            $dialog = new GetEditorDialog(editor)(
                'textae.dialog.validation',
                'The following erronious annotations ignored',
                $content, {
                    noCancelButton: true,
                    height: 450
                }
            );

        rejects
            .map(function(reject) {
                return tepmlate(reject);
            })
            .forEach(function(html) {
                $content[0]
                    .insertAdjacentHTML('beforeend', html);
            });

        $dialog.open();
    }
};
