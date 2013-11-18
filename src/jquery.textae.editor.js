    var editor = function() {
        var $textaeEditor = this;

        //cursor
        var setupWait = function(self) {
            var wait = function() {
                $textaeEditor.css('cursor', 'wait');
            };
            var endWait = function() {
                $textaeEditor.css('cursor', 'auto');
            }
            self.startWait = wait;
            self.endWait = endWait;
        };

        //entityTypes
        var entityTypes = function() {
            var types = {},
                defaultType = "",
                getColor = function() {
                    return this.color ? this.color : "#77DDDD";
                };

            return {
                setDefaultType: function(nameOfEntityType) {
                    defaultType = nameOfEntityType;
                },
                getDefaultType: function() {
                    return defaultType || entityTypes.getType(entityTypes.getSortedNames()[0]).name;
                },
                getType: function(nameOfEntityType) {
                    return types[nameOfEntityType] = types[nameOfEntityType] || {
                        getColor: getColor
                    };
                },
                set: function(newEntityTypes) {
                    // expected newEntityTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
                    types = {};
                    defaultType = "";
                    if (newEntityTypes !== undefined) {
                        newEntityTypes.forEach(function(newEntity) {
                            newEntity.getColor = getColor;
                            types[newEntity.name] = newEntity;
                            if (newEntity.
                                default === true) {
                                defaultType = newEntity.name;
                            }
                        });
                    }
                },
                //save number of type, to sort by numer when show entity pallet.
                incrementNumberOfTypes: function(nameOfEntityType) {
                    //access by square brancket, because nameOfEntityType is user input value, maybe 'null', '-', and other invalid indentifier name.
                    var type = entityTypes.getType(nameOfEntityType);
                    type.count = (type.count || 0) + 1;
                },
                getSortedNames: function() {
                    //sort by number of types
                    var typeNames = Object.keys(types);
                    typeNames.sort(function(a, b) {
                        return types[b].count - types[a].count;
                    });
                    return typeNames;
                }
            }
        }();

        //load/saveDialog
        var loadSaveDialog = function() {
            var getLoadDialog = function() {
                $body = $("body");
                var $dialog = $body.find("#textae.dialog.load");

                //make unless exists
                if ($dialog.length === 0) {
                    $dialog = $('<div id="textae.dialog.load" title="Load document with annotation.">')
                        .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                        .append('<div>Local :<input type="file"　/></div>');

                    //bind event handler
                    var onFileChange = function() {
                        var reader = new FileReader();
                        reader.onload = function() {
                            var annotation = JSON.parse(this.result);
                            $("body").trigger("textae.dialog.localfile.load", annotation);
                            $dialog.dialog("close");
                        };
                        reader.readAsText(this.files[0]);
                    }

                    $body.append($dialog);
                    $dialog.hide()
                    $dialog.find("input[type='file']").on("change", onFileChange);
                    $dialog.find("input[type='button']")
                        .on("click", function() {
                            var url = $dialog.find("input[type='text']").val();
                            $("body").trigger("textae.dialog.loadurl.select", url);
                            $dialog.dialog("close");
                        });
                }

                return $dialog;
            };
            return {
                showAccess: function(targetUrl) {
                    var $dialog = getLoadDialog();
                    $dialog
                        .find("input[type='text']")
                        .val(targetUrl);
                    $dialog
                        .dialog({
                            resizable: false,
                            width: 550,
                            height: 220,
                            modal: true,
                            buttons: {
                                Cancel: function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                },
                showSave: function(url, content) {
                    var getSaveDialog = function() {
                        $body = $("body");
                        var $dialog = $body.find("#textae.dialog.save");
                        if ($dialog.length === 0) {
                            $dialog = $('<div id="textae.dialog.save" title="Save document with annotation.">')
                                .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                                .append('<div>Local :<span class="span_link_place"><a target="_blank"/></span></div>');

                            $body.append($dialog);
                            $dialog.hide();
                            $dialog
                                .on("click", "a", function() {
                                    $("body").trigger("textae.dialog.localfile.save");
                                    $dialog.dialog("close");
                                })
                                .on("click", "input[type='button']", function() {
                                    $("body").trigger("textae.dialog.saveurl.select", $dialog.find("input[type='text']").val());
                                    $dialog.dialog("close");
                                });

                        }

                        return $dialog;
                    };

                    var createFileLink = function(contents, $save_dialog) {
                        var $fileInput = getLoadDialog().find("input[type='file']");

                        var file = $fileInput.prop("files")[0]
                        var name = file ? file.name : "annotations.json";
                        var blob = new Blob([contents], {
                            type: 'application/json'
                        });
                        var link = $save_dialog.find('a')
                            .text(name)
                            .attr("href", URL.createObjectURL(blob))
                            .attr("download", name);
                    };

                    var $dialog = getSaveDialog();

                    //create local link
                    createFileLink(content, $dialog);

                    //open dialog
                    $dialog
                        .find("input[type='text']")
                        .val(url);
                    $dialog
                        .dialog({
                            resizable: false,
                            width: 550,
                            height: 220,
                            modal: true,
                            buttons: {
                                Cancel: function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                }
            };
        }();

        //public to use on textae.js
        setupWait(this);
        this.entityTypes = entityTypes;
        this.loadSaveDialog = loadSaveDialog;

        return this;
    };


