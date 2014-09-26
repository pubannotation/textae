var bindEvent = function($target, event, func) {
        $target.on(event, func);
    },
    bindCloseEvent = function($dialog) {
        bindEvent($dialog, 'dialog.close', function() {
            $dialog.close();
        });
        return $dialog;
    };

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
    var ajaxAccessor = require('../util/ajaxAccessor'),
        dataSourceUrl = '',
        cursorChanger = require('../util/CursorChanger')(editor),
        getAnnotationFromServer = function(url) {
            cursorChanger.startWait();
            ajaxAccessor.getAsync(url, function getAnnotationFromServerSuccess(annotation) {
                api.trigger('load', {
                    annotation: annotation,
                    source: '<a href="' + url + '">' + url + '</a>'
                });
                dataSourceUrl = url;
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
                                .trigger('keyup');

                            $dialog.params = params;
                        });
                    }

                    return $dialog;
                },
                getDialog = _.compose(extendOpenWithUrl, bindCloseEvent, require('../util/dialog/GetEditorDialog')(editor));
            var getLoadDialog = function(editorId) {
                    var getAnnotationFromFile = function(file) {
                            var firstFile = file.files[0],
                                reader = new FileReader();

                            reader.onload = function() {
                                var annotation = JSON.parse(this.result);
                                api.trigger('load', {
                                    annotation: annotation,
                                    source: firstFile.name + '(local file)'
                                });
                            };
                            reader.readAsText(firstFile);
                        },
                        makeOpenButton = function(className) {
                            return $('<input type="button" value="Open" disabled="disabled" />')
                                .addClass(className);
                        },
                        isUserComfirm = function() {
                            // The params was set hasAnythingToSave.
                            return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
                        },
                        $inputServer = makeOpenButton('server'),
                        $inputLocal = makeOpenButton('local'),
                        $content = $('<div>')
                        .append(
                            $('<div class="textae-editor__load-dialog__row">').append(
                                $('<label class="textae-editor__load-dialog__label">Server</label>'),
                                $('<input type="text" class="textae-editor__load-dialog__file-name url" />'),
                                $inputServer
                            )
                        )
                        .on('keyup', '[type="text"]', function() {
                            if (this.value) {
                                $inputServer.removeAttr('disabled');
                            } else {
                                $inputServer.attr('disabled', 'disabled');
                            }
                        })
                        .on('click', 'input.server', function() {
                            if (isUserComfirm()) {
                                var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                getAnnotationFromServer(url);
                            }

                            $content.trigger('dialog.close');
                        })
                        .append(
                            $('<div class="textae-editor__load-dialog__row">').append(
                                $('<label class="textae-editor__load-dialog__label">Local</label>'),
                                $('<input class="textae-editor__load-dialog__file" type="file" />'),
                                $inputLocal
                            )
                        )
                        .on('change', '[type="file"]', function() {
                            if (this.files.length > 0) {
                                $inputLocal.removeAttr('disabled');
                            } else {
                                $inputLocal.attr('disabled', 'disabled');
                            }
                        })
                        .on('click', 'input.local', function() {
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
                            api.trigger('save');
                            cursorChanger.endWait();
                        },
                        showSaveError = function() {
                            api.trigger('save error');
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
                        $content = $('<div>')
                        .append(
                            $('<div class="textae-editor__save-dialog__row">').append(
                                $('<label class="textae-editor__save-dialog__label">Server</label>'),
                                $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
                                $('<input type="button" class="textae-editor__save-dialog__save-server-button" value="Save" />')
                            )
                        )
                        .on('click', '.textae-editor__save-dialog__save-server-button', function() {
                            var url = $content.find('.textae-editor__save-dialog__server-file-name').val();
                            saveAnnotationToServer(url, $dialog.params);
                            $content.trigger('dialog.close');
                        })
                        .append(
                            $('<div class="textae-editor__save-dialog__row">').append(
                                $('<label class="textae-editor__save-dialog__label">Local</label>'),
                                $('<input type="text" class="textae-editor__save-dialog__local-file-name">'),
                                $('<a class="download" href="#">Download</a>')
                            )
                        )
                        .on('click', 'a.download', function() {
                            var downloadPath = createDownloadPath($dialog.params);
                            $(this)
                                .attr('href', downloadPath)
                                .attr('download', $content.find('.textae-editor__save-dialog__local-file-name').val());
                            api.trigger('save');
                            $content.trigger('dialog.close');
                        })
                        .append(
                            $('<div class="textae-editor__save-dialog__row">').append(
                                $('<label class="textae-editor__save-dialog__label"></label>'),
                                $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>')
                            )
                        )
                        .on('click', 'a.viewsource', function(e) {
                            var downloadPath = createDownloadPath($dialog.params);
                            window.open(downloadPath, '_blank');
                            api.trigger('save');
                            $content.trigger('dialog.close');
                            return false;
                        });

                    var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content);

                    // Set the filename when the dialog is opened.
                    $dialog.on('dialogopen', function() {
                        var filename = getFilename();
                        $dialog
                            .find('.textae-editor__save-dialog__local-file-name')
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

    var api = require('../util/extendBindable')({
        getAnnotationFromServer: getAnnotationFromServer,
        showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
        showSave: _.partial(loadSaveDialog.showSave, editor.editorId),
    });

    return api;
};