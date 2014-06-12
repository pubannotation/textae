    // A sub component to save and load data.
    var makeDataAccessObject = function(editor) {
        var dataSourceUrl = "",
            loadedFunc,
            savedFunc,
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
                        $messageArea = $("<div>").addClass("textae-editor__footer__message");
                        var $footer = $("<div>")
                            .addClass("textae-editor__footer")
                            .append($messageArea);
                        editor.append($footer);
                    }

                    return $messageArea;
                };
            }(editor),
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
                    loadedFunc(annotation);
                    setDataSourceUrl(url);
                }, function() {
                    cursorChanger.endWait();
                });
            },
            //load/saveDialog
            loadSaveDialog = function() {
                var getLoadDialog = function(editorId) {
                        var getAnnotationFromFile = function(file) {
                            var reader = new FileReader();
                            reader.onload = function() {
                                var annotation = JSON.parse(this.result);
                                loadedFunc(annotation);
                            };
                            reader.readAsText(file.files[0]);
                        };

                        var $content = $('<div>')
                            .append(
                                $('<div class="textae-editor__load-dialog__row">').append(
                                    $('<label class="textae-editor__load-dialog__label">Server</label>'),
                                    $('<input type="text" class="textae-editor__load-dialog__file-name" />'),
                                    $('<input class="server" type="button" value="Open" />')
                                )
                            )
                            .on('click', 'input.server',
                                function() {
                                    var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                    getAnnotationFromServer(url);
                                    $content.dialogClose();
                                }).append(
                                $('<div class="textae-editor__load-dialog__row">').append(
                                    $('<label class="textae-editor__load-dialog__label">Local</label>'),
                                    $('<input class="textae-editor__load-dialog__file" type="file" />'),
                                    $('<input class="local" type="button" value="Open" />')
                                )
                            )
                            .on('click', 'input.local',
                                function() {
                                    getAnnotationFromFile($content.find('[type="file"]')[0]);
                                    $content.dialogClose();
                                });

                        return textAeUtil.getDialog(editorId, 'textae.dialog.load', 'Load Annotations', $content);
                    },
                    getSaveDialog = function(editorId, jsonData) {
                        var showSaveSuccess = function() {
                                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                savedFunc();
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
                            setLocalLink = function($save_dialog, downloadPath) {
                                var getFilename = function() {
                                        var $fileInput = getLoadDialog().find("input[type='file']"),
                                            file = $fileInput.prop('files')[0];
                                        return file ? file.name : 'annotations.json';
                                    },
                                    setFileLink = function($save_dialog, downloadPath, name) {
                                        $save_dialog.find('a.download')
                                            .text(name)
                                            .attr('href', downloadPath)
                                            .attr('download', name);
                                    };

                                var name = getFilename();
                                setFileLink($save_dialog, downloadPath, name);
                                return $save_dialog;
                            };

                        var downloadPath = createDownloadPath(jsonData);

                        var $content = $('<div>')
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Server</label>'),
                                    $('<input type="text" class="textae-editor__save-dialog__file-name" />'),
                                    $('<input type="button" value="OK" />')
                                )
                            )
                            .on('click', '[type="button"]', function() {
                                var url = $content.find('.textae-editor__save-dialog__file-name').val();
                                saveAnnotationToServer(url, jsonData);
                                $content.dialogClose();
                            })
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Local</label>'),
                                    $('<a class="download" target="_blank">')
                                )
                            )
                            .on('click', 'a.download', function() {
                                savedFunc();
                                $content.dialogClose();
                            })
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Browser</label>'),
                                    $('<a class="viewsource" href="#">Click to view source on a new window.</a>')
                                )
                            )
                            .on('click', 'a.viewsource', function(e) {
                                window.open(downloadPath, '_blank');
                                savedFunc();
                                $content.dialogClose();
                                return false;
                            });

                        var $dialog = textAeUtil.getDialog(editorId, 'textae.dialog.save', 'Save Annotations', $content);

                        return setLocalLink($dialog, downloadPath);
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
            setLoaded: function(loaded) {
                loadedFunc = loaded;
            },
            setSaved: function(saved) {
                savedFunc = saved;
            }
        };
    };