import {
    EventEmitter as EventEmitter
}
from 'events';

var bindEvent = function($target, event, func) {
        $target.on(event, func);
    },
    bindCloseEvent = function($dialog) {
        bindEvent($dialog, 'dialog.close', function() {
            $dialog.close();
        });
        return $dialog;
    },
    ajaxAccessor = require('../util/ajaxAccessor'),
    jQuerySugar = require('../util/jQuerySugar'),
    url = require('url');

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
    var dataSourceUrl = '',
        cursorChanger = require('../util/CursorChanger')(editor),
        getAnnotationFromServer = function(urlToJson) {
            cursorChanger.startWait();
            ajaxAccessor.getAsync(urlToJson, function getAnnotationFromServerSuccess(annotation) {
                api.emit('load', {
                    annotation: annotation,
                    source: jQuerySugar.toLink(url.resolve(location.href, urlToJson))
                });
                dataSourceUrl = urlToJson;
            }, function() {
                cursorChanger.endWait();
                alert("connection failed.");
            });
        },
        //load/saveDialog
        loadSaveDialog = function() {
            var extendOpenWithUrl = function($dialog) {
                    // Do not set twice.
                    if (!$dialog.openAndSetParam) {
                        $dialog.openAndSetParam = _.compose($dialog.open.bind($dialog), function(params) {
                            // Display dataSourceUrl.
                            this.find('[type="text"].url')
                                .val(dataSourceUrl)
                                .trigger('input');

                            $dialog.params = params;
                        });
                    }

                    return $dialog;
                },
                getDialog = _.compose(extendOpenWithUrl, bindCloseEvent, require('./dialog/GetEditorDialog')(editor)),
                label = {
                    URL: 'URL',
                    LOCAL: 'Local'
                },
                getLoadDialog = function(editorId) {
                    var getAnnotationFromFile = function(file) {
                            var firstFile = file.files[0],
                                reader = new FileReader();

                            reader.onload = function() {
                                var annotation = JSON.parse(this.result);
                                api.emit('load', {
                                    annotation: annotation,
                                    source: firstFile.name + '(local file)'
                                });
                            };
                            reader.readAsText(firstFile);
                        },
                        RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row'),
                        RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__load-dialog__label'),
                        OpenButton = _.partial(jQuerySugar.Button, 'Open'),
                        isUserComfirm = function() {
                            // The params was set hasAnythingToSave.
                            return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
                        },
                        $buttonUrl = new OpenButton('url'),
                        $buttonLocal = new OpenButton('local'),
                        $content = $('<div>')
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.URL),
                                $('<input type="text" class="textae-editor__load-dialog__file-name url" />'),
                                $buttonUrl
                            )
                        )
                        .on('input', '[type="text"].url', function() {
                            jQuerySugar.enabled($buttonUrl, this.value);
                        })
                        .on('click', '[type="button"].url', function() {
                            if (isUserComfirm()) {
                                getAnnotationFromServer(jQuerySugar.getValueFromText($content, 'url'));
                            }

                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.LOCAL),
                                $('<input class="textae-editor__load-dialog__file" type="file" />'),
                                $buttonLocal
                            )
                        )
                        .on('change', '[type="file"]', function() {
                            jQuerySugar.enabled($buttonLocal, this.files.length > 0);
                        })
                        .on('click', '[type="button"].local', function() {
                            if (isUserComfirm()) {
                                getAnnotationFromFile($content.find('[type="file"]')[0]);
                            }

                            $content.trigger('dialog.close');
                        });

                    // Capture the local variable by inner funcitons.
                    var $dialog = getDialog('textae.dialog.load', 'Load Annotations', $content);

                    return $dialog;
                },
                getSaveDialog = function(editorId) {
                    var showSaveSuccess = function() {
                            api.emit('save');
                            cursorChanger.endWait();
                        },
                        showSaveError = function() {
                            api.emit('save error');
                            cursorChanger.endWait();
                        },
                        saveAnnotationToServer = function(url, jsonData) {
                            cursorChanger.startWait();
                            ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function() {
                                cursorChanger.endWait();
                            });
                        },
                        createDownloadPath = function(contents) {
                            var blob = new Blob([contents], {
                                type: 'application/json'
                            });
                            return URL.createObjectURL(blob);
                        },
                        getFilename = function() {
                            var $fileInput = getLoadDialog(editorId).find("input[type='file']"),
                                file = $fileInput.prop('files')[0];

                            return file ? file.name : 'annotations.json';
                        },
                        RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__save-dialog__row'),
                        RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__save-dialog__label'),
                        $saveButton = new jQuerySugar.Button('Save', 'url'),
                        $content = $('<div>')
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.URL),
                                $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
                                $saveButton
                            )
                        )
                        .on('input', 'input.url', function() {
                            jQuerySugar.enabled($saveButton, this.value);
                        })
                        .on('click', '[type="button"].url', function() {
                            saveAnnotationToServer(jQuerySugar.getValueFromText($content, 'url'), $dialog.params);
                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.LOCAL),
                                $('<input type="text" class="textae-editor__save-dialog__local-file-name local">'),
                                $('<a class="download" href="#">Download</a>')
                            )
                        )
                        .on('click', 'a.download', function() {
                            var downloadPath = createDownloadPath($dialog.params);
                            $(this)
                                .attr('href', downloadPath)
                                .attr('download', jQuerySugar.getValueFromText($content, 'local'));
                            api.emit('save');
                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(),
                                $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>')
                            )
                        )
                        .on('click', 'a.viewsource', function(e) {
                            var downloadPath = createDownloadPath($dialog.params);
                            window.open(downloadPath, '_blank');
                            api.emit('save');
                            $content.trigger('dialog.close');
                            return false;
                        });

                    var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content);

                    // Set the filename when the dialog is opened.
                    $dialog.on('dialogopen', function() {
                        var filename = getFilename();
                        $dialog
                            .find('[type="text"].local')
                            .val(filename);
                    });

                    return $dialog;
                };

            return {
                showLoad: function(editorId, hasAnythingToSave) {
                    getLoadDialog(editorId).openAndSetParam(hasAnythingToSave);
                },
                showSave: function(editorId, jsonData) {
                    getSaveDialog(editorId).openAndSetParam(jsonData);
                }
            };
        }();

    var api = _.extend(new EventEmitter(), {
        getAnnotationFromServer: getAnnotationFromServer,
        showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
        showSave: _.partial(loadSaveDialog.showSave, editor.editorId),
    });

    return api;
};
