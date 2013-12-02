    // utility functions
    var textAeUtil = {
        // ajax wrapper
        ajaxAccessor: function() {
            var isEmpty = function(str) {
                return !str || str === "";
            };
            return {
                getSync: function(url) {
                    if (isEmpty(url)) {
                        return;
                    }

                    var result = null;
                    $.ajax({
                        type: "GET",
                        url: url,
                        async: false
                    }).done(function(data) {
                        result = data;
                    });
                    return result;
                },

                getAsync: function(url, dataHandler, finishHandler) {
                    if (isEmpty(url)) {
                        return;
                    }

                    $.ajax({
                        type: "GET",
                        url: url,
                        cache: false
                    })
                        .done(function(data) {
                            if (dataHandler !== undefined) {
                                dataHandler(data);
                            }
                        })
                        .fail(function(res, textStatus, errorThrown) {
                            alert("connection failed.");
                        })
                        .always(function(data) {
                            if (finishHandler !== undefined) {
                                finishHandler();
                            }
                        });
                },

                post: function(url, data, successHandler, failHandler, finishHandler) {
                    if (isEmpty(url)) {
                        return;
                    }

                    $.ajax({
                        type: "post",
                        url: url,
                        contentType: "application/json",
                        data: {
                            annotations: data
                        }
                    })
                        .done(successHandler)
                        .fail(failHandler)
                        .always(finishHandler);
                }
            };
        }(),

        // todo remove. but this is an only target of qunit tests. 
        getUrlParameters: function(url_query) {
            //if exists convert to string and parse
            var querys = url_query ? ("" + url_query).slice(1).split('&') : [];
            var targetUrl = "";
            var configUrl = "";
            var debug = false;

            querys
                .map(function(param) {
                    // convert string "key=value" to object.
                    var vals = param.split("=");
                    return {
                        key: vals[0],
                        val: vals[1]
                    };
                })
                .forEach(function(q) {
                    // parse parameters
                    switch (q.key) {
                        case 'target':
                            targetUrl = q.val;
                            break;
                        case 'config':
                            configUrl = q.val;
                            break;
                        case 'debug':
                            debug = true;
                            break;
                    }
                });

            return {
                target: targetUrl,
                config: configUrl,
                debug: debug
            };
        },

        makeInformationDialog: function() {
            //this is bound object.
            var showDialog = function(className, obj) {
                var getDialog = function() {
                    var $dialog = $("." + this.className);
                    // add dialog unless exists
                    if ($dialog.length === 0) {
                        $dialog = $("<div>")
                            .addClass("textae__information-dialog")
                            .addClass(this.className)
                            .hide();
                        this.addContentsFunc.call($dialog);
                        $("body").append($dialog);
                    }
                    return $dialog;
                };

                var setPositionCenter = function($dialog) {
                    var $window = $(window);
                    $dialog.css({
                        "position": "absolute",
                        "top": ($window.height() - $dialog.height()) / 2 + $window.scrollTop(),
                        "left": ($window.width() - $dialog.width()) / 2 + $window.scrollLeft()
                    });
                };

                //close other dialogs
                $(".textae__information-dialog").hide();

                //show at center
                var $dialog = getDialog.call(this);
                setPositionCenter($dialog);
                $dialog.show();
            };

            //this is bound object.
            var hideDialog = function(className) {
                $("." + this.className).hide();
            };

            //expected param has className and addContentsFunc.
            var bindObject = function(param) {
                return {
                    show: showDialog.bind(param),
                    hide: hideDialog.bind(param)
                };
            };

            //close dialog when dialog clicked.
            $(function() {
                $("body").on("mouseup", ".textae__information-dialog", function() {
                    $(this).hide();
                });
            });

            return bindObject;
        }(),
    };