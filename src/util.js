// utility functions
(function() {
    window.textAeUtil = {
        //bind event according to object like { event : function }
        //if use selector { event : {selector : selector , func : function } }
        bindEvents : function($target, events){
            var isFunction = function(func) {
                return func && {}.toString.call(func) === '[object Function]';
            };

            var value;
            for(var event in events){
                value = events[event];
                if(value){
                    if(isFunction(value)){
                        $target.on(event, value);
                    }else if(value.selector && value.func){
                        $target.on(event, value.selector, value.func);
                    }
                }
            }
        },

        // ajax wrapper
        ajaxAccessor : function(){
            var isEmpty = function(str){
                return !str || str === "";
            };
            return {
                getSync : function(url){
                    if(isEmpty(url)){
                        return;
                    }

                    var result = null;
                    $.ajax({
                        type: "GET",
                        url: url,
                        async: false
                    }).done(function(data){
                        result = data;
                    });
                    return result;
                },

                getAsync : function(url, dataHandler, finishHandler) {
                    if(isEmpty(url)){
                        return;
                    }

                    $.ajax({
                        type: "GET",
                        url: url,
                        cache: false
                    })
                    .done(function(data) {
                        if(dataHandler !== undefined){
                            dataHandler(data);
                        }
                    })
                    .fail(function(res, textStatus, errorThrown){
                        alert("connection failed.");
                    })
                    .always(function(data){
                        if(finishHandler !== undefined){
                            finishHandler();
                        }
                    });
                },

                post : function(url, data, successHandler, failHandler) {
                    if(isEmpty(url)){
                        return;
                    }

                    $.ajax({
                        type: "post",
                        url: url,
                        data: {annotations:data}
                    }).done(successHandler).fail(failHandler);
                }
            };
        }(),

        // set arg1 location.serach
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
            var makeBasicDialog = function() {
                $dialog = $("<div>")
                    .addClass("textae__information-dialog")
                    .addClass(this.className)
                    .hide()
                    .on('mouseup', function() {
                        hide(className);
                    });
                $dialog.addContents = this.addContentsFunc;

                return $dialog;
            };

            var makeDialog = function() {
                return makeBasicDialog.call(this)
                    .addContents();
            };

            var showDialog = function(className, obj) {
                var getDialog = function() {
                    var p = $("." + this.className);
                    // add dialog unless exists
                    if (p.length === 0) {
                        p = makeDialog.call(this);
                        $("body").append(p);
                    }
                    return p;
                };

                var setPositionCenter = function() {
                    var $window = $(window);
                    this.css({
                        "position": "absolute",
                        "top": ($window.height() - this.height()) / 2 + $window.scrollTop(),
                        "left": ($window.width() - this.width()) / 2 + $window.scrollLeft()
                    });
                };

                //close other dialogs
                $(".textae__information-dialog").hide();

                //show at center
                var dialog = getDialog.call(this);
                setPositionCenter.call(dialog);
                dialog.show();

                return false;
            };

            var hideDialog = function(className) {
                $("." + this.className).hide();
                return false;
            };

            var bindMethods = function(param) {
                return {
                    show: showDialog.bind(param),
                    hide: hideDialog.bind(param)
                };
            };

            return bindMethods;
        }()
    };
})();