//like a jQuery plugin
(function(jQuery) {
    jQuery.fn.textae = function() {
        var $textae_container = this;
        var elements = {};

        // DOM util
        var center = function($self) {
            var container = $textae_container;
            $self.css("position", "absolute");
            $self.css("top", (container.height() - $self.height()) / 2 + container.scrollTop() + "px");
            $self.css("left", (container.width() - $self.width()) / 2 + container.scrollLeft() + "px");
            return $self;
        };

        //help 
        var setupHelp = function setupHelp(self) {
            var showHelp = function() {
                var p = elements.$help;
                p.show();
                center(p);
                return false;
            };

            var hideHelp = function() {
                elements.$help.hide();
                return false;
            };

            elements.$help = $("<div>")
                .addClass("help")
                .hide()
                .on('mouseup', hideHelp)
                .append($("<h3>").text("Help (Keyboard short-cuts)"))
                .append($("<img>").attr("src", "images/keyhelp.png"));

            self.append(elements.$help);
            self.showHelp = showHelp;
            self.hideHelp = hideHelp;
        };


        //about
        var setupAbout = function setupAbout(self) {
            var showAbout = function() {
                var p = elements.$about;
                p.show();
                center(p);
                return false;
            };

            var hideAbout = function() {
                elements.$about.hide();
                return false;
            };

            elements.$about = $("<div>")
                .addClass("about")
                .hide()
                .on("mouseup", hideAbout)
                .html("<h3>About TextAE (Text Annotation Editor)</h3>" +
                    "<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>" +
                    "<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>" +
                    "<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。" +
                    "今後は自動アノテーションの種類を増やす計画です。</p>" +
                    "<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>" +
                    "<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。" +
                    "作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>" +
                    "<p>まだ開発中のサービスであり、実装すべき機能が残っています。" +
                    "ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>");

            self.append(elements.$about);
            self.showAbout = showAbout;
            self.hideAbout = hideAbout;
        };

        //cursor
        var setupWait = function setuoWait(self) {
            var wait = function() {
                $textae_container.css('cursor', 'wait');
            };
            var endWait = function() {
                $textae_container.css('cursor', 'auto');
            }
            self.startWait = wait;
            self.endWait = endWait;
        }

        //init
        setupHelp(this);
        setupAbout(this);
        setupWait(this);

        return this;
    };
})(jQuery);