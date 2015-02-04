var GetEditorDialog = require('./dialog/GetEditorDialog'),
    Handlebars = require('handlebars'),
    source = `
    <div class="textae-editor__valiondate-dialog__content">
        {{#if annotation.denotationHasLength}}
            <div>
                <h2>Spans are broken.</h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>begin</th>
                            <th>end</th>
                            <th>obj</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#annotation.denotationHasLength}}
                        <tr>
                            <td>{{id}}</td>
                            <td class="alert">{{span.begin}}</td>
                            <td class="alert">{{span.end}}</td>
                            <td>{{obj}}</td>
                        </tr>
                        {{/annotation.denotationHasLength}}
                    </tbody>
                </table>
            </div>
        {{/if}}
        {{#if annotation.denotationInText}}
            <div>
                <h2>Spans are out of text.</h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>begin</th>
                            <th>end</th>
                            <th>obj</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#annotation.denotationInText}}
                        <tr>
                            <td>{{id}}</td>
                            <td class="alert">{{span.begin}}</td>
                            <td class="alert">{{span.end}}</td>
                            <td>{{obj}}</td>
                        </tr>
                        {{/annotation.denotationInText}}
                    </tbody>
                </table>
            </div>
        {{/if}}
        {{#if annotation.denotationInParagraph}}
            <div>
                <h2>Spans are out of paragraphs.</h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>begin</th>
                            <th>end</th>
                            <th>obj</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#annotation.denotationInParagraph}}
                        <tr>
                            <td>{{id}}</td>
                            <td class="alert">{{span.begin}}</td>
                            <td class="alert">{{span.end}}</td>
                            <td>{{obj}}</td>
                        </tr>
                        {{/annotation.denotationInParagraph}}
                    </tbody>
                </table>
            </div>
        {{/if}}
        {{#if annotation.relationObj}}
            <div>
                <h2>Objects of relations are not exists.</h2>
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
                        {{#annotation.relationObj}}
                        <tr>
                            <td>{{id}}</td>
                            <td>{{pred}}</td>
                            <td>{{subj}}</td>
                            <td class="alert">{{obj}}</td>
                        </tr>
                        {{/annotation.relationObj}}
                    </tbody>
                </table>
            </div>
        {{/if}}
        {{#if annotation.relationSubj}}
            <div>
                <h2>Subjects of relations are not exists.</h2>
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
                    </tbody>
                </table>
            </div>
        {{/if}}
        {{#if annotation.modification}}
            <div>
                <h2>Objects of modifications are not exists.</h2>
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

        console.log(reject);

        var $content = $('<div>').attr('id', 'textae.dialog.validation.content'),
            $dialog = new GetEditorDialog(editor)(
                'textae.dialog.validation',
                'The following erronious annotations ignored',
                $content, {
                    noCancelButton: true,
                    height: 450
                }
            );

        $content[0]
            .innerHTML = tepmlate(reject);

        $dialog.open();
    }
};
