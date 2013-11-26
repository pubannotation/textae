    jQuery.fn.textae = (function() {
        return function() {
            if (this.hasClass("textae-editor")) {
                this.each(function() {
                    var e = $(this);
                    tool.pushEditor(e);
                    editor.apply(e);
                    e.api.start();
                    return e;
                });
                tool.selectFirstEditor();
            } else if (this.hasClass("textae-control")) {
                var c = control.apply(this);
                tool.setControl(c);
                return c;
            }
        };
    })();