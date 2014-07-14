    // A sub component to save and load data.
    module.exports = function(editor, confirmDiscardChangeMessage) {
        var textAeUtil = require('./textAeUtil'),
            dataSourceUrl = '',
            cursorChanger = function(editor) {
                var wait = function() {
                    this.addClass('textae-editor_wait');
                };
                var endWait = function() {
                    this.removeClass('textae-editor_wait');
                };
                return {
                    startWait: wait.bind(editor),
                    endWait: endWait.bind(editor),
                };
            }(editor),
            getMessageArea = function(editor) {
                return function() {
                    $messageArea = editor.find('.textae-editor__footer .textae-editor__footer__message');
                    if ($messageArea.length === 0) {
                        $messageArea = $('<div>').addClass('textae-editor__footer__message');
                        var $footer = $('<div>')
                            .addClass('textae-editor__footer')
                            .append($messageArea);
                        editor.append($footer);
                    }

                    return $messageArea;
                };
            }(editor),
            setDataSourceUrl = function(url) {
                if (url !== '') {
                    getMessageArea().html('(Target: <a href="' + url + '">' + url + '</a>)');
                    dataSourceUrl = url;
                }
            },
            getAnnotationFromServer = function(url) {
                cursorChanger.startWait();
                textAeUtil.ajaxAccessor.getAsync(url, function getAnnotationFromServerSuccess(annotation) {
                    api.trigger('load', annotation);
                    setDataSourceUrl(url);
                }, function() {
                    cursorChanger.endWait();
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
                    getDialog = _.compose(extendOpenWithUrl, textAeUtil.getDialog);
                var getLoadDialog = function(editorId) {
                        var getAnnotationFromFile = function(file) {
                                var reader = new FileReader();
                                reader.onload = function() {
                                    var annotation = JSON.parse(this.result);
                                    api.trigger('load', annotation);
                                };
                                reader.readAsText(file.files[0]);
                            },
                            makeOpenButton = function(className) {
                                return $('<input type="button" value="Open" disabled="disabled" />')
                                    .addClass(className);
                            },
                            isUserComfirm = function() {
                                // The params was set hasAnythingToSave.
                                return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
                            };

                        var $inputServer = makeOpenButton('server');
                        var $inputLocal = makeOpenButton('local');

                        var $content = $('<div>')
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

                                $content.dialogClose();
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

                                $content.dialogClose();
                            });

                        // Capture the local variable by inner funcitons.
                        var $dialog = getDialog(editorId, 'textae.dialog.load', 'Load Annotations', $content);

                        return $dialog;
                    },
                    getSaveDialog = function(editorId) {
                        var showSaveSuccess = function() {
                                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                api.trigger('save');
                                cursorChanger.endWait();
                            },
                            showSaveError = function() {
                                getMessageArea().html("could not save").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                cursorChanger.endWait();
                            },
                            saveAnnotationToServer = function(url, jsonData) {
                                cursorChanger.startWait();
                                textAeUtil.ajaxAccessor.post(url, {
                                    annotations: jsonData
                                }, showSaveSuccess, showSaveError, function() {
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
                            };

                        var $content = $('<div>')
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
                                $content.dialogClose();
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
                                $content.dialogClose();
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
                                $content.dialogClose();
                                return false;
                            });

                        var $dialog = getDialog(editorId, 'textae.dialog.save', 'Save Annotations', $content);

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

        var api = textAeUtil.extendBindable({
            getAnnotationFromServer: getAnnotationFromServer,
            showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
            showSave: _.partial(loadSaveDialog.showSave, editor.editorId),
        });

        return api;
    };