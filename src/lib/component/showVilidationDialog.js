var GetEditorDialog = require('./dialog/GetEditorDialog'),
    Handlebars = require('handlebars'),
    source = `
    <div class="textae-editor__valiondate-dialog__content">
        <h1>{{name}}</h1>
        {{#if denotationHasLength}}
            <table>
                <caption>Wrong range.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
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
                <caption>Out of text.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
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
                <caption>Spans across paragraphs (newline-delimited).</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
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
        {{#if referencedItems}}
            <table>
                <caption>Referenced items do not exist.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="referencedItem">subj</th>
                        <th>pred</th>
                        <th class="referencedItem">obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#referencedItems}}
                    <tr>
                        <td>{{id}}</td>
                        <td{{#if alertSubj}} class="alert"{{/if}}>{{subj}}</td>
                        <td>{{pred}}</td>
                        <td{{#if alertObj}} class="alert"{{/if}}>{{obj}}</td>
                    </tr>
                    {{/referencedItems}}
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
            .map(reject => {
                // Combine rejects for referenced object errer.
                reject.referencedItems = reject.relationObj
                    .map(relation => {
                        relation.alertObj = true;
                        return relation;
                    })
                    .concat(reject.relationSubj
                        .map(relation => {
                            relation.alertSubj = true;
                            return relation;
                        })
                    )
                    .concat(reject.modification
                        .map(modification => {
                            modification.subj = '-';
                            modification.alertObj = true;
                            return modification;
                        })
                    );

                return reject;
            })
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
