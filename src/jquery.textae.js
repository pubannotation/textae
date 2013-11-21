    jQuery.fn.textae = (function() {
        var texaeGod,
            initGod = function() {
                //init management object
                if (texaeGod === undefined) {
                    texaeGod = god();
                }
            };

        return function() {
            initGod();

            if (this.hasClass("textae-editor")) {
                this.each(function(){
                    var e = $(this);
                    texaeGod.pushEditor(e);
                    editor.apply(e);
                    e.api.start();
                    return e;
                })
            } else if (this.hasClass("textae-control")) {
                var c = control.apply(this);
                texaeGod.setControl(c);
                return c;
            }
        };
    })();