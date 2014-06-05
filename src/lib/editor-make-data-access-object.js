    // A sub component to save and load data.
    var makeDataAccessObject = function(editor, loaded, saved) {
        var cursorChanger = function(editor) {
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
                        $messageArea = $("<div>").addClass("textae-editor__footer__message");
                        var $footer = $("<div>")
                            .addClass("textae-editor__footer")
                            .append($messageArea);
                        editor.append($footer);
                    }

                    return $messageArea;
                };
            }(editor),
            dataSourceUrl = "",
            setDataSourceUrl = function(url) {
                if (url !== "") {
                    var targetDoc = url.replace(/\/annotations\.json$/, '');
                    getMessageArea().html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
                    dataSourceUrl = url;
                }
            },
            getAnnotationFromServer = function(url) {
                cursorChanger.startWait();
                textAeUtil.ajaxAccessor.getAsync(url, function getAnnotationFromServerSuccess(annotation) {
                    loaded(annotation);
                    setDataSourceUrl(url);
                }, function() {
                    cursorChanger.endWait();
                });
            },
            //load/saveDialog
            loadSaveDialog = function() {
                var getLoadDialog = function(editorId) {
                        var getAnnotationFromFile = function(fileEvent) {
                            var reader = new FileReader();
                            reader.onload = function() {
                                var annotation = JSON.parse(this.result);
                                loaded(annotation);
                            };
                            reader.readAsText(fileEvent.files[0]);
                        };

                        var $content = $('<div>')
                            .append('<div><label class="textae-editor__load-dialog__label">Server</label><input type="text" class="textae-editor__load-dialog__file-name" /><input type="button" value="OK" /></div>')
                            .append('<div><label class="textae-editor__load-dialog__label">Local</label><input type="file" /></div>')
                            .on('change', '[type="file"]',
                                function() {
                                    getAnnotationFromFile(this);
                                    $content.dialogClose();
                                })
                            .on('click', '[type="button"]',
                                function() {
                                    var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                    getAnnotationFromServer(url);
                                    $content.dialogClose();
                                });

                        return textAeUtil.getDialog(editorId, 'textae.dialog.load', 'Load document with annotation.', $content);
                    },
                    getSaveDialog = function(editorId, jsonData) {
                        var showSaveSuccess = function() {
                                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                saved();
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
                            setLocalLink = function($save_dialog, jsonData) {
                                var createDownloadPath = function(contents) {
                                        var blob = new Blob([contents], {
                                            type: 'application/json'
                                        });
                                        return URL.createObjectURL(blob);
                                    },
                                    getFilename = function() {
                                        var $fileInput = getLoadDialog().find("input[type='file']"),
                                            file = $fileInput.prop('files')[0];
                                        return file ? file.name : 'annotations.json';
                                    },
                                    setFileLink = function($save_dialog, downloadPath, name) {
                                        $save_dialog.find('a')
                                            .text(name)
                                            .attr('href', downloadPath)
                                            .attr('download', name);
                                    };

                                var downloadPath = createDownloadPath(jsonData);
                                var name = getFilename();
                                setFileLink($save_dialog, downloadPath, name);
                                return $save_dialog;
                            };

                        var $content = $('<div>')
                            .append('<div><label class="textae-editor__save-dialog__label">Server</label><input type="text" class="textae-editor__save-dialog__file-name" /><input type="button" value="OK" /></div>')
                            .append('<div><label class="textae-editor__save-dialog__label">Local</label><span class="span_link_place"><a target="_blank"/></span></div>')
                            .on('click', 'a', function() {
                                saved();
                                $content.dialogClose();
                            })
                            .on('click', '[type="button"]', function() {
                                var url = $content.find('.textae-editor__save-dialog__file-name').val();
                                saveAnnotationToServer(url, jsonData);
                                $content.dialogClose();
                            });

                        var $dialog = textAeUtil.getDialog(editorId, 'textae.dialog.save', 'Save document with annotation.', $content);

                        return setLocalLink($dialog, jsonData);
                    };

                return {
                    showLoad: function(editorId, url) {
                        getLoadDialog(editorId).open(url);
                    },
                    showSave: function(editorId, url, jsonData) {
                        getSaveDialog(editorId, jsonData).open(url);
                    }
                };
            }();

        return {
            getAnnotationFromServer: getAnnotationFromServer,
            showAccess: function() {
                loadSaveDialog.showLoad(editor.editorId, dataSourceUrl);
            },
            showSave: function(jsonData) {
                loadSaveDialog.showSave(editor.editorId, dataSourceUrl, jsonData);
            },
        };
    };