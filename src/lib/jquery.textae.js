var tool = require('./tool'),
    control = require('./control'),
    editor = require('./editor');

jQuery.fn.textae = (function() {
    return function() {
        if (this.hasClass("textae-editor")) {
            this.each(function() {
                var e = $(this);
                tool.pushEditor(e);
                editor.apply(e);
                e.api.start(e);
                return e;
            });
            tool.selectFirstEditor();
        } else if (this.hasClass("textae-control")) {
            var c = control(this);
            tool.setControl(c);
            return c;
        }
    };
})();