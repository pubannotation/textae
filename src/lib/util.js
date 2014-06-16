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

                    console.log("POST data", data);

                    $.ajax({
                        type: "post",
                        url: url,
                        contentType: "application/json",
                        data: data,
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        }
                    })
                        .done(successHandler)
                        .fail(failHandler)
                        .always(finishHandler);
                }
            };
        }(),

        // Usage sample: textAeUtil.getUrlParameters(location.search). 
        getUrlParameters: function(urlQuery) {
            // Remove ? at top.
            var queryString = urlQuery ? String(urlQuery).replace(/^\?(.*)/, '$1') : '';

            // Convert to array if exists
            var querys = queryString.length > 0 ? queryString.split('&') : [];

            return querys
                .map(function(param) {
                    // Convert string "key=value" to object.
                    var vals = param.split('=');
                    return {
                        key: vals[0],
                        val: vals[1]
                    };
                }).reduce(function(a, b) {
                    // Convert [{key: 'abc', val: '123'},...] to { abc: 123 ,...}
                    // Set value true if val is not set.
                    a[b.key] = b.val ? b.val : true;
                    return a;
                }, {});
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

        getDialog: function() {
            // Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
            var cash = {};

            return function(editorId, id, title, $content, noCancelButton) {
                var makeDialog = function(id) {
                    var $dialog = $('<div>')
                        .attr('id', id)
                        .attr('title', title)
                        .hide()
                        .append($content);

                    $.extend($dialog, {
                        open: function() {
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
                        },
                        close: function() {
                            this.dialog('close');
                        },
                    });

                    return $dialog;
                };

                var dialogId = editorId + '.' + id;

                if (cash.hasOwnProperty(dialogId)) {
                    return cash[dialogId];
                } else {
                    // Make unless exists
                    var $dialog = makeDialog(dialogId);

                    $.extend($content, {
                        dialogClose: function() {
                            $dialog.close();
                        }
                    });

                    $('body').append($dialog);
                    cash[dialogId] = $dialog;
                    return $dialog;
                }
            };
        }(),

        // A util function to fallent array with reduce. 
        flatten: function(a, b) {
            return a.concat(b);
        }
    };