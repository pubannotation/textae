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

        makeInformationModal: function() {
            //this is bound object.
            var showModal = function(className, obj) {
                var getModal = function() {
                    var $modal = $('.' + this.className);
                    // add modal unless exists
                    if ($modal.length === 0) {
                        $modal = $('<div>')
                            .addClass('textae__information-modal')
                            .addClass(this.className)
                            .hide();
                        this.addContentsFunc.call($modal);
                        $('body').append($modal);
                    }
                    return $modal;
                };

                var setPositionCenter = function($modal) {
                    var $window = $(window);
                    $modal.css({
                        'position': 'absolute',
                        'top': ($window.height() - $modal.height()) / 2 + $window.scrollTop(),
                        'left': ($window.width() - $modal.width()) / 2 + $window.scrollLeft()
                    });
                };

                //close other dialogs
                $('.textae__information-modal').hide();

                //show at center
                var $modal = getModal.call(this);
                setPositionCenter($modal);
                $modal.show();
            };

            //this is bound object.
            var hideModal = function(className) {
                $('.' + this.className).hide();
            };

            //expected param has className and addContentsFunc.
            var bindObject = function(param) {
                return {
                    show: showModal.bind(param),
                    hide: hideModal.bind(param)
                };
            };

            //close modal when modal clicked.
            $(function() {
                $('body').on('mouseup', '.textae__information-modal', function() {
                    $(this).hide();
                });
            });

            return bindObject;
        }(),

        getDialog: function(id, title, $content, noCancelButton) {
            var makeDialog = function() {
                var $dialog = $('<div>')
                    .attr('id', id)
                    .attr('title', title)
                    .hide()
                    .append($content);

                $.extend($dialog, {
                    open: function(defautlValue) {
                        this.dialog({
                            resizable: false,
                            width: 550,
                            height: 220,
                            modal: true,
                            buttons: noCancelButton ? {} : {
                                Cancel: function() {
                                    $(this).dialog('close');
                                }
                            }
                        });

                        if (defautlValue) {
                            this.find('[type="text"]')
                                .val(defautlValue);
                        }
                    },
                    close: function() {
                        this.dialog('close');
                    },
                });

                return $dialog;
            };

            var $body = $('body');
            var $dialog = $body.find('#' + id);

            //make unless exists
            if ($dialog.length === 0) {
                $dialog = makeDialog();

                $.extend($content, {
                    dialogClose: function() {
                        $dialog.close();
                    }
                });

                $body.append($dialog);
            }

            return $dialog;
        },
    };