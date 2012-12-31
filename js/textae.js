$(document).ready(function() {


    /**
     * デバッグ用
     *
     **/
    if (!('console' in window)) {

        window.console = {};
        window.console.log = function(str){
            return str;
        };
    }

    /*
     * css file url
     */
    var cssUrl;

    /*
     * spanの作成階数
     * chromeは1回目の場合
     * なぜか、cancelSelectを実行するので
     * 回数で判別する
     * 回数はロードしたときのannotatopnJsonの長さ
     */
    var createCount;

    /*
     * tooltipを見せるか
     */
    var isTooltip = true;


    /*
     *
     */
    var baseSpanHeight = 0;

    /*
     * 表示モード、初期値はviewモード
     */
    var mode = 'view';


    /*
     * annotationデータ
     */
    var annotationJson;

    /*
     * loadされた時のanntation IDの最大値
     */
    var loadedMaxId;

    /*
     * 選択されたspan要素
     * 複数の場合があるので配列で表す
     */
    var selectedIds = new Array();

    /*
     * 選択された要素のdoc_area内での順番
     */
    var selectedIdOrder;

    /*
     * 選択されたインスタンス
     */
    var selectedInstanceIds = new Array();

    /*
     * 選択されたmodification
     */
    var selectedModificationIds = new Array();



    /*
     * multipleで新規作成した時の
     * 不完全な要素のインデックス
     */
    var partialIds = new Array();


    /*
     * ctrlが押されているか
     */
    var isCtrl = false;

    /*
     * ctrl + altが押されているか
     */
    var isCtrlAlt = false;

    /*
     * shiftキーが押されているか
     */
    var isShift = false;

    /*
     * mutipleがonか
     */
    var isMultiple = true;

    /*
     * テーブルのsortの状態
     * num, new, cateの3種類
     */
    var sortStatus = 'new';


    /*
     * relationテーブルのsort状態
     */
    var sortConnStatus = "new";

    /*
     * 接続用span要素
     */
    var sourceElem = null;
    var targetElem = null;


    /*
     * テーブル描画、及びデータ送信用
     * コネクションデータの配列
     * 新規作成で追加,　削除で削除
     */
    var connArray;

    /*
     * span編集モード時に隠すコネクションデータ保存用
     */
    var hideConnArray = new Array();

    /*
     * 一時的に隠すコネクションデータ保存用
     */
    var tmpHidedConnArray = new Array();

    /*
     * 選択されたコネクションオブジェクトの配列
     * connection objectが入ります
     */
    var selectedConns = new Array();

    /*
     * 線の透明度
     */
    var connOpacity = 0.5;


    /*
     * insannsのデータ
     */
    var insanns;

    // insannsのソート方法、初期値は新しい順
    var sortInsannsStatus = 'new';


    /*
     * modannsのデータ
     */
    var modanns;

    /*
     * modannsのデータ
     */
    var sortModannsStatus = 'new';

    /*
     * conf.txtより読み取る設定値
     */
    var delimitCharacters = "";
    var boundaryCharacters = "";
    var categories = new Array();
    var relations = new Array();
    var instypes = new Array();
    var modtypes = new Array();
    var defaultCategory = "";
    var defaultRelation = "";
    var defaultInstype = "";
    var defaultModtype = "";

    /*
     * 正規表現にて特別な意味をもつ文字
     */
    var metaCharacters = '^$.*+?=!:|\\/()[]{}';

    /*
     * urlのtargetパラメータ
     * text, annotationをGET、POSTするURL
     */
    var targetUrl = '';

    /*
     * config urlから読み取った、json形式の設定値
     */
    var configJson;

    /*
     * msg_areaに文字列を表示
     */
    function showTitle(title) {
        $('#title_area').html("<b>Editing: </b>" + title);
    }

    /*
     * slider初期化
     */
    function initSlider() {

        $('#slider').slider({
            range: "max",
            min: 0,
            max: 10,
            step: 1,
            value: connOpacity*10,
            stop: function( event, ui ) {
                connOpacity = ((ui.value)*0.1).toFixed(1);
                $( "#slider_value" ).html(connOpacity);
                changeConnectionOpacity(connOpacity);
            },
            slide: function( event, ui ) {
                connOpacity = ((ui.value)*0.1).toFixed(1);
                $( "#slider_value" ).html(connOpacity);
            }
        });
        $( "#slider_value" ).html( $("#slider").slider( "value" )*0.1);
    }


    /*
     * urlパラメータの取得
     */
    function getUrlParameters() {
        var params = location.search.replace('?', '').split('&');
        //console.log('params:', params);
        var configUrl = "";

        for(var i in params) {
            var param = params[i];
            if(param.split('=')[0] == 'target') {
                targetUrl = param.split('=')[1];
            }

            if(param.split('=')[0] == 'config') {
                configUrl = param.split('=')[1];
            }
        }


        if(configUrl != "") {

            //console.log("config が指定されています");
            $.ajax({
                type: "GET",
                url: configUrl,
                dataType: "jsonp",
                jsonpCallback : 'callback',
                success: function(data) {
                    //console.log('data:', data);
                    configJson = data;

                    makeConfig(configJson);
                    reloadAnnotation();
                },
                error: function() {
                    //console.log('error!');
                    alert('cannot get config!');
                }
            });
        } else {
            //console.log("config が指定されていません");

            $.ajax({
                type: "GET",
                url: "conf.json",
                dataType: "json",
                //success:function(confdata) {
                success: function(data) {
                    //console.log('conf.json:', data);
                    configJson = data;

                    makeConfig(configJson);
                    reloadAnnotation();
                },
                error: function() {
                    //console.log('error!');
                }
            });
        }
        //console.log('targetUrl:', targetUrl);
    }

    /*
     * config
     */
    function makeConfig(configJson){
        //console.log(configJson['delimiter_characters'].toString());

        var delimiter_characters = configJson['delimiter_characters'];
        var boundary_characters = configJson['boundary_characters'];
        var category_types = configJson['categories'];
        var instance_types = configJson['instance types'];
        var relation_types = configJson['relation types'];
        var modification_types = configJson['modification types'];
        var css = configJson["css"];

        //var css = "http://localhost/test.css";
        // css
        //console.log('css:', css);
        //console.log('xx:', configJson['xx']);

        cssUrl = css;

        if(cssUrl != undefined) {
            $('#css_area').html('<link rel="stylesheet" href="' + css + '"/>');
        }

        //document.write('<link rel="stylesheet" href="' + css + '">');

        for(var i in delimiter_characters) {
            delimitCharacters += delimiter_characters[i];
        }

        for(var i in boundary_characters) {
            boundaryCharacters += boundary_characters[i];
        }

        for(var i in category_types) {
            var obj = category_types[i];
            var str = '';
            str += obj["name"] + "|";
            if(obj["uri"] != undefined) {
                str += obj["uri"] + "|";
            } else {
                str += "" + "|"
            }

            if(obj["color"] != undefined) {
                str += obj["color"] + "|";
            } else {
                str += "" + "|";
            }

            if(obj["default"]) {
                str += 'default';
            }

            //console.log(str);
            categories.push(str);

        }

        for(var i in instance_types) {
            var obj = instance_types[i];
            var str = '';
            str += obj["name"] + "|";
            if(obj["uri"] != undefined) {
                str += obj["uri"] + "|";
            } else {
                str += "" + "|"
            }

            if(obj["color"] != undefined) {
                str += obj["color"] + "|";
            } else {
                str += "" + "|";
            }

            if(obj["default"]) {
                str += 'default';
            }

            //console.log(str);
            instypes.push(str);

        }

        for(var i in relation_types) {
            var obj = relation_types[i];
            var str = '';
            str += obj["name"] + "|";
            if(obj["uri"] != undefined) {
                str += obj["uri"] + "|";
            } else {
                str += "" + "|"
            }

            if(obj["color"] != undefined) {
                str += obj["color"] + "|";
            } else {
                str += "" + "|";
            }

            if(obj["default"]) {
                str += 'default';
            }

            //console.log(str);
            relations.push(str);

        }

        for(var i in modification_types) {
            var obj = modification_types[i];
            var str = '';
            str += obj["name"] + "|";
            if(obj["uri"] != undefined) {
                str += obj["uri"] + "|";
            } else {
                str += "" + "|"
            }

            if(obj["color"] != undefined) {
                str += obj["color"] + "|";
            } else {
                str += "" + "|";
            }

            if(obj["default"]) {
                str += 'default';
            }

            //console.log(str);
            modtypes.push(str);

        }

        makeCategory(categories);
        makeRelation(relations);
        makeInstype(instypes);
        makeModtype(modtypes);

        initSlider();

        $('#show_tooltip_cb').change(function() {
            if($(this).attr('checked')) {
              //console.log('checkされています');
                $("#doc_area span").map(function() {
                    $(this).attr('title', $(this).attr('class'));
                    //$('.tooltip').css('visibility', 'visible');
                    //makeTooltip();
                });

                $('#rel_area > svg').map(function(){

                    $(this).attr('title', $(this).attr('class').split(' ')[1]);
                    /*
                    for(var i in relations) {
                        var reltype = relations[i].split("|")[0];

                        console.log('reltype:', reltype);
                        if($(this).hasClass(reltype)) {
                            console.log("aru--");
                            $(this).attr('title', reltype);
                        }
                    }
                    */

                    var classes = $(this).attr('class');
                    //console.log(classes);
                });

            } else {
                //console.log('checkされていません');
                $("#doc_area > span").removeAttr('title');
                //$('.tooltip').css('visibility', 'hidden');
                $('#rel_area svg').removeAttr('title');

            }

        });

        // delimitCharacters = configJson['delimiter_characters'].toString();
    }



    getUrlParameters();

    /*
     * 操作のundoキュー
     */
    var undoNameArray = new Array();

    /*
     * 操作のredoキュー
     */
    var redoNameArray = new Array();


    /*
     * 各データに対応するundo storage
     */
    var undoCatannsArray = new Array();
    var undoRelannsArray = new Array();
    var undoInsannsArray = new Array();
    var undoModannsArray = new Array();




    /*
     * 各データに対応するredo storage
     */
    var redoCatannsArray = new Array();
    var redoRelannsArray = new Array();
    var redoInsannsArray = new Array();
    var redoModannsArray = new Array();


    /*
     * baseElemにdivの高さを揃える
     * 使っていません
     */
    function adjustDivHeight(targetElem, baseElem) {
        targetElem.height(baseElem.height());
    }

    /*
     * baseElemにアノテーションリストの高さを揃える
     * 使っていません
     */
    function adjustListHeight(targetElem, baseElem) {
        var baseHeight = baseElem.height() - $('.table_header').height() - $('.btn_area').height() - parseInt(baseElem.css("paddingTop")) - parseInt(baseElem.css("paddingBottom"));
        targetElem.height(baseHeight);
    }

    /*
     * jsPlumbの初期化
     */
    function initJsPumb() {
        jsPlumb.reset();

        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.Defaults.Container = $("#rel_area");

        jsPlumb.bind("jsPlumbConnection", function(info) {
            //console.log('connection complete!');
        });


    }




    /*
     * アノテーションデータのロード
     */
    function loadAnnotation() {
        //console.log('load annotation');
        initJsPumb();

        targetUrl = $('#load_url').val();

        //$('#relation_btn').attr("src", 'images/relation_off_btn.png');

        $.ajax({
            type: "GET",
            url: targetUrl,
            dataType: "jsonp",
            jsonp : 'callback',
            success: function(data) {
                /* success */


                sessionStorage.clear();
                undoNameArray = new Array();
                redoNameArray = new Array();
                undoCatannsArray = new Array();
                undoRelannsArray = new Array();
                undoInsannsArray = new Array();
                undoModannsArray = new Array();

                redoCatannsArray = new Array();
                redoRelannsArray = new Array();
                redoInsannsArray = new Array();
                redoModannsArray = new Array();

                changeButtonState($('#undo_btn'), undoNameArray);
                changeButtonState($('#redo_btn'), redoNameArray);

                var doc = data.text;

                $("#src_area").html(doc);
                $("#doc_area").html(doc);

                annotationJson = data.catanns;
                //console.log('annotationJson.length:', annotationJson.length);

                //createCount = annotationJson.length;


                var now = (new Date()).getTime();

                // DLした時間を代入する
                for(var i in annotationJson) {
                    annotationJson[i]["created_at"] = now;
                }

                // load時のannotation idの最大値
                loadedMaxId = getCateMaxId();
                //console.log('IDの最大値:', loadedMaxId);

                $("#annojson").text(JSON.stringify(annotationJson));

                sortNumJson(annotationJson);
                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);
                addCategoryColor(categories);

                // storageに格納
                //setCurrentStorage(annotationJson);
                //saveCurrentCatanns();
               // saveCurrent("catanns");
                sessionStorage.setItem('document', doc);
                sessionStorage.setItem('targetUrl', targetUrl);


                // insannsのロード
                if(data.insanns != undefined) {
                    insanns = data.insanns;
                } else {
                    insanns = new Array();
                }

                // DLした時間を代入する
                for(var i in insanns) {
                    insanns[i]["created_at"] = now;
                }

                makeInstanceTable();
                makeInstance(insanns);
                addInstypeColor(instypes);
                //addInstanceBorderColor(categories);

                //setCurrentInsannsStorage(insanns);
                //saveCurrentInsanns();
                //saveCurrent("insanns");

                hideConnArray = new Array();
                tmpHidedConnArray = new Array();

                //いまのところ
                if(data.relanns != undefined) {
                    connArray = data.relanns;
                } else {
                    connArray = new Array();
                }

                // distanceをつける
                for(var i in connArray) {
                    var conn = connArray[i];
                    addDistanceToRelation(conn);
                }
                // distanceでソート
                sortConnByDistance(connArray);

                for(var j in connArray) {

                    var conn = connArray[j];


                    var sId = conn['subject'];
                    var tId = conn['object'];

                    var color;
                    for(var k in relations) {
                        if(relations[k].split('|')[0] == conn['type']) {
                            color = relations[k].split('|')[2];
                        }
                    }

                    var rgba = colorTrans(color);
                    var connId = conn['id'];
                    var type = conn['type'];

                    // DLした時間を代入する
                    conn["created_at"] = now;


                    //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId, selectFlag, labelText, modId, cssClass);
                   // makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");

                    // modificationなしのrelation
                    makeConnection2(sId, tId, type, rgba, connId, "unselected");
                }


                makeRelationTable();
                addRelationColor(relations);

                //setCurrentConnStorage(connArray);
                //saveCurrentRelanns();
                //saveCurrent("relanns");


                // modannsのロード
                if(data.modanns != undefined) {
                    modanns = data.modanns;
                } else {
                    modanns = new Array();
                }

                // DLした時間を代入する
                for(var i in modanns) {
                    modanns[i]["created_at"] = now;
                }

                makeModificationTable();
                makeModification(modanns);
                addModtypeColor(modtypes);

                //setCurrentModannsStorage(modanns);
                //saveCurrentModanns();
                //saveCurrent("modanns");


                changeMode("view");


                // urlの表示
                showTitle(targetUrl);

                saveCurrent("catanns_insanns_relanns_modanns");


                //console.log('undoNameArray:', undoNameArray);
            },
            error: function(res, textStatus, errorThrown){
                //console.log("エラー:", res);
                $('#load_dialog').hide();
                $('#msg_area').html("unknown error").fadeIn().fadeOut(10000, function() {
                    $(this).html('').removeAttr('style');
                });
            }
        });
    }


    /*
     * reloadしたとき
     */

    function reloadAnnotation() {

        if(targetUrl != '') {

            //console.log('reload 749');
            initJsPumb();

            var category;
            var relation;
            var instype;
            var modtype;

            showTitle(targetUrl);



            // documentとcatanns, relanns, insanns, modannsをロード
            $.ajax({
                type: "GET",
                url: targetUrl,
                dataType: "jsonp",
                jsonp : 'callback',
                success: function(data) {
                    /* success */
                    var doc = data.text;

                    if(sessionStorage.getItem('document') != null && sessionStorage.getItem('document') == doc) {
                        // documentがstorageのものと同じなので,storageからデータを取り出す
                        doc = sessionStorage.getItem('document');
                        $("#src_area").html(doc);
                        $("#doc_area").html(doc);

                        //adjustDivHeight($('#anno_area'), $('#doc_area'));
                        //adjustDivHeight($('#category_area'), $('#doc_area'));
                        //adjustDivHeight($('#relation_area'), $('#doc_area'));
                        //adjustDivHeight($('#relcategory_area'), $('#doc_area'));
                        //adjustListHeight($('#anno_list_area'), $('#anno_area'));

                        // catannsはstorageから
                        // var annoJsonStr = sessionStorage.getItem('current');
                        //annotationJson = JSON.parse(annoJsonStr);
                        //annotationJson = loadCurrentCatanns();
                        annotationJson = loadCurrent("catanns")

                        //createCount = annotationJson.length;

                        $("#annojson").text(JSON.stringify(annotationJson));

                        sortNumJson(annotationJson);

                        markAnnotation(annotationJson);
                        makeAnnoTable(annotationJson);
                        addCategoryColor(categories);


                        //insanns = loadCurrentInsanns();
                        insanns = loadCurrent("insanns");

                        makeInstanceTable();
                        makeInstance(insanns);
                        addInstypeColor(instypes);

                        //saveCurrentInsanns();
                        //saveCurrent("insanns");


                        //connArray = loadCurrentRelanns();
                        connArray = loadCurrent("relanns");

                        // distanceをつける
                        for(var i in connArray) {
                            var conn = connArray[i];
                            addDistanceToRelation(conn);
                        }


                        sortConnByDistance(connArray);

                        makeRelationTable();
                        addRelationColor(relations);

                        jsPlumb.reset();

                        for(var j in connArray) {
                            var conn = connArray[j];
                            var sId = conn['subject'];
                            var tId = conn['object'];

                            var color;
                            for(var k in relations) {
                                if(relations[k].split('|')[0] == conn['type']) {
                                    color = relations[k].split('|')[2];
                                }
                            }

                            var rgba = colorTrans(color);
                            var connId = conn['id'];
                            var type = conn['type'];

                            //console.log('sElem:', sElem);


                            //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                            //makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");

                            makeConnection2(sId, tId, type, rgba, connId, "unselected");
                            // jsPlumb.deleteEndpoint(endpoints[0]);
                            //jsPlumb.deleteEndpoint(endpoints[1]);

                        }

                        //saveCurrentRelanns();
                        //saveCurrent("relanns");


                        var modannsStr = sessionStorage.getItem('currentModanns');

                        if(modannsStr == null) {
                            modanns = new Array();
                        } else {
                            modanns = JSON.parse(modannsStr);
                        }

                        makeModificationTable();
                        makeModification(modanns);
                        addModtypeColor(modtypes);

                        //saveCurrentModanns();
                        //saveCurrent("modanns");

                        saveCurrent("catanns_insanns_relanns_modanns");

                        mode = sessionStorage.getItem('mode');

                        changeMode(mode);

                        //initSlider();


                        undoNameArray = new Array();
                        redoNameArray = new Array();
                        undoCatannsArray = new Array();
                        undoRelannsArray = new Array();
                        undoInsannsArray = new Array();
                        undoModannsArray = new Array();

                        redoCatannsArray = new Array();
                        redoRelannsArray = new Array();
                        redoInsannsArray = new Array();
                        redoModannsArray = new Array();

                        changeButtonState($('#undo_btn'), undoNameArray);
                        changeButtonState($('#redo_btn'), redoNameArray);


                    } else {
                        //console.log('reload 899');
                        initJsPumb();

                        sessionStorage.clear();

                        undoNameArray = new Array();
                        redoNameArray = new Array();
                        undoCatannsArray = new Array();
                        undoRelannsArray = new Array();
                        undoInsannsArray = new Array();
                        undoModannsArray = new Array();

                        redoCatannsArray = new Array();
                        redoRelannsArray = new Array();
                        redoInsannsArray = new Array();
                        redoModannsArray = new Array();
                        changeButtonState($('#undo_btn'), undoNameArray);
                        changeButtonState($('#redo_btn'), redoNameArray);

                        var doc = data.text;

                        $("#src_area").html(doc);
                        $("#doc_area").html(doc);

                        annotationJson = data.catanns;

                        //createCount = annotationJson.length;

                        var now = (new Date()).getTime();

                        // DLした時間を代入する
                        for(i in annotationJson) {
                            annotationJson[i]["created_at"] = now;
                        }

                        // load時のannotation idの最大値
                        loadedMaxId = getCateMaxId();
                        //console.log('IDの最大値:', loadedMaxId);

                        $("#annojson").text(JSON.stringify(annotationJson));

                        sortNumJson(annotationJson);
                        markAnnotation(annotationJson);
                        makeAnnoTable(annotationJson);
                        addCategoryColor(categories);

                        // storageに格納
                        //setCurrentStorage(annotationJson);
                        //saveCurrentCatanns();
                        //saveCurrent("catanns");
                        sessionStorage.setItem('document', doc);
                        sessionStorage.setItem('targetUrl', targetUrl);


                        // insannsのロード
                        if(data.insanns != undefined) {
                            insanns = data.insanns;
                        } else {
                            insanns = new Array();
                        }

                        // DLした時間を代入する
                        for(var i in insanns) {
                            insanns[i]["created_at"] = now;
                        }


                        makeInstanceTable();
                        makeInstance(insanns);
                        addInstypeColor(instypes);
                        //addInstanceBorderColor(categories);

                        //setCurrentInsannsStorage(insanns);
                        //saveCurrentInsanns();


                        hideConnArray = new Array();
                        tmpHidedConnArray = new Array();

                        //いまのところ
                        if(data.relanns != undefined) {
                            connArray = data.relanns;
                        } else {
                            connArray = new Array();
                        }


                        //addDistanceToRelation();
                        //sortConnByDistance(connArray);


                        for(var j in connArray) {
                            var conn = connArray[j];
                            var sId = conn['subject'];
                            var tId = conn['object'];

                            conn["created_at"] = now;

                            var color;
                            for(var k in relations) {
                                if(relations[k].split('|')[0] == conn['type']) {
                                    color = relations[k].split('|')[2];
                                }
                            }

                            var rgba = colorTrans(color);
                            var connId = conn['id'];
                            var type = conn['type'];


                            //console.log('sElem:', sElem);



                            //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                            //makeConnection(sId, tId, type, rgba, connId,"unselected", "", "", "");
                            makeConnection2(sId, tId, type, rgba, connId,"unselected");

                        }


                        makeRelationTable();
                        addRelationColor(relations);

                        //setCurrentConnStorage(connArray);
                        //saveCurrentRelanns();
                        //saveCurrent("relanns");

                        // modannsのロード
                        if(data.modanns != undefined) {
                            modanns = data.modanns;
                        } else {
                            modanns = new Array();
                        }

                        // DLした時間を代入する
                        for(var i in modanns) {
                            modanns[i]["created_at"] = now;
                        }

                        makeModificationTable();
                        makeModification(modanns);
                        addModtypeColor(modtypes);

                        //setCurrentModannsStorage(modanns);
                        //saveCurrentModanns();
                        //saveCurrent("modanns");
                        //initSlider();

                        saveCurrent("catanns_insanns_relanns_modanns");

                        // urlの表示
                        showTitle(targetUrl);

                    }
                    sessionStorage.setItem('document', doc);
                }
            });



        } else {
            //console.log('reload 1061');
            // 通常のリロード
            //console.log('リロードされました');
            if(sessionStorage.getItem('document') != null) {

                initJsPumb();

                var category;
                var relation;
                var instype;
                var modtype;

                // documentがstorageのものと同じなので,storageからデータを取り出す
                var doc = sessionStorage.getItem('document');
                targetUrl = sessionStorage.getItem('targetUrl');

                showTitle(targetUrl);

                $("#src_area").html(doc);
                $("#doc_area").html(doc);

                //adjustDivHeight($('#anno_area'), $('#doc_area'));
                //adjustDivHeight($('#category_area'), $('#doc_area'));
                //adjustDivHeight($('#relcategory_area'), $('#doc_area'));
                //adjustDivHeight($('#relation_area'), $('#doc_area'));
                //adjustListHeight($('#anno_list_area'), $('#doc_area'));
                // adjustListHeight($('#rel_list_area'), $('#doc_area'));

                // catannsはstorageから
                //var annoJsonStr = sessionStorage.getItem('current');
                //annotationJson = JSON.parse(annoJsonStr);
                annotationJson = loadCurrent("catanns");

                //createCount = annotationJson.length;

                $("#annojson").text(JSON.stringify(annotationJson));
                sortNumJson(annotationJson);

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);
                addCategoryColor(categories);


                connArray = loadCurrent("relanns");

                makeRelationTable();
                addRelationColor(relations);


                insanns = loadCurrent("insanns");

                makeInstanceTable();
                makeInstance(insanns);
                addInstypeColor(instypes);

                //setCurrentInsannsStorage(insanns);
                //saveCurrentInsanns();
                //saveCurrent("insanns");

                // addInstanceBorderColor(categories);



                jsPlumb.reset();

                for(var j in connArray) {
                    var conn = connArray[j];
                    var sId = conn['subject'];
                    var tId = conn['object'];

                    var color;
                    for(var k in relations) {
                        if(relations[k].split('|')[0] == conn['type']) {
                            color = relations[k].split('|')[2];
                        }
                    }

                    var rgba = colorTrans(color);
                    var connId = conn['id'];
                    var type = conn['type'];

                    //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                    //makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");
                    makeConnection2(sId, tId, type, rgba, connId, "unselected");

                    // jsPlumb.deleteEndpoint(endpoints[0]);
                    //jsPlumb.deleteEndpoint(endpoints[1]);

                }

                mode = sessionStorage.getItem('mode');

                changeMode(mode);

                var modannsStr = sessionStorage.getItem('currentModanns');

                if(modannsStr == null) {
                    modanns = new Array();
                } else {
                    modanns = JSON.parse(modannsStr);
                }

                makeModificationTable();
                makeModification(modanns);
                addModtypeColor(modtypes);

                //setCurrentModannsStorage(modanns);
                //saveCurrentModanns();
                //saveCurrent("modanns");
                //   initSlider();

                saveCurrent("catanns_insanns_relanns_modanns");

                undoNameArray = new Array();
                redoNameArray = new Array();
                undoCatannsArray = new Array();
                undoRelannsArray = new Array();
                undoInsannsArray = new Array();
                undoModannsArray = new Array();

                redoCatannsArray = new Array();
                redoRelannsArray = new Array();
                redoInsannsArray = new Array();
                redoModannsArray = new Array();
                changeButtonState($('#undo_btn'), undoNameArray);
                changeButtonState($('#redo_btn'), redoNameArray);

            } else {
                $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

            }
        }
    }

    function addDistanceToRelation(conn) {
       // for(var i in connArray) {
            //var conn = connArray[i];
            var sId = conn['subject'];
            var tId = conn['object'];




            sourceElem = $('#' + sId);
            targetElem = $('#' + tId);


            var padding_left = parseInt($('#doc_area').css('padding-left'));
            var padding_top = parseInt($('#doc_area').css('padding-top'));

            // console.log('doc_area　トップ:', $('#doc_area').get(0).offsetTop);
            var doc_area_top = $('#doc_area').get(0).offsetTop;
            var doc_area_left = $('#doc_area').get(0).offsetLeft;

            //var source_id = sourceElem.attr('id');
            //var target_id = targetElem.attr('id');

            var sourceX, sourceY;
            var targetX, targetY;

            if(sId.substr(0,1) == "T") {
                // span要素
                sourceX = sourceElem.get(0).offsetLeft - padding_left;
                sourceY = sourceElem.get(0).offsetTop - padding_top;
            } else {
                sourceX = sourceElem.get(0).offsetLeft - doc_area_left;
                sourceY = sourceElem.get(0).offsetTop - doc_area_top;
            }

            if(tId.substr(0,1) == "T") {
                // span要素
                targetX = targetElem.get(0).offsetLeft - padding_left;
                targetY = targetElem.get(0).offsetTop - padding_top;
            } else {
                targetX = targetElem.get(0).offsetLeft - doc_area_left;
                targetY = targetElem.get(0).offsetTop - doc_area_top;
            }

            // dunnySpanから計算されたspanの右上の位置
            var sourceRX;
            var sourceRY;

            var targetRX;
            var targetRY;

            for(i in annotationJson) {
                var anno = annotationJson[i];
                if(anno["id"] == sId) {
                    sourceRX = anno["x"];
                    sourceRY = anno["y"];
                }
                if(anno["id"] == tId) {
                    targetRX = anno["x"];
                    targetRY = anno["y"];
                }
            }

            var sourceWidth = sourceElem.outerWidth();
            var sourceHeight = sourceElem.outerHeight();
            var targetWidth = targetElem.outerWidth();
            var targetHeight = targetElem.outerHeight();


            //console.log('位置:', sourceX, ":", sourceY, ":", sourceWidth, ":", sourceHeight);

            var sourceRealWidth = $('#m_' + sId).outerWidth();
            var sourceRealHeight = $('#m_' + sId).outerHeight();

            // 行数
            var sourceLineNum = Math.floor(sourceHeight / sourceRealHeight);

            // 行高さ
            var lineHeight = parseInt($('#doc_area').css('lineHeight'));

            // 中央の値
            var source_center;
            var target_center;



            if((sId.substr(0,1) == "T") && (tId.substr(0,1) == "T") ) {
                // 両方がspan
                source_center = sourceX + (sourceRX - sourceX)/2;
                target_center = targetX + (targetRX - targetX)/2;



            } else {
                // どちらかがインスタンス
                if(tId.substr(0,1) == "T") {
                    // targetがspan, sourceがインスタンス

                    source_center = (sourceX + 10/2); // 10はinstanceの幅
                    target_center = targetX + (targetRX - targetX)/2;


                } else if(sId.substr(0,1) == "T") {
                    // targetがインスタンス、sourceがspan



                    source_center = sourceX + (sourceRX - sourceX)/2;
                    target_center = (targetX + 10/2); // 10はinstanceの幅



                } else {
                    // 両方がinstance


                    source_center = (sourceX + 10/2); // 10はinstanceの幅
                    target_center = (targetX + 10/2); // 10はinstanceの幅




                }
            }

            var disX = source_center - target_center;
            var disY = sourceY - targetY;

            var distance = Math.sqrt(disY * disY + disX * disX);

            conn['distance'] = distance;


        //}

    }

    function sortConnByDistance(connArray) {
        function compare(a, b) {

            //if(a["id"] == "R10" || a["id"] == "R11") {


                //console.log('a:', a["distance"]);
                //console.log('b:', b["distance"]);
        //}
            return(b['distance'] - a['distance']);
        }
        connArray.sort(compare);
    }




    /*
     * 現状の保存
     */
    function saveCurrent(name) {

        //console.log('saveCurrent:', name);

        saveUndoNameStorage(name);

        var names = name.split('_');

        // redoNameを空にする
        redoNameArray.splice(0, redoNameArray.length);

        for(var i = 0; i < names.length; i++) {
            if(names[i] == "catanns") {
                redoCatannsArray.splice(0, redoCatannsArray.length);

                if(annotationJson != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentCatanns') != null && sessionStorage.getItem('currentCatanns') != "undefined") {
                        //console.log('以前のcatannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }

                    sessionStorage.setItem('currentCatanns', JSON.stringify(annotationJson));
                }
            } else if(names[i] == "insanns") {
                redoInsannsArray.splice(0, redoInsannsArray.length);

                if(insanns != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentInsanns') != null && sessionStorage.getItem('currentInsanns') != "undefined") {
                        //console.log('以前のinsannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }
                    sessionStorage.setItem('currentInsanns', JSON.stringify(insanns));
                }

            } else if(names[i] == "relanns") {
                redoRelannsArray.splice(0, redoCatannsArray.length);

                if(connArray != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentRelanns') != null && sessionStorage.getItem('currentRelanns') != "undefined") {
                        //console.log('以前のrelannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }
                    sessionStorage.setItem('currentRelanns', JSON.stringify(connArray));
                }

            } else if(names[i] == "modanns") {
                redoModannsArray.splice(0, redoModannsArray.length);

                if(modanns != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentModanns') != null && sessionStorage.getItem('currentModanns') != "undefined") {
                        //console.log('以前のmodannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }
                    sessionStorage.setItem('currentModanns', JSON.stringify(modanns));
                }

            }
        }
    }

    /*
     * 現状のロード
     */
    function loadCurrent(name) {
        var str;
        if(name == "catanns") {
            str = sessionStorage.getItem('currentCatanns');
            if(str == null) {
                return new Array();
            } else {
                return JSON.parse(str);
            }
        } else if(name == "insanns") {
            str = sessionStorage.getItem('currentInsanns');
            if(str == null) {
                return new Array();
            } else {
                return JSON.parse(str);
            }
        } else if(name == "relanns") {
            str = sessionStorage.getItem('currentRelanns');
            if(str == null) {
                return new Array();
            } else {
                return JSON.parse(str);
            }
        } else if(name == "modanns") {
            str = sessionStorage.getItem('currentModanns');
            if(str == null) {
                return new Array();
            } else {
                return JSON.parse(str);
            }
        }
    }

    /*
    function saveCurrentCatanns() {

        console.log('-----------saveCurrentCatanns-------');


        redoArray.splice(0, redoArray.length);

        if(annotationJson != undefined) {
            //前の状態を取り出して、それをundoStorageに保存する
            if(sessionStorage.getItem('currentCatanns') != null && sessionStorage.getItem('currentCatanns') != "undefined") {
                console.log('以前のcatannsを取り出します');
                var prev = loadCurrentCatanns();
                saveUndoStorage(prev, "catanns");
            }

            sessionStorage.setItem('currentCatanns', JSON.stringify(annotationJson));
        }

    }

    function loadCurrentCatanns() {
        var str = sessionStorage.getItem('currentCatanns');
        if(str == null) {
            return new Array();
        } else {
            return JSON.parse(str);
        }
    }

    function saveCurrentRelanns() {
        console.log('saveCurrentRelanns');

        // redoを空にする
        redoNameArray.splice(0, redoNameArray.length);
        redoArray.splice(0, redoArray.length);


        if(connArray != undefined) {
            //前の状態を取り出して、それをundoStorageに保存する
            if(sessionStorage.getItem('currentRelanns') != null && sessionStorage.getItem('currentRelanns') != "undefined") {
                console.log('以前のrelannsを取り出します');
                var prev = loadCurrentRelanns();
                saveUndoStorage(prev, "relanns");
            }
            sessionStorage.setItem('currentRelanns', JSON.stringify(connArray));
        }

    }

    function loadCurrentRelanns() {

        // redoを空にする
        //redoNameArray.splice(0, redoNameArray.length);
        //redoArray.splice(0, redoArray.length);

        var str = sessionStorage.getItem('currentRelanns');
        if(str == null) {
            return new Array();
        } else {
            return JSON.parse(str);
        }
    }

    function saveCurrentInsanns() {

        // redoを空にする
        redoNameArray.splice(0, redoNameArray.length);
        redoArray.splice(0, redoArray.length);

        if(insanns != undefined) {
            //前の状態を取り出して、それをundoStorageに保存する
            if(sessionStorage.getItem('currentInsanns') != null && sessionStorage.getItem('currentInsanns') != "undefined") {
                console.log('以前のinsannsを取り出します');
                var prev = loadCurrentInsanns();
                saveUndoStorage(prev, "insanns");
            }
            sessionStorage.setItem('currentInsanns', JSON.stringify(insanns));
        }

    }

    function loadCurrentInsanns() {

        // redoを空にする
        //redoNameArray.splice(0, redoNameArray.length);
        //redoArray.splice(0, redoArray.length);

        var str = sessionStorage.getItem('currentInsanns');
        if(str == null) {
            return new Array();
        } else {
            return JSON.parse(str);
        }
    }


    function saveCurrentModanns() {

        // redoを空にする
        redoNameArray.splice(0, redoNameArray.length);
        redoArray.splice(0, redoArray.length);

        console.log('---------saveCurrentModanns-------------');

        if(modanns != undefined) {
            //前の状態を取り出して、それをundoStorageに保存する
            if(sessionStorage.getItem('currentModanns') != null && sessionStorage.getItem('currentModanns') != "undefined") {
                console.log('以前のmodannsを取り出します');
                var prev = loadCurrentModanns();
                saveUndoStorage(prev, "modanns");
            }
            sessionStorage.setItem('currentModanns', JSON.stringify(modanns));
        }

    }

    function loadCurrentModanns() {
        var str = sessionStorage.getItem('currentModanns');
        if(str == null) {
            return new Array();
        } else {
            return JSON.parse(str);
        }
    }
    */

    /*
     * 操作名のundo storageへの保存
     */
    function saveUndoNameStorage(name) {
        undoNameArray.push(name);
        sessionStorage.setItem('undoName', JSON.stringify(undoNameArray));
        //console.log(name,'を保存しました');
    }

    /*
     * データのundo storageへの保存
     */
    function saveUndoStorage(ary, name) {

        //undoNameArray.push(name);
        //sessionStorage.setItem('undoName', JSON.stringify(undoNameArray));

        if(name == "catanns") {
            undoCatannsArray.push(ary);
            sessionStorage.setItem('undoCatanns',  JSON.stringify(undoCatannsArray));
        } else if(name == "insanns") {
            undoInsannsArray.push(ary);
            sessionStorage.setItem('undoInsanns',  JSON.stringify(undoInsannsArray));
        } else if(name == "relanns") {
            undoRelannsArray.push(ary);
            sessionStorage.setItem('undoRelanns',  JSON.stringify(undoRelannsArray));
        } else if(name == "modanns") {
            undoModannsArray.push(ary);
            sessionStorage.setItem('undoModanns',  JSON.stringify(undoModannsArray));

        }

        /*
        // -でばらす
        var names = name.split('_');

        for(var i = 0; i < names.length; i++) {
            if(names[i] == "catanns") {
                undoCatannsArray.push(ary);
                sessionStorage.setItem('undoCatanns',  JSON.stringify(undoCatannsArray));
            } else if(names[i] == "insanns") {
                undoInsannsArray.push(ary);
                sessionStorage.setItem('undoInsanns',  JSON.stringify(undoInsannsArray));
            } else if(names[i] == "relanns") {
                undoRelannsArray.push(ary);
                sessionStorage.setItem('undoRelanns',  JSON.stringify(undoRelannsArray));
            } else if(names[i] == "modanns") {
                undoModannsArray.push(ary);
                sessionStorage.setItem('undoModanns',  JSON.stringify(undoModannsArray));

            }
        }
        */

        //undoArray.push(ary);
        //sessionStorage.setItem('undo',  JSON.stringify(undoArray));

        changeButtonState($('#undo_btn'), undoNameArray);
        changeButtonState($('#redo_btn'), redoNameArray);
    }

    /*
     * 操作名のredo storageへの保存
     */
    function saveRedoNameStorage(name) {
        redoNameArray.push(name);
        sessionStorage.setItem('redoName', JSON.stringify(redoNameArray));
    }

    /*
     * データのredo storageへの保存
     */
    function saveRedoStorage(ary, name) {


        //redoNameArray.push(ary, name);
        //sessionStorage.setItem('redoName', JSON.stringify(redoNameArray));

        // -でばらす
        var names = name.split('_');

        for(var i = 0; i < names.length; i++) {
            if(names[i] == "catanns") {
                redoCatannsArray.push(ary);
                sessionStorage.setItem('redoCatanns',  JSON.stringify(redoCatannsArray));
            } else if(names[i] == "insanns") {
                redoInsannsArray.push(ary);
                sessionStorage.setItem('redoInsanns',  JSON.stringify(redoInsannsArray));
            } else if(names[i] == "relanns") {
                redoRelannsArray.push(ary);
                sessionStorage.setItem('redoRelanns',  JSON.stringify(redoRelannsArray));
            } else if(names[i] == "modanns") {
                redoModannsArray.push(ary);
                sessionStorage.setItem('redoModanns',  JSON.stringify(redoModannsArray));

            }
        }

        /*
        redoArray.push(ary);
        sessionStorage.setItem('redo',  JSON.stringify(redoArray));
        */

        changeButtonState($('#undo_btn'), undoNameArray);
        changeButtonState($('#redo_btn'), redoNameArray);
    }



    /*
     * click undo button
     */
    $('#undo_btn').click(function() {
        // 選択状態は解除
        selectedIds.splice(0, selectedIds.length);
        selectedInstanceIds.splice(0, selectedInstanceIds.length);
        selectedModificationIds.splice(0., selectedModificationIds.length);


        doUndo();
        return false;
    });

    /*
     * click redo button
     */
    $('#redo_btn').click(function(e) {
        // 選択状態は解除
        selectedIds.splice(0, selectedIds.length);
        selectedInstanceIds.splice(0, selectedInstanceIds.length);
        selectedModificationIds.splice(0., selectedModificationIds.length);

        doRedo();
        return false;
    });

    /*
     * Undo
     */
    function doUndo() {

        undoNameArray = JSON.parse(sessionStorage.getItem('undoName'));

        //console.log('以前の操作列：', undoNameArray);


        var undoName = undoNameArray.pop();

        // popしたものを戻す
        sessionStorage.setItem('undoName', JSON.stringify(undoNameArray));

        // redoに操作名を保存
        saveRedoNameStorage(undoName);

        //console.log('以前の操作：', undoName);

        var names = undoName.split('_');

        for(var i in names) {
            var name = names[i];

            if(name == "catanns") {
                //console.log(name,'を操作しました');


                saveRedoStorage(annotationJson, name);

                undoCatannsArray = JSON.parse(sessionStorage.getItem('undoCatanns'));

                //console.log('以前のcatanns列：', undoCatannsArray);

                annotationJson  = undoCatannsArray.pop();

                //console.log('取り出したcatanns:', annotationJson);


                sessionStorage.setItem('currentCatanns', JSON.stringify(annotationJson));
                // popしたものを戻す
                sessionStorage.setItem('undoCatanns', JSON.stringify(undoCatannsArray));

            } else if(name == "relanns") {
                //console.log(name,'を操作しました');

                saveRedoStorage(connArray, name);


                undoRelannsArray = JSON.parse(sessionStorage.getItem('undoRelanns'));
                connArray = undoRelannsArray.pop();

                sessionStorage.setItem('currentRelanns', JSON.stringify(connArray));
                // popしたものを戻す
                sessionStorage.setItem('undoRelanns', JSON.stringify(undoRelannsArray));


            } else if(name == "insanns") {
                //console.log(name,'を操作しました');

                saveRedoStorage(insanns, name);

                undoInsannsArray = JSON.parse(sessionStorage.getItem('undoInsanns'));

                //console.log('以前のcatanns列：', undoInsannsArray);

                insanns = undoInsannsArray.pop();

                sessionStorage.setItem('currentInsanns', JSON.stringify(insanns));
                // popしたものを戻す
                sessionStorage.setItem('undoInsanns', JSON.stringify(undoInsannsArray));

            } else if(name == "modanns") {
                //console.log(name,'を操作しました');

                saveRedoStorage(modanns, name);

                undoModannsArray = JSON.parse(sessionStorage.getItem('undoModanns'));
                modanns = undoModannsArray.pop();

                sessionStorage.setItem('currentModanns', JSON.stringify(modanns));
                // popしたものを戻す
                sessionStorage.setItem('undoModanns', JSON.stringify(undoModannsArray));

            }
        }



        if(undoNameArray.length == 0) {
            $('#undo_btn').prop("disabled", true);
            $('#undo_btn').css('opacity', 0.3);
        }

        sortNumJson(annotationJson);
        markAnnotation(annotationJson);
        makeAnnoTable(annotationJson);
        addCategoryColor(categories);



        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);

        jsPlumb.reset();
        for(var j in connArray) {
            var conn = connArray[j];
            var sId = conn['subject'];
            var tId = conn['object'];

            var color;
            for(var k in relations) {
                if(relations[k].split('|')[0] == conn['type']) {
                    color = relations[k].split('|')[2];
                }
            }

            var rgba = colorTrans(color);
            var connId = conn['id'];
            var type = conn['type'];

            //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId, selectFlag, labelText, modId, cssClass);
            // makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");

            // modificationなしのrelation
            makeConnection2(sId, tId, type, rgba, connId, "unselected");
        }


        makeRelationTable();
        addRelationColor(relations);

        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);

        //console.log('undo操作後');
        //console.log('undoNameArray:', undoNameArray);
        //console.log('redoNameArray:', redoNameArray);

    }

    /*
     * Redo
     */
    function doRedo() {
        redoNameArray = JSON.parse(sessionStorage.getItem('redoName'));

        var redoName = redoNameArray.pop();

        //console.log('戻す操作列：', redoNameArray);
        //console.log('戻す操作：', redoName);

        saveUndoNameStorage(redoName);

        // popしたものを戻す
        sessionStorage.setItem('redoName', JSON.stringify(redoNameArray));

        var names = redoName.split('_');

        for(var i in names) {

        var name = names[i];

        if(name == "catanns") {
            //console.log(name,'を戻します------');

            redoCatannsArray = JSON.parse(sessionStorage.getItem('redoCatanns'));
            annotationJson  = redoCatannsArray.pop();

            //console.log('--もどしたannotationJson:', annotationJson);

            if(annotationJson != undefined) {
                //前の状態を取り出して、それをundoStorageに保存する
                if(sessionStorage.getItem('currentCatanns') != null && sessionStorage.getItem('currentCatanns') != "undefined") {
                    //console.log('以前のcatannsを取り出します');
                    var prev = loadCurrent("catanns");
                    saveUndoStorage(prev, name);
                }

                sessionStorage.setItem('currentCatanns', JSON.stringify(annotationJson));

                // popしたものを戻す
                sessionStorage.setItem('redoCatanns', JSON.stringify(redoCatannsArray));
            }

            //saveCurrentCatanns();


        } else if(name == "relanns") {
            //console.log(name,'を操作しました');
            redoRelannsArray = JSON.parse(sessionStorage.getItem('redoRelanns'));
            connArray = redoRelannsArray.pop();

            if(connArray != undefined) {
                //前の状態を取り出して、それをundoStorageに保存する
                if(sessionStorage.getItem('currentRelanns') != null && sessionStorage.getItem('currentRelanns') != "undefined") {
                    //console.log('以前のrelannsを取り出します');
                    var prev = loadCurrent("relanns");
                    saveUndoStorage(prev, name);
                }
                sessionStorage.setItem('currentRelanns', JSON.stringify(connArray));

                // popしたものを戻す
                sessionStorage.setItem('redoRelanns', JSON.stringify(redoRelannsArray));
            }

            //saveCurrentRelanns();


        } else if(name == "insanns") {
            //console.log(name,'を操作しました');
            redoInsannsArray = JSON.parse(sessionStorage.getItem('redoInsanns'));
            insanns = redoInsannsArray.pop();

            if(insanns != undefined) {
                //前の状態を取り出して、それをundoStorageに保存する
                if(sessionStorage.getItem('currentInsanns') != null && sessionStorage.getItem('currentInsanns') != "undefined") {
                    //console.log('以前のinsannsを取り出します');
                    var prev = loadCurrent("insanns");
                    saveUndoStorage(prev, name);
                }
                sessionStorage.setItem('currentInsanns', JSON.stringify(insanns));

                // popしたものを戻す
                sessionStorage.setItem('redoInsanns', JSON.stringify(redoInsannsArray));
            }
            //saveCurrentInsanns();



        } else if(name == "modanns") {
            //console.log(redoName,'を操作しました');
            redoModannsArray = JSON.parse(sessionStorage.getItem('redoModanns'));
            modanns = redoModannsArray.pop();

            if(modanns != undefined) {
                //前の状態を取り出して、それをundoStorageに保存する
                if(sessionStorage.getItem('currentModanns') != null && sessionStorage.getItem('currentModanns') != "undefined") {
                    //console.log('以前のmodannsを取り出します');
                    var prev = loadCurrent("modanns");
                    saveUndoStorage(prev, name);
                }
                sessionStorage.setItem('currentModanns', JSON.stringify(modanns));

                // popしたものを戻す
                sessionStorage.setItem('redoModanns', JSON.stringify(redoModannsArray));
            }
            //saveCurrentModanns();
        }
        }



        //sessionStorage.setItem('redo', JSON.stringify(redoArray));

        if(undoNameArray.length == 0) {
            $('#redo_btn').prop("disabled", true);
            $('#redo_btn').css('opacity', 0.3);
        }

        sortNumJson(annotationJson);
        markAnnotation(annotationJson);
        makeAnnoTable(annotationJson);
        addCategoryColor(categories);



        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);


        jsPlumb.reset();
        for(var j in connArray) {
            var conn = connArray[j];
            var sId = conn['subject'];
            var tId = conn['object'];

            var color;
            for(var k in relations) {
                if(relations[k].split('|')[0] == conn['type']) {
                    color = relations[k].split('|')[2];
                }
            }

            var rgba = colorTrans(color);
            var connId = conn['id'];
            var type = conn['type'];

            //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId, selectFlag, labelText, modId, cssClass);
            // makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");

            // modificationなしのrelation
            makeConnection2(sId, tId, type, rgba, connId, "unselected");
        }

        //console.log('------------here-----');

        makeRelationTable();
        addRelationColor(relations);

        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);

        //console.log('redo操作後');
        //console.log('redoNameArray:', redoNameArray);
        //console.log('undoNameArray:', undoNameArray);



    }


    /*
     * undo, redoのボタン状態を変更
     */
    function changeButtonState(elem, array) {

        //console.log('elem:', elem);
        //console.log('array.length:', array.length);

        if(array.length == 0) {
            elem.prop("disabled", true);
            elem.css('opacity', 0.3);
        } else {
            elem.prop("disabled", false);
            elem.css('opacity', 1.0);
        }
    }

    /*
     * アノテーション新規作成ボタンをクリック
     */
    $('#new_btn').click(function() {
        // annoJsonに追加

        var maxId = getCateMaxId();
        maxId = maxId + 1;

        var obj = new Object();
        obj['begin'] = 0;
        obj['end'] = 0;
        obj['category'] = defaultCategory;
        obj['id'] = "T" + maxId;
        annotationJson.push(obj);

        sortNumJson(annotationJson);

        selectedIds.push(maxId);

        $("#annojson").text(JSON.stringify(annotationJson));

        markAnnotation(annotationJson);
        makeAnnoTable(annotationJson);

        addCategoryColor(categories);
    });

    /*
     * Category リストの作成
     */
    function makeCategory(categories) {
        var html = '<form><table>';

        for(var i = 0; i <categories.length; i++) {

            if(categories[i].split("|")[3] == "default") {
                defaultCategory = categories[i].split("|")[0];

                html += '<tr style="background-color:' + categories[i].split("|")[2]  + '">'
                    + '<td><input type="radio" name="category" checked class="category_radio"></td>'
                    + '<td title="' + categories[i].split("|")[1] + '" class="category_apply_btn">' + categories[i].split("|")[0]  + '</td>'
                    + '<td><a href="' + categories[i].split("|")[1] + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + categories[i].split("|")[2]  + '">'
                    + '<td><input type="radio" name="category" class="category_radio"></td>'
                    + '<td title="' + categories[i].split("|")[1] + '" class="category_apply_btn">' + categories[i].split("|")[0]  + '</td>'
                    + '<td><a href="' + categories[i].split("|")[1] + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            }
        }

        html += '</table></form>';
        $('#category_list').html(html);

    }

    /*
     * Relation Categoryリストの作成
     */
    function makeRelation(relations) {
        // connection type
        var connTypeObj = new Object();

        var html = '<form><table><tr class="hide_all_checkbox">' +
            '<td></td>' +
            '<td>all</td>' +
            '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var i = 0; i < relations.length; i++) {
            //console.log('relation:', relations[i].split("|")[3]);

            var relation_name = relations[i].split("|")[0];
            var url = relations[i].split("|")[1];
            var color = relations[i].split("|")[2];
            //var defaultRelation = relations[i].split("|")[3];

            if(relations[i].split("|")[3] == "default") {
                defaultRelation = relations[i].split("|")[0];

                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="relation" checked class="relation_radio"></td>'
                    + '<td title="' + relations[i].split("|")[1] + '" class="relation_apply_btn">' + relation_name  + '</td>'
                    + '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="' + relation_name  + '" checked></td>'
                    + '<td><a href="' + relations[i].split("|")[1] + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + relations[i].split("|")[2]  + '">'
                    + '<td><input type="radio" name="relation" class="relation_radio"></td>'
                    + '<td title="' + url + '" class="relation_apply_btn">' + relation_name  + '</td>'
                    + '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="' + relation_name +  '" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            }

            var objStr = '{"' + relation_name + '":{paintStyle:{strokeStyle:"' + color + '", lineWidth:2 }}}';

            var obj = new Object();
            obj[relation_name] = {paintStyle:{strokeStyle:color, lineWidth:2}};

            jsPlumb.registerConnectionTypes(obj);

        }

        html += '</table></form>';

        $('#relation_list').html(html);

    }



    /*
     * Instance Typeリストの作成
     */
    function makeInstype(instypes) {

        //console.log('------ make instance types--');

        var html = '<form><table><tr class="hide_all_checkbox">' +
            '<td></td>' +
            '<td>all</td>' +
            '<td><input type="checkbox" name="instype_hide" class="instype_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var i = 0; i < instypes.length; i++) {
            //console.log('relation:', relations[i].split("|")[3]);

            var instype = instypes[i].split("|")[0];
            var url = instypes[i].split("|")[1];
            var color = instypes[i].split("|")[2];
            //var defaultRelation = relations[i].split("|")[3];

            if(instypes[i].split("|")[3] == "default") {
                defaultInstype = instype[i].split("|")[0];

                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="instype" checked class="instype_radio"></td>'
                    + '<td title="' + instype + '" class="instype_apply_btn">' + instype  + '</td>'
                    + '<td><input type="checkbox" name="instype_hide" class="instype_hide" title="' + instype + '" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="instype" class="instype_radio"></td>'
                    + '<td title="' + url + '" class="instype_apply_btn">' + instype  + '</td>'
                    + '<td><input type="checkbox" name="instype_hide" class="instype_hide" title="' + instype + '" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            }

        }

        html += '</table></form>';

        $('#instype_list').html(html);

    }


    /*
     * Modification Typeリストの作成
     */
    function makeModtype(modtypes) {

        //console.log('------ make modification types--');

        var html = '<form><table><tr class="hide_all_checkbox">' +
            '<td></td>' +
            '<td>all</td>' +
            '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var i = 0; i < modtypes.length; i++) {
            //console.log('relation:', relations[i].split("|")[3]);

            var modtype = modtypes[i].split("|")[0];
            var url = modtypes[i].split("|")[1];
            var color = modtypes[i].split("|")[2];
            //var defaultRelation = relations[i].split("|")[3];

            if(modtypes[i].split("|")[3] == "default") {
                defaultModtype = modtype[i].split("|")[0];

                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="modtype" checked class="modtype_radio"></td>'
                    + '<td title="' + modtype + '" class="modtype_apply_btn">' + modtype  + '</td>'
                    + '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="' + modtype + '" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="modtype" class="modtype_radio"></td>'
                    + '<td title="' + url + '" class="modtype_apply_btn">' + modtype  + '</td>'
                    + '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="' + modtype + '" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            }

        }

        html += '</table></form>';

        $('#modtype_list').html(html);

    }


    /*
     * annotation listの作成
     */
    function makeAnnoTable(annoJson) {


        if(sortStatus == 'new') {
            sortNewJson(annoJson);
        } else if(sortStatus == 'num') {
            sortNumJson(annoJson);
        } else if(sortStatus == 'cate') {
            sortCateJson(annoJson);
        }

        // 新規追加された部分
        var newHtml = '';
        // 従来の部分
        //var annoHtml = '';

        var htmlStr = '';

        //引数はannotation jsonとクラス名のレベル
        function makeTable(annoJson){

            $.each(annoJson, function(i, anno) {
                htmlStr += '<tr><td>'
                        + '<table class="annotation t_' + anno.category + '" id="t_' + anno.id + '"><tr>'
                        + '<td><div>' + anno.id + '</div></td>'
                        + '<td><div class="edit_able" id="startPos_' + anno.id + '">' + anno['span']['begin']  + '</div></td>'
                        + '<td><div class="edit_able" id="endPos_' + anno.id + '">' + anno['span']['end'] + '</div></td>'
                        + '<td><div class="category" id="annotation_' + anno.id + '">' + anno.category + '</div></td>'
                        + '<td><img src="images/remove_btn.png" class="removeBtn"/></td>'
                        + '</tr></table>'
                        + '</td></tr>';

            });

            return htmlStr;
        }

        $('#anno_list_area').html('<table id="annotable">' + makeTable(annoJson) + '</table>');
        //$('#anno_new_area').html('<table id="newtable">' + newHtml + '</table>');




        for(var i = 0; i < annoJson.length; i++) {
            if(selectedIds != null) {
                for(var j = 0; j < selectedIds.length; j++) {
                    if(annoJson[i]['id'] == selectedIds[j]) {
                        $('#t_' + annoJson[i]['id']).addClass('t_selected');
                    }
                }
            }
        }

        for(i in partialIds) {
            $('#t_' + partialIds[i]).addClass('t_partial').addClass('t_selected').addClass('t_partialSelected');
        }

        $('.t_selected .removeBtn').show();


    }

    /*
     * アノテーションテーブルをeditableにする
     */
    function addEditableToTable() {
        //console.log('addEditableToTable');
        var divs = $('table.annotation tr td div.edit_able');
        divs.addClass('editable');

        $('.editable').editable(function(value, settings) {
            // 要素と値を渡して、jsonを編集
            return editAnnotation($(this), value);
        });

    }

    /*
     * アノテーションテーブルを非editableにする
     */
    function removeEditableFromTable() {
        var divs = $('table.annotation tr td div.edit_able');

        $('div.editable').addClass('non_edit').removeClass('editable').unbind('click.editable');

    }


    /*
     * relation listの作成
     */
    function makeRelationTable() {
        //console.log('--make relation table---', selectedConns);

        if(sortConnStatus == 'new') {
            sortNewConn(connArray);
        } else if(sortConnStatus == 'rel') {
            sortRelConn(connArray);
        }

        var htmlStr = '';

        function makeTable(){

            $.each(connArray, function(i, conn) {

                var subject = conn['subject'];
                var object = conn['object'];
                // var paintStyle = conn.paintStyleInUse;
                var type = conn['type'];
                var id = conn['id'];

                htmlStr += '<tr><td>'
                        + '<table class="relation t_' + type + '" id="relation_t_' + id + '"><tr>'
                        + '<td><div>' + conn.id + '</div></td>'
                        + '<td><div id="source_id_' + conn.source_id + '">' + subject + '</div></td>'
                        + '<td><div id="target_id_' + conn.target_id + '">' + object + '</div></td>'
                        + '<td><div class="relation" id="relation_' + i + '">' + type + '</div></td>'
                        + '<td><img src="images/remove_btn.png" class="removeBtn"/></td>'
                        + '</tr></table>'
                        + '</td></tr>';

            });
            return htmlStr;
        }

        $('#rel_list_area').html('<table id="relationtable">' + makeTable() + '</table>');

        if(selectedConns != undefined) {
            for(var i in selectedConns) {
                $('#relation_t_' + selectedConns[i].getParameter('connId')).addClass('t_selected');
                $('.relation.t_selected .removeBtn').show();
            }

        }

        // distanceでのソートに戻す
        sortConnByDistance(connArray);
    }


    /*
     * instance listの作成
     */
    function makeInstanceTable() {

        //console.log('sortInsannsStatus:', sortInsannsStatus);

        if(sortInsannsStatus == 'new') {
            sortNewInsanns(insanns);
        } else if(sortInsannsStatus == 'type') {
            sortTypeInsanns(insanns);
        }

        var htmlStr = '';

        function makeTable(){

            $.each(insanns, function(i, ins) {

                var object = ins['object'];
                var type = ins['type'];
                var id = ins['id'];

                htmlStr += '<tr><td>'
                    + '<table class="instance t_' + type + '" id="instance_t_' + id + '"><tr>'
                    + '<td><div>' + id + '</div></td>'
                    + '<td><div id="object_id_' + object + '">' + object + '</div></td>'
                    + '<td><div class="instype" id="instype_' + i + '">' + type + '</div></td>'
                    + '<td><img src="images/remove_btn.png" class="removeBtn"/></td>'
                    + '</tr></table>'
                    + '</td></tr>';

            });
            return htmlStr;
        }

        $('#insanns_list_area').html('<table id="insannstable">' + makeTable() + '</table>');


        for(var i in selectedInstanceIds) {
            $('#instance_t_' + selectedInstanceIds[i]).addClass('t_selected');
            $('.instance.t_selected .removeBtn').show();
        }

    }

    /*
     * modification listの作成
     */
    function makeModificationTable() {

        //console.log('sortModannsStatus:', sortModannsStatus);

        if(sortModannsStatus == 'new') {
            sortNewModanns(modanns);
        } else if(sortModannsStatus == 'type') {
            sortTypeModanns(modanns);
        }

        var htmlStr = '';

        function makeTable(){

            $.each(modanns, function(i, mod) {

                var object = mod['object'];
                var type = mod['type'];
                var id = mod['id'];

                htmlStr += '<tr><td>'
                    + '<table class="modification t_' + type + '" id="modification_t_' + id + '"><tr>'
                    + '<td><div>' + id + '</div></td>'
                    + '<td><div id="mod_object_id_' + object + '">' + object + '</div></td>'
                    + '<td><div class="modype" id="modype_' + i + '">' + type + '</div></td>'
                    + '<td><img src="images/remove_btn.png" class="removeBtn"/></td>'
                    + '</tr></table>'
                    + '</td></tr>';

            });
            return htmlStr;
        }

        $('#modanns_list_area').html('<table id="modannstable">' + makeTable() + '</table>');

        /*
         for(var i in selectedConns) {
         $('#relation_t_' + selectedConns[i].getParameter('connId')).addClass('t_selected');
         $('.relation.t_selected .removeBtn').show();
         }
         */
        for(var k in selectedModificationIds) {
            var selectedMod = selectedModificationIds[k];

            $('span#' + selectedMod).addClass('mod_selected');

            $(this).addClass('mod_selected');

            // 該当するテーブルを選択状態にする
            $('#modification_t_' + selectedMod).addClass('t_selected');
            $('.modification.t_selected .removeBtn').show();

        }

    }

    /*
     * 現在表示されているコネクションデータを取得
     * 非表示のものは取得しません
     */
    function getConnectionData() {

        var conns = new Array();

        // connectionListを取得
        var connectionList = jsPlumb.getConnections();

        if(connectionList != undefined){

            //console.log('connectionList数:', connectionList.length);

            for(var i in connectionList) {
                var sourceId = connectionList[i].sourceId;
                var targetId = connectionList[i].targetId;
                var paintStyle = connectionList[i].paintStyleInUse;
                var connId = connectionList[i].getParameter("connId");
                var type = connectionList[i].getParameter("type");
                var endpoints = connectionList[i].endpoints;
                var overlays = connectionList[i].overlays;

               // console.log('overlays:', overlays);


                // 詰め替え
                var connObj = new Object();
                connObj["subject"] = sourceId;
                connObj["object"] = targetId;
                connObj["paintStyle"] = paintStyle['strokeStyle'];
                connObj["id"] = connId;

                connObj["type"] = type;
                connObj["endpoints"] = endpoints;

                connObj["overlays"] = overlays;
                conns.push(connObj);
            }
        }
        return conns;
    }

    /*
     * doc_area部分の描画
     * textにアノテーションマークをつける
     */
    function markAnnotation(annoJson) {
        //console.log('markAnnotation');

        var dummyArray = new Array();

        // 折り返しspanの位置を正確にするためにダミーのspanを最後に挿入
        for(i in annoJson) {
            var id = annoJson[i]['id'];
            var endPosition = annoJson[i]['span']['end'];

            var dummyObj = new Object();
            dummyObj['span'] = {"begin":endPosition - 1, "end":endPosition};
            //dummyObj['end'] = endPosition;
            dummyObj['category'] = 'dummy_span';
            dummyObj['id'] = 'dummy_' + id;

            dummyArray.push(dummyObj);
        }

        // ダミーを加える
        annoJson = annoJson.concat(dummyArray);

        // かならず数字順
        sortNumJson(annoJson);

        $("#doc_area").html($("#src_area").html());

        var origNode = document.getElementById("doc_area").childNodes[0];

        var newHtml = "";

        // 各アノテーションに対して、範囲とアノテーションを取得し、
        // それを<span>タグに直して表示する
        // annJson: アノテーションJson
        // beforeNode: spanタグで分割するノード
        // splitPos: ノードの中で文字列を分割する位置
        // emLevel: 強調レベル
        function makeSpan(annoJson, beforeNode, maxEndPos, emLevel) {
            var range = new Array();
            var label = new Array();
            var ids = new Array();

            var htmlStr = "";
            //var lastHtml = "";
            var lastSpan;

            var lastStartPos = 0;
            var lastEndPos = 0;

            $.each(annoJson, function(i, ann) {

                // ここがプラスの場合
                // 一番上の親の連続したマークになる
                if(ann['span']['begin'] - maxEndPos >= 0) {

                    var afterNode = beforeNode.splitText(ann['span']['begin'] - maxEndPos);

                    //console.log("afterNode:", afterNode); // 分割点より後のテキスト
                    //console.log("beforeNode:", beforeNode);  // 分割点より前のテキスト
                    var noRangeStr = beforeNode.nodeValue;

                    htmlStr += noRangeStr;

                    // range文字列の長さ
                    var len = ann['span']['end'] - ann['span']['begin'];
                    // console.log('len:', ann['end'], '-', ann['begin'], '=',len)

                    range[i] = document.createRange();
                    range[i].setStart (afterNode, 0);
                    range[i].setEnd (afterNode, len);
                    label[i] = ann['category'];

                    ids[i] = ann['id'];

                    // spanタグで囲んだ部分を分割
                    var newNode = afterNode.splitText(len);
                    //console.log('newNode:', newNode);
                    //console.log('afterNode:', afterNode);

                    var span = document.createElement("span");
                    span.setAttribute('class', label[i]);

                    span.setAttribute('id', ids[i]);
                    span.setAttribute('title', label[i]);
                    range[i].surroundContents(span);

                    // 切り取った長さ
                    maxEndPos = ann['span']['end'];

                    beforeNode = newNode;

                    // 最後に追加したspan要素
                    lastSpan = $('#doc_area  span:last');

                    lastStartPos = ann['span']['begin'];
                    lastEndPos = ann['span']['end'];

                } else {
                    //console.log("****************直前のjsonノードの中に子供spanとして存在する*********");
                    // マイナスの場合は
                    // 直前のjsonノードの中に子供spanとして存在する
                    //console.log('**lastEndPos:', lastEndPos);
                    //console.log("**ann[0]:", ann[0]);
                    var baseNode = document.getElementById("doc_area");

                    // console.log('node:', baseNode);

                    // nodeを分解して、足して得た文字列の長さ
                    var textLength = 0;

                    function findNode(baseNode) {
                        var childs = baseNode.childNodes;

                        for(var i = 0; i < childs.length; i++) {
                            if(childs[i].nodeName == 'SPAN') {
                                var node = findNode(childs[i]);
                                if(node != undefined ) {
                                    return node;
                                    break;
                                }
                            } else {
                                // console.log("text:", childs[i].nodeValue);

                                if(ann['span']['begin'] >= textLength && ann['span']['begin'] < textLength + childs[i].nodeValue.length ) {
                                    //console.log('このノードの中にあります:', childs[i].nodeValue);

                                    // range文字列の長さ
                                    //var len = ann['end'] - ann['begin'];
                                    //console.log('len:', ann[1], '-', ann[0], '=',len)

                                    var range = document.createRange();

                                    // console.log("ann['begin'] - textLength:", ann['begin'] - textLength);
                                    // console.log("ann['end'] - textLength:", ann['end'] - textLength);

                                    range.setStart (childs[i], ann['span']['begin'] - textLength);
                                    range.setEnd (childs[i], ann['span']['end'] - textLength);
                                    var label = ann['category'];

                                    var id = ann['id'];

                                    var span = document.createElement("span");
                                    span.setAttribute('class', label);

                                    span.setAttribute('id', id);
                                    span.setAttribute('title', label);

                                    range.surroundContents(span);

                                    return childs[i];
                                    break;
                                }
                                textLength += childs[i].nodeValue.length;
                            }
                        }
                    }
                    var node = findNode(baseNode);
                }

            });
        }

        makeSpan(annoJson, origNode, 0, 0);

        // dummy_spanのjsonを削除;
        var init = annoJson.length - 1;

        for(var i = init; i >= 0; i--) {
            if(annoJson[i]['category'] == 'dummy_span') {
                annoJson.splice(i, 1);
            }
        }

        // dummy_spanの位置を取得
        var padding_left = parseInt($('#doc_area').css('padding-left'));
        var padding_top = parseInt($('#doc_area').css('padding-top'));

        // 行高さ
        var lineHeight = parseInt($('#doc_area').css('lineHeight'));

        // jsonにx, yを設定
        for(i in annoJson) {
            var id = annoJson[i]['id'];


           // var left = $('#' + id).get(0).offsetLeft - padding_left;
           // var top = $('#' + id).get(0).offsetTop - padding_top;

            var left = $('#' + id).get(0).offsetLeft;
            var top = $('#' + id).get(0).offsetTop;

            // 1行spanのときに設定する
            var height = $('#' + id).get(0).offsetHeight;
            if(height < lineHeight) {
                baseSpanHeight = height;
            }

            annoJson[i]['left'] = left;
            annoJson[i]['top'] = top;

            var dummyElem = $('#dummy_' + id);
            //console.log('dummyElem:', dummyElem);

            if(dummyElem.get(0) != undefined) {
                var x = (dummyElem.get(0).offsetLeft + dummyElem.get(0).offsetWidth) - padding_left;
                var y = dummyElem.get(0).offsetTop + padding_top;



                annoJson[i]['x'] = x;
                annoJson[i]['y'] = y;
            }
        }

        $('#doc_area span.dummy_span').map(function() {
            // dummy_spanを削除
            //console.log('dummy span:', $(this));
            $(this).replaceWith($(this).text());
        });
        for(i in selectedIds) {
            $('span#' + selectedIds[i]).addClass('selected');
        }

        // 不完全要素の枠をつける
        //console.log('partialIds.length:', partialIds.length);
        for(i in partialIds) {
            //console.log('partialIds[i]:', partialIds[i]);
            $('span#' + partialIds[i]).addClass('partial').addClass('selected').addClass('partialSelected');
        }

        // 不完全要素があることを警告する
        if(partialIds.length > 0) {
            var notice = partialIds.length + ' incomplete annotation element! <img src="images/notice_ok_btn.png " alt="notice_ok" id="notice_ok_btn" >';
            $('#notice_area').html(notice);
        }

        // 不完全要素を空にする
        partialIds.splice(0, partialIds.length);

       //if(isTooltip) {
          // makeTooltip();
       //}

        $("#annojson").text(JSON.stringify(annoJson));

    }


    /*
     * 吹き出し作成
     */
    function makeTooltip() {
        // tooltip追加
        $('#doc_area span').balloon({
            position:"top right",
            offsetX: -10,
            classname: "tooltip",
            css : {
                minWidth: "10px",
                padding: "2px",
                fontSize: "9pt",
                backgroundColor: "#000000",
                opacity:"0.7"
            }
        });

        if($('#show_tooltip_cb').attr('checked')) {
            //console.log('checkされています');
            $("#doc_area span").map(function() {
                $(this).attr('title', $(this).attr('class'));
                $('.tooltip').css('visibility', 'visible');
                //makeTooltip();
            });

        } else {
            //console.log('checkされていません');
            $("#doc_area span").removeAttr('title');
            $('.tooltip').css('visibility', 'hidden');

        }
    }

    /*
     * textとannotation listにcategoryに対応する色をつけます
     */
    function addCategoryColor(categories) {
        for(var i = 0; i < categories.length; i++) {
            // docの中のspanに対して
            var spans = $('span.' + categories[i].split('|')[0]);
            spans.css('background-color', categories[i].split('|')[2]);

            // editable tableに対して
            var tables = $('.t_' + categories[i].split('|')[0]);

            tables.css('background-color', categories[i].split('|')[2]);
        }
    }

    /*
     * relation listにrelationに対応する色をつけます
     */
    function addRelationColor(relations) {
        for(var i = 0; i < relations.length; i++) {


            // tableに対して
            var tables = $('.t_' + relations[i].split('|')[0]);

            tables.css('background-color', relations[i].split('|')[2]);
        }
    }



    /*
     * instance listにinstypeに対応する色をつけます
     */
    function addInstypeColor(instypes) {

        for(var i = 0; i < instypes.length; i++) {

            // ins_areaに対して
            var divs = $('.' + instypes[i].split('|')[0]);
            divs.css('background-color', instypes[i].split('|')[2]);

            // tableに対して
            var tables = $('.t_' + instypes[i].split('|')[0]);

            tables.css('background-color', instypes[i].split('|')[2]);
        }

    }

    /*
     * instanceの枠にcategoryに対応する色をつけます
     */
    function addInstanceBorderColor(elem, categories) {

        for(var i = 0; i < categories.length; i++) {
            if(elem.hasClass(categories[i].split('|')[0])){

                elem.css('border-color', categories[i].split('|')[2]);
                break;
            }
        }
    }


    /*
     * modification listにmodtypeに対応する色をつけます
     */
    function addModtypeColor(modtypes) {

        for(var i = 0; i < modtypes.length; i++) {


            // modificationの対象がspanの場合、spanの中のテキストに対して
            var spans = $('.mod_' + modtypes[i].split('|')[0]);
            spans.css('color', modtypes[i].split('|')[2]);

            // tableに対して
            var tables = $('.t_' + modtypes[i].split('|')[0]);

            tables.css('background-color', modtypes[i].split('|')[2]);
        }

    }

    /*
     * annotation listの値の編集
     */
    function editAnnotation(elem, value) {

        //console.log('before edit selectedIds.length:', selectedIds.length);

        $('#notice_area').empty();
        elem.removeClass('error');

        // spanの順番を取得
        // id="startPos_2"などとなっている
        var id = elem.attr('id').split('_')[1];

        // 該当するjsonを求める
        var editJson;
        for(i in annotationJson) {
            if(annotationJson[i]['id'] == id) {
                editJson = annotationJson[i];
                // 選択要素のIDを代入
                selectedIds.push(id);
            }
        }

        if(elem.attr('id').match(/startPos/)) {
            // value は開始の値
            if(validateRange(annotationJson, id, value, editJson['end'])) {
                var startPosition = validateStartDelimiter(value);

                editJson['begin'] = startPosition;

                sortNumJson(annotationJson);
                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);
                //saveCurrentCatanns();
                saveCurrent("catanns");

                return startPosition;

            } else {
                //console.log('エラー');
                $('#notice_area').text('range error!');

                // 元の値へ戻す
                value = editJson['begin'];
                //elem.addClass('error');
                //makeAnnoTable(annoJson);
                return value;
            }

        } else if(elem.attr('id').match(/endPos/)) {
            // value は終了の値
            if(validateRange(annotationJson, id, editJson['begin'], value)) {
                var endPosition = validateEndDelimiter(value);

                editJson['end'] = endPosition;

                sortNumJson(annotationJson);
                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);

                //setCurrentStorage(annotationJson);
                //saveCurrentCatanns();
                saveCurrent("catanns");

                return endPosition;

            } else {
                //console.log('エラー');
                $('#notice_area').text('range error!');
                // 元の値へ戻す
                value = editJson['end'];

                return value;
            }
        }
    }


    /*
     * annotation listのedit時の値の検証
     */
    function validateRange(annoJson, id, s, e) {
        if(s >= e) {
            //console.log('開始位置が終了位置より大きい')
            return false;
        } else {
            // その他のjsonについて調べる
            for(var i = 0; i < annoJson.length; i++) {
                if(annoJson[i]['id'] != id) {
                    // 自分以外
                    if(s < annoJson[i]['begin'] && ( annoJson[i]['begin'] < e && e < annoJson[i]['end'])) {
                        //console.log('前がでています');
                        return false;
                    } else if((annoJson[i]['begin'] < s && s < annoJson[i]['end']) && annoJson[i]['end'] < e) {
                        //console.log('後ろがでています');
                        return false;
                    }
                }
            }
            return true;
        }
    }

    /*
     * Categoryのデフォルト値の変更
     */
    $('.category_radio').live('change', function() {
        defaultCategory = $(this).parent().next().text();
    });

    /*
     * Relation Categoryのデフォルト値の変更
     */
    $('.relation_radio').live('change', function() {
        defaultRelation = $(this).parent().next().text();
    });


    /*
     * relationの表示非表示
     */
    $('.rel_hide').live("change", function(e) {
        //console.log("rel_hide:", $(this).attr('checked'));
        //console.log('relation type:', $(this).parent().prev().text());
        // relation type
        //var relType = $(this).parent().prev().text();

        var relType = $(this).attr('title');

        //console.log('relType:', relType);

        if($(this).attr('checked') == undefined) {

            //console.log("チェックはずれました")

            var conns = getConnectionData();


            if(relType != "all") {


                // tmpHideConnArrayに移動
                for(var i in conns) {

                    //console.log('rel_type:', conns[i].type);
                    if(conns[i]["type"] == relType) {

                        var connId = conns[i]["id"];
                        var endpoints = conns[i]["endpoints"];

                        tmpHidedConnArray.push(conns[i]);

                        // テーブルの背景を薄くする
                        $('#relation_t_' + connId).addClass('tmp_hide');
                        $('#relation_t_' + connId).removeClass('t_selected');
                        $('#relation_t_' + connId + ' .removeBtn').hide();

                        // 削除
                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);
                    }

                }
            } else {

                $('.rel_hide').removeAttr('checked');

                // すべて隠す
                for(var i in conns) {
                    var connId = conns[i]["id"];
                    var endpoints = conns[i]["endpoints"];

                    tmpHidedConnArray.push(conns[i]);

                    // テーブルの背景を薄くする
                    $('#relation_t_' + connId).addClass('tmp_hide');
                    $('#relation_t_' + connId).removeClass('t_selected');
                    $('#relation_t_' + connId + ' .removeBtn').hide();

                    // 削除
                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                }
            }

        } else if($(this).attr('checked') == "checked") {


            //console.log('チェックされました------');
            // 再描画
            showHideAllConnections('show', relType);

            // modificationも再描画
            makeModification(modanns);

        }
    });

    $('.instype_hide').live("change", function() {
        var insType = $(this).attr('title');


        if($(this).attr('checked') == undefined) {
            if(insType == "all") {

                $('.instype_hide').removeAttr('checked');

                $('.instance').hide();
            } else {
                $('.' + insType ).hide();
            }

        } else {
            if(insType == "all") {
                $('.instype_hide').attr('checked', 'checked');

                $('.instance').show();
            } else {
                $('.' + insType ).show();
            }

        }
    });


    $('.modtype_hide').live("change", function() {
        var modType = $(this).attr('title');

        if($(this).attr('checked') == undefined) {

            // allなら他のcbもはずす
            if(modType == "all") {
                $('.modtype_hide').removeAttr('checked');
            }



            // instanceに対して
            if(modType == "all") {
                $('.instance_modification').hide();
            } else {
                $('.mod_' + modType ).hide();
            }




            // relationに対して
            jsPlumb.select().each(function(conn){
                //var label = conn.getLabel();
                //console.log('label:', label);

                if(modType == "all") {
                    for(var i in modanns) {
                        var mod = modanns[i];
                        conn.hideOverlay(mod['id']);

                    }

                } else {
                    for(var i in modanns) {
                        var mod = modanns[i];
                        if(mod["type"] == modType) {
                            conn.hideOverlay(mod['id']);
                        }

                    }
                }

                /*
                if(modType == "Negation") {
                    if(label == "X") {
                        conn.setLabel("");
                    }
                } else if(modType == "Speculation") {
                    if(label == "?") {
                        conn.setLabel(null);
                    }
                }
                */
            });


        } else {

            // allなら他のcbもはずす
            if(modType == "all") {
                $('.modtype_hide').attr('checked','checked');
            }


            // instanceに対して
            if(modType == "all") {
                $('.instance_modification').show();
            } else {
                $('.mod_' + modType ).show();
            }


            // relationに対して
            jsPlumb.select().each(function(conn){
                if(modType == "all") {
                    for(var i in modanns) {
                        var mod = modanns[i];
                        conn.showOverlay(mod['id']);

                    }

                } else {
                    for(var i in modanns) {
                        var mod = modanns[i];
                        if(mod["type"] == modType) {
                            conn.showOverlay(mod['id']);
                        }

                    }
                }
            });

            /*
            for(var i in modanns) {
                var mod = modanns[i];
                var type = mod["type"];
                var object = mod["object"];
                var id = mod["id"];

                if(object.substr(0,1) == "R") {
                    // relationがmodificationされている
                    jsPlumb.select().each(function(conn){



                        if(conn.getParameter("connId") == object){
                            if(modType == "Negation") {
                                if(type == "Negation") {
                                    conn.setLabel("X");
                                }
                            } else if(modType == "Speculation") {
                                if(type == "Speculation") {
                                    conn.setLabel("X");
                                }
                             }
                        }
                    });

                }

            }
            */

        }
    })

    /*
     * spanをクリック
     */
    function clickSpan(e) {
        //console.log('click span');
        //var range = selection.getRangeAt(0);
        //console.log('range:', range);
        e.preventDefault();
        //console.log('click span');
        //console.log('shiftキーが押されている:', e.shiftKey);

        // 下に重なってる要素のclickイベントを解除
        $('#doc_area span').unbind('click',arguments.callee);


        if(mode == "relation") {
            // relation mode
            //console.log('relation mode');

            //console.log('relation mode');
            //console.log('this:', $(this));
            //console.log('sourceElem:', sourceElem);
            var id = $(this).attr('id').split('_')[1];

            //console.log('click span:', id);

            //console.log('sourceElem:', sourceElem);

            if(sourceElem == null) {

              //  sourceElem = $(this);
                sourceElem = $('#' + id);
                sourceElem.addClass('source_selected');

                //console.log('sourceElem:', sourceElem);
            } else {
                //targetElem = $(this);
                targetElem = $('#' + id);

                //console.log('targetElem:', targetElem);

                // 色の指定
                var color;

                for(i in relations) {
                    if(relations[i].split('|')[0] == defaultRelation) {
                        color = relations[i].split('|')[2];
                    }
                }

                // rgbaに変換
                var rgba = colorTrans(color);

                // connection作成
                //connId++;
                var connId = "R" + (getMaxConnId() + 1);

                var subject = sourceElem.attr('id');
                var object = targetElem.attr('id');


                ///var conn = makeConnection(sourceElem, targetElem, defaultRelation, rgba, connId);
                //var conn = makeConnection(subject, object, defaultRelation, rgba, connId, "unselected", "", "", "");


                // 選択されているものは、選択をはずす
                deselectConnection();


                /*
                // 新規に作成された場合は、選択状態にする
                var conn = makeConnection2(subject, object, defaultRelation, rgba, connId, "selected");

                selectedConns.push(conn);

                var source_id = conn.sourceId;
                var target_id = conn.targetId;
                var rgba = conn.paintStyleInUse["strokeStyle"];
                var type = conn.getParameter("type");
                var id = conn.getParameter("connId");
                */

                var obj = new Object();
                obj.subject = subject;
                obj.object = object;
                obj.type = defaultRelation;
                obj.id = connId;
                obj.created_at = (new Date()).getTime();

                // distanceをつける
                addDistanceToRelation(obj);

                if(e.shiftKey) {
                    // targetを次のソースにする
                    e.preventDefault();
                    deselect();

                    if(sourceElem.hasClass('source_selected')) {
                        sourceElem.removeClass('source_selected');
                        sourceElem = null;

                        sourceElem = targetElem;
                        sourceElem.addClass('source_selected');
                    } else if(sourceElem.hasClass('ins_selected')) {
                        $('#id').removeClass('ins_selected');

                        addInstanceBorderColor($('#id'),categories);
                        sourceElem = null;
                        sourceElem = targetElem;
                        sourceElem.css('border-color', '#000000').addClass('ins_selected').attr('id');
                    }


                } else if(e.ctrlKey) {
                    // sourceは元のまま
                    targetElem = null;
                } else {
                    sourceElem.removeClass('source_selected');

                    // instanceの枠の色を元に戻す
                    $('div.instance').map(function() {
                        if($(this).hasClass('ins_selected')){
                            $(this).removeClass('ins_selected');

                            addInstanceBorderColor($(this),categories);

                        }
                    });

                    sourceElem = null;
                    targetElem = null;
                }


                connArray.push(obj);

                sortConnByDistance(connArray);

                // 書きなおし
                jsPlumb.reset();
                for(var j in connArray) {
                    var conn = connArray[j];
                    var sId = conn['subject'];
                    var tId = conn['object'];

                    var color;
                    for(var k in relations) {
                        if(relations[k].split('|')[0] == conn['type']) {
                            color = relations[k].split('|')[2];
                        }
                    }

                    var rgba = colorTrans(color);
                    var id = conn['id'];
                    var type = conn['type'];

                    //console.log('sElem:', sElem);


                    //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                    //makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");
                    if(id == connId) {
                        var rgbas = rgba.split(',');
                        rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';

                        var c = makeConnection2(sId, tId, type, rgba, id, "selected", modanns);
                        selectedConns.push(c);
                    } else {
                        makeConnection2(sId, tId, type, rgba, id, "unselected", modanns);
                    }

                    // jsPlumb.deleteEndpoint(endpoints[0]);
                    //jsPlumb.deleteEndpoint(endpoints[1]);

                }



                // テーブル書き換え
                makeRelationTable();

                addRelationColor(relations);
                //setCurrentConnStorage(connArray);
                //saveCurrentRelanns();
                saveCurrent("relanns");
            }

        } else if(mode == "edit") {
            // span編集モード
            //console.log('isShift:', isShift);

            if(isCtrl) {

                // ctrl我押されているので、選択要素を追加
                var isExit = false;

                for(i in selectedIds) {
                    if(selectedIds == $(this).attr('id')) {
                        isExit = true;
                        break;
                    }
                }

                if(!isExit) {
                    selectedIds.push($(this).attr('id'));

                    if($('span#' + $(this).attr('id')).hasClass('partial')) {
                        //console.log('不完全要素');
                        $('span#' + $(this).attr('id')).addClass('partialSelected');
                    } else {
                        $('span#' + $(this).attr('id')).addClass('selected');
                    }

                    // 該当するテーブルを選択状態にする
                    //$('#t_' + $(this).attr('id')).removeAttr('style');
                    // $('#t_' + $(this).attr('id')).addClass('t_selected');

                    if($('#t_' + $(this).attr('id')).hasClass('t_partial')){
                        $('#t_' + $(this).attr('id')).addClass('t_partialSelected');
                    } else {
                        $('#t_' + $(this).attr('id')).addClass('t_selected');
                    }

                    // remove_btnを表示
                    $('.annotation.t_selected .removeBtn').show();
                    $('.t_partialSelected .removeBtn').show();

                }
            } else if(isShift && selectedIds.length == 1) {
                //console.log('shiftが押されています');
                // shiftが押されている
                var firstId = selectedIds.pop();
                var secondId = $(this).attr('id');

                // 一旦、元に戻す
                $('#doc_area span').removeClass('selected').removeClass('partialSelected');
                $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
                $('.removeBtn').hide();

                // selectedを削除して、class指定が空になった要素はclass="noCategoy"にする
                //$('#doc_area span[class=""]').addClass('noCategory');
                // 一旦空にする
                selectedIds.splice(0, selectedIds.length);

                sortNumJson(annotationJson);

                // firtsIdとsecondIdのdoc_area内での順番をもとめる
                var firstIndex;
                var secondIndex
                $('#doc_area span').map(function(i){
                    if($(this).attr('id') == firstId) {
                        firstIndex = i;
                    }
                    if($(this).attr('id') == secondId) {
                        secondIndex = i;
                    }
                });

                if(secondIndex < firstIndex) {
                    var tmpIndex;
                    tmpIndex = firstIndex;
                    firstIndex = secondIndex;
                    secondIndex = firstIndex;
                }

                $('#doc_area span').map(function(i){
                    if(i >= firstIndex && i <= secondIndex) {
                        $(this).addClass('selected');
                        selectedIds.push($(this).attr('id'));
                    }
                });

                for(var i in selectedIds) {
                    var id = selectedIds[i];
                    $('#t_' + id).addClass('t_selected');
                }
                $('.annotation.t_selected .removeBtn').show();

                deselect();

            } else {

                // ctrl, shiftが押されていない場合
                $('#doc_area span').removeClass('selected').removeClass('partialSelected');
                $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
                $('.removeBtn').hide();

                // selectedを削除して、class指定が空になった要素はclass="noCategoy"にする
                //$('#doc_area span[class=""]').addClass('noCategory');
                // 一旦空にする
                selectedIds.splice(0, selectedIds.length);

                var selectedId = $(this).attr('id');

                selectedIds.push(selectedId);

                if($('span#' + $(this).attr('id')).hasClass('partial')) {
                    //console.log('不完全要素');
                    $('span#' + $(this).attr('id')).addClass('partialSelected');
                } else {
                    $('span#' + $(this).attr('id')).addClass('selected');
                }

                // 該当するテーブルを選択状態にする
                if($('#t_' + $(this).attr('id')).hasClass('t_partial')){
                    $('#t_' + $(this).attr('id')).addClass('t_partialSelected');
                } else {
                    $('#t_' + $(this).attr('id')).addClass('t_selected');
                }

                // remove_btnを表示
                $('.annotation.t_selected .removeBtn').show();
                $('.t_partialSelected .removeBtn').show();

                // 選択された用素のdoc_area内での順番
                sortNumJson(annotationJson);
                for(var i = 0; i <annotationJson.length; i++) {
                    if(annotationJson[i]['id'] == selectedId) {
                        selectedIdOrder = i;
                    }
                }
            }
            //setCurrentStorage(annotationJson);
        }
        return false;
    }


    function deselectConnection() {
        //console.log('選択されているconnは:', selectedConns.length);

        for(var i in selectedConns) {
            var conn = selectedConns[i];

            var subject = conn.sourceId;
            var object = conn.targetId;
            var rgba = conn.paintStyleInUse["strokeStyle"];
            var type = conn.getParameter("type");
            var connId = conn.getParameter("connId");
            var endpoints = conn.endpoints;

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);

            makeConnection2(subject, object, defaultRelation, rgba, connId, "unselected", modanns);

        }

        selectedConns.splice(0, selectedConns.length);

    }



    /*
     * 右クリックで合体
     */
    $('#doc_area span').live('contextmenu', function(e){
        //console.log('右クリック');

        if(mode == "relation") {
           // relationモード
            /*
           if(sourceElem != null && sourceElem.attr('id') == $(this).attr('id')) {
               sourceElem.removeClass('source_selected');
               sourceElem = null;
           }
           */

        } else if(mode == "edit") {

            if(selectedIds.length == 1) {
                var secondSelected = $(this);

                var selectedId = selectedIds.shift();
                //var firstParentId = selected.parent().attr('id');

                var firstParentId = $('span#' + selectedId).parent().attr('id');
                var secondParentId = secondSelected.parent().attr('id');

                if(firstParentId == secondParentId && selectedId != secondSelected.attr('id')) {
                    //console.log('合体');

                    // 選択されたspanのidを保存
                    var firstJson = findJson(selectedId);                   // 最初に選択された要素
                    var secondJson = findJson(secondSelected.attr('id'));   // 右クリックで選択された要素

                    var i;
                    var len = annotationJson.length - 1 ;

                    if(firstJson['span']['end'] < secondJson['span']['end']) {
                        //console.log('最初の要素が前にある場合');
                        // 最初の要素が前にある場合
                        firstJson['span']['end'] = secondJson['span']['end'];


                        for(i = len; i >= 0 ;i--){
                            // 2番目に選択された要素を削除
                            if(annotationJson[i]['id'] == secondSelected.attr('id')) {

                                // このspan要素に関するinsatnceのobjectを1番目の要素に変更する
                                for(var j in insanns) {
                                    var ins = insanns[j];
                                    if(ins["object"] == annotationJson[i]['id']) {
                                        ins["object"] = firstJson["id"];
                                    }
                                }

                                // このspan要素に関するrelationのobjectまたはsubjectを1番目の要素に変更する
                                for(var j in connArray) {
                                    var conn = connArray[j];
                                    if(conn["subject"] == annotationJson[i]['id']) {
                                        conn["subject"] = firstJson["id"];
                                    }
                                    if(conn["object"] == annotationJson[i]['id']) {
                                        conn["object"] = firstJson["id"];
                                    }
                                }


                                annotationJson.splice(i, 1);
                                break;
                            }
                        }


                    } else {
                        //console.log('最初の要素が後ろにある場合');
                        // 最初の要素が後ろにある場合
                        //secondJson['end'] = firstJson['end'];

                        firstJson['span']['begin'] = secondJson['span']['begin'];

                        for(i = len; i >= 0 ;i--){
                            // 2番目の要素を削除
                            if(annotationJson[i]['id'] == secondSelected.attr('id')) {


                                // このspan要素に関するinsatnceのobjectを1番目の要素に変更する
                                for(var j in insanns) {
                                    var ins = insanns[j];
                                    if(ins["object"] == annotationJson[i]['id']) {
                                        ins["object"] = firstJson["id"];
                                    }
                                }

                                // このspan要素に関するrelationのobjectまたはsubjectを1番目の要素に変更する
                                for(var j in connArray) {
                                    var conn = connArray[j];
                                    if(conn["subject"] == annotationJson[i]['id']) {
                                        conn["subject"] = firstJson["id"];
                                    }
                                    if(conn["object"] == annotationJson[i]['id']) {
                                        conn["object"] = firstJson["id"];
                                    }
                                }


                                annotationJson.splice(i, 1);
                                break;
                            }
                        }
                    }

                    sortNumJson(annotationJson);
                    $("#annojson").text(JSON.stringify(annotationJson));

                    markAnnotation(annotationJson);
                    makeAnnoTable(annotationJson);

                    addCategoryColor(categories);

                    //setCurrentStorage(annotationJson);
                    //saveCurrentCatanns();

                    selectedIds.push(selectedId);

                    $('span#' + selectedId).addClass('selected');

                    $('#t_' + selectedId).addClass('t_selected');
                    // remove_btnを表示
                    $('.annotation.t_selected .removeBtn').show();


                    makeInstance(insanns);
                    //makeInstanceTable();
                    addInstypeColor(instypes);

                    reMakeConnectionOnDelete();

                    saveCurrent("catanns_insanns_relanns")

                } else {
                    //console.log('合体できません');
                }
            }
        }
        return false;
    });

    /*
     * 削除ボタンクリック
     */
    $('.removeBtn').live('click', function(event) {

        // 下に重なっている要素にイベントを伝搬しない
        event.stopPropagation();

        var i;
        var k;
        var len = connArray.length - 1;

        var selectedId;

        if(mode == "relation") {
            // connectionまたはmodificationの削除
            selectedId = $(this).parent().parent().parent().parent().attr('id').split('_')[2];

            //var isDeleteRel = false; // relationが削除されるか
           // var isDeleteMod = false; // relationの削除で関連するmodificationが削除されるか

            //console.log('selectedId', selectedId);

            for(i = 0; i < selectedConns.length;i++) {

                var endpoints = selectedConns[i].endpoints;
                var id = selectedConns[i].getParameter("connId");

                if(id == selectedId) {
                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                    selectedConns.splice(i, 1);
                    //isDeleteRel = true;
                }


                for(k =  len; k >= 0; k--) {
                    if(connArray[k]["id"] == selectedId) {
                        //console.log('削除するconnection id:', id);
                        connArray.splice(k, 1);
                        //isDeleteMod = true;
                    }
                }
            }

            // table再描画
            makeRelationTable();
            addRelationColor(relations);
            //setCurrentConnStorage(connArray);

            //saveCurrentRelanns();



            // 選択されているmodificationは
            len = modanns.length - 1;
            for(var k = len; k >= 0; k--) {
                if(modanns[k]['id'] == selectedId) {
                    //console.log('spliceします');
                    modanns.splice(k, 1);
                    //isDeleteMod = true;
                }
            }


            var conns = getConnectionData();

            for(var j in conns) {
                var conn = conns[j];

                var labelText = "";
                var modId = "";
                for(var i = 0; i < conn.overlays.length; i++) {
                    var overlay = conn.overlays[i];
                    //console.log('label:', overlay["type"]);

                    if(overlay["type"] == "Label") {
                        //console.log(overlay.getLabel());
                        labelText = overlay.getLabel();
                        modId = overlay["id"];

                        if(selectedId == modId) {

                            var connId = conn["id"];
                            var subject = conn["subject"];
                            var object = conn["object"]
                            var rgba = conn["paintStyle"];
                            var endpoints = conn["endpoints"];
                            var type = conn['type'];

                            jsPlumb.deleteEndpoint(endpoints[0]);
                            jsPlumb.deleteEndpoint(endpoints[1]);

                            var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);
                        }
                    }
                }

            }

            len = selectedModificationIds.length - 1;
            for(k = len; k >= 0; k--) {
                if(selectedInstanceIds[k] == selectedId) {
                    selectedModificationIds.splice(k, 1);
                }
            }

            makeModification(modanns);
            makeModificationTable();
            addModtypeColor(modtypes);

             //saveCurrentModanns();

            /*
            var saveStr;

            if(isDeleteRel) {
                if(isDeleteMod) {
                    saveStr = "relanns_modanns";
                } else {
                    saveStr = "modanns";
                }
            } else {
                if(isDeleteMod) {
                    saveStr = "modanns";
                } else {
                    saveStr = "";
                }
            }
            */

            saveCurrent("relanns_modanns");

        } else if(mode =="edit") {
            // removeBtnをクリックされたid

            // spanが削除された時に、削除されるインスタンスのidの配列
            var deleteInsIds = new Array();

            // spanが削除された時に、削除されるrelationのIDの配列
            var deleteRelIds = new Array();

            //var isDeleteIns = false; // インスタンスも削除されるか
            //var isDeleteRel = false; // relationも削除されるか
            //var isDeleteMod = false; // modificationも削除されるか


            if($(this).parent().parent().parent().parent().hasClass('annotation')) {
                //console.log('annotation table');
                selectedId = $(this).parent().parent().parent().parent().attr('id').split('_')[1];

                //console.log('削除されるspan:', selectedId);

                for(var i in annotationJson) {
                    if(annotationJson[i]['id'] == selectedId) {
                        // この場合、このインスタンスも削除される

                        for(var j in insanns) {
                            //console.log('instance object:', insanns[j]["object"]);
                            if(insanns[j]["object"] == selectedId ) {
                                //console.log('instanceも削除', insanns[j]["id"]);
                                deleteInsIds.push(insanns[j]["id"]);
                                //isDeleteIns = true; // instanceも削除される
                            }
                        }
                        annotationJson.splice(i, 1);
                    }

                    len = connArray.length - 1;
                    for(k = len; k >= 0; k--) {
                        var conn = connArray[k];
                        if(conn.subject == selectedId || conn.object == selectedId) {
                            //console.log('spanで削除するrelationがあります');
                            //isDeleteRel = true; // relationも削除される
                            deleteRelIds.push(conn["id"]);
                            connArray.splice(k, 1);
                        }
                    }

                    len = hideConnArray.length - 1;
                    for(k = len; k >= 0; k--) {
                        var conn = hideConnArray[m];
                        if(conn.subject == selectedId || conn.object == selectedId) {
                            hideConnArray.splice(m, 1);
                        }
                    }

                }



                for(var k in deleteInsIds) {
                    var insId = deleteInsIds[k];

                    var len = insanns.length - 1;
                    var i;
                    for(i = len; i >= 0; i--){
                        if(insanns[i]['id'] == insId) {
                            insanns.splice(i, 1);
                        }
                    }


                    len = connArray.length - 1;
                    for(i = len;  i >= 0; i--) {
                        var conn = connArray[i];
                        if(conn.subject == insId || conn.object == insId) {
                            //console.log("instance id:", conn["id"]);
                            deleteRelIds.push(conn["id"]);
                            //isDeleteRel = true; // instanceに紐ずいたrelationも削除される
                            connArray.splice(i, 1);
                        }
                    }

                    len = hideConnArray.length - 1;
                    for(i = len;  i >= 0; i--) {
                        var conn = hideConnArray[i];
                        if(conn.subject == insId || conn.object == insId) {
                            hideConnArray.splice(i, 1);
                        }
                    }

                    // 削除されるinstance上のmodification
                    len = modanns.length - 1;
                    for(i = len ; i >= 0; i--) {
                        var mod = modanns[i];
                        if(mod["object"] == relId) {
                            //isDeleteMod = true;
                            modanns.splice(i, 1);
                        }
                    }

                }

                // 削除されるrelation上のmodification
                for(var k in deleteRelIds) {
                    var relId = deleteInsIds[k];

                    len = modanns.length - 1;
                    for(i = len; i >= 0; i--) {
                        var mod = modanns[i];
                        if(mod["object"] == relId) {
                            //isDeleteMod = true;
                            modanns.splice(i, 1);
                        }
                    }
                }

                // 空にする
                selectedIds.splice(0, selectedIds.length);


                sortNumJson(annotationJson);
                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);
                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);


                makeInstance(insanns);
                makeInstanceTable();
                addInstypeColor(instypes);
                //setCurrentInsannsStorage(insanns);


                // relation再描画



                makeRelationTable();
                addRelationColor(relations);

                reMakeConnectionOnDelete();

                //setCurrentConnStorage(connArray);

                makeModification(modanns);
                makeModificationTable();
                addModtypeColor(modtypes);



                /*
                // saveする文字列
                var saveStr = "catanns";
                if(isDeleteIns) {
                    saveStr += "_insanns";
                }
                if(isDeleteRel) {
                    saveStr += "_relanns";
                }
                if(isDeleteMod) {
                    saveStr += "_modanns";
                }
                */

                saveCurrent("catanns_insanns_relanns_modanns");



            } else if($(this).parent().parent().parent().parent().hasClass('instance')) {
                //console.log('instance table');
                selectedId = $(this).parent().parent().parent().parent().attr('id').split('_')[2];

                // この場合はinsatnceが削除される


                for(var i in insanns) {
                    var ins = insanns[i];

                    if(ins['id'] == selectedId) {

                        var k;
                        var len = connArray.length - 1;
                        for(k = len; k >= 0; k--) {
                            var conn = connArray[k];
                            if(conn["subject"] == ins["id"] || conn["object"] == ins["id"] ) {
                                //紐づいたrelationも削除される
                                deleteRelIds.push(conn["id"]);
                                connArray.splice(k, 1);
                                //isDeleteRel = true; // instanceも削除される
                            }
                        }

                        len = modanns.length;
                        for(k = len; k >= 0; k--) {
                            var mod = modanns[k];
                            if(mod["object"] == ins['id']) {
                                // insatnce上のmodificationも削除される
                                modanns.splice(k, 1);
                               // isDeleteMod = true;
                            }
                        }

                        insanns.splice(i, 1);
                    }
                }

                for(var i in deleteRelIds) {
                    len = modanns.length - 1;
                    for(k = len ; k >= 0; k--) {
                        var mod = modanns[k];
                        if(mod["object"] == deleteRelIds[i]) {
                            // modificationも削除される
                            modanns.splice(k, 1);
                            //isDeleteMod = true;
                        }
                    }

                }

                // 空にする
                selectedInstanceIds.splice(0, selectedInstanceIds.length);

                sortNumJson(annotationJson);
                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);
                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);


                makeInstance(insanns);
                makeInstanceTable();
                addInstypeColor(instypes);
                //setCurrentInsannsStorage(insanns);


                // relation再描画



                makeRelationTable();
                addRelationColor(relations);

                reMakeConnectionOnDelete();

                //setCurrentConnStorage(connArray);

                makeModification(modanns);
                makeModificationTable();
                addModtypeColor(modtypes);

                /*
                // saveする文字列
                var saveStr = "catanns";
                if(isDeleteIns) {
                    saveStr += "_insanns";
                }
                if(isDeleteRel) {
                    saveStr += "_relanns";
                }
                if(isDeleteMod) {
                    saveStr += "_modanns";
                }
                */

                saveCurrent("insanns_relanns_modanns");



            }

            deleteInsIds = null;
            deleteRelIds = null;


        }
    });

    /*
     * 選択を解除
     */
    function cancelSelect(event) {
        // ctrlまたはshiftが押されていないければ
        //console.log(event.target);
        //console.log('createCount:', createCount);
        //console.log('cancel Select');

        if(!isCtrl || !isShift) {

            if(mode == "relation") {

                //console.log('cancel Select in relation');
                // relationモード
                sourceElem = null;
                targetElem = null;

                $('#doc_area span').removeClass('source_selected');
                $('table.annotation').removeClass('t_selected');
                $('table.annotation .removeBtn').hide();

                // instanceの枠の色を元に戻す
                $('div.instance').map(function() {
                    if($(this).hasClass('ins_selected')){
                        $(this).removeClass('ins_selected');

                        addInstanceBorderColor($(this),categories);

                    }
                });

                // instanceテーブルの選択を外す
                $('table.instance').removeClass('t_selected');
                $('table.instance .removeBtn').hide();



                $('table.relation').removeClass('t_selected');
                $('table.relation .removeBtn').hide();

                // modificationの非選択
                if(selectedModificationIds.length > 0) {
                    selectedModificationIds.splice(0, selectedModificationIds.length);
                    unselectModification();
                    addModtypeColor(modtypes);
                }


                /*
                for(var i in selectedConns) {


                    var sConn = selectedConns[i];
                    var source = sConn.source;
                    var target = sConn.target;
                    var rgba = sConn.paintStyleInUse["strokeStyle"];
                    var endpoints = sConn.endpoints;
                    var connId = sConn.getParameter('connId');
                    var type = sConn.getParameter('type');

                    var rgbas = rgba.split(',');
                    rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ', ' + connOpacity + ')';
                    console.log('rgba:', rgba);


                    //var c = makeConnection(source, target, type, rgba, connId);
                    var subject = source.attr('id');
                    var object = target.attr('id');

                    //var c = makeConnection(subject, object, type, rgba, connId, "unselected", labelText, modId, "");

                    selectedModificationIds.splice(0, selectedModificationIds.length);

                    var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);



                }
                */

                // 空にする
                selectedConns.splice(0, selectedConns.length);
                reMakeConnection();

                addModtypeColor(modtypes);

            } else if(mode == "edit") {
                // span編集モード

                //console.log("span編集モード選択解除:", $(this));
                //console.log('selectedModificationIds.length:', selectedModificationIds.length);


                $('table.relation').removeClass('t_selected');
                $('table.relation .removeBtn').hide();


                //selectedModificationIds.splice(0, selectedModificationIds.length);
                if(selectedModificationIds.length > 0) {
                    unselectModification();
                    addModtypeColor(modtypes);
                }




                // 空にする
                selectedIds.splice(0, selectedIds.length);
                selectedInstanceIds.splice(0, selectedInstanceIds.length);



                $('#doc_area span').removeClass('selected').removeClass('partialSelected');
                $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
                $('table.annotation .removeBtn').hide();

                // instanceの枠の色を元に戻す
                $('div.instance').map(function() {
                    if($(this).hasClass('ins_selected')){
                        $(this).removeClass('ins_selected');

                        addInstanceBorderColor($(this),categories);

                    }
                });

                // instanceテーブルの選択を外す
                $('table.instance').removeClass('t_selected');
                $('table.instance .removeBtn').hide();




            }

            event.stopPropagation();
        }
    }

    /*
     *relationのsourceElem及びtargetElemの選択を解除する
     */
    function cancelSelectSourceAndTargetElement() {
        //console.log('cancelSelectSourceAndTargetElement');
        if(mode == "relation") {
            if(sourceElem != null) {
                sourceElem.removeClass('source_selected');
                sourceElem = null;
            }

            if(targetElem != null) {
                targetElem = null;
            }

            // instanceの枠の色を元に戻す
            $('div.instance').map(function() {
                if($(this).hasClass('ins_selected')){
                    $(this).removeClass('ins_selected');

                    addInstanceBorderColor($(this),categories);

                }
            });

        }
    }


    /*
     * 選択解除
     */
    /*
    $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
        "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
        "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
        "table.relation, table.relation tr td, " +
        "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);
    */

    /*
     * 選択解除用にこれらの要素をクリックした時は、その親にイベントが伝搬しないようにする
     */

    /*
    $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
        "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
        "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
        "table.relation, table.relation tr td, " +
        "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div").live("click", function(event){
        // eventの伝搬を止める
        event.stopPropagation();
    });
    */

    /*
     * マウスドラッグ時の開始位置の調整
     */
    function validateStartDelimiter(startPosition) {

        // boundaryであるかどうか
        function searchBoundaryChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }

            return boundaryCharacters.search(re);
        }

        // delimiterであるかどうか
        function searchDelimitChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return delimitCharacters.search(re);
        }
        // original document
        var str = $('#src_area').text();

        // 開始文字
        var startChar = str.charAt(startPosition);

        // 開始位置
        var pos = startPosition;

        // はじめにstart位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで後ろにずらす
        while(searchBoundaryChar(startChar) >= 0){
            //console.log('boundaryがあります');
            pos = pos + 1;
            startChar = str.charAt(pos);
        }

        //console.log('boundary修正startPosition', pos, ":", str.charAt(pos));
        // つぎに、delimitCharacterが現れるまでstart位置を前に戻す
        startChar = str.charAt(pos);
        //console.log("startChar:", startChar, ":", str.charCodeAt(pos) );

        // 次に、その位置がdelimitであれば、そのまま
        // delimjitでなければ、delimitCharcterが現れるまでstart位置を前にさかのぼる
        if(searchDelimitChar(startChar) >= 0) {
            return pos;
        } else {
            while(searchDelimitChar(startChar) < 0) {
                pos = pos - 1;
                startChar = str.charAt(pos);
                //console.log(pos, ":", startChar)
            }
            return pos + 1;
        }
    }

    /*
     * マウスドラッグ時の開始位置の調整2
     * ドラッグした位置以上に縮める
     */
    function validateStartDelimiter2(startPosition) {

        // boundaryであるかどうか
        function searchBoundaryChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }

            return boundaryCharacters.search(re);
        }

        // delimiterであるかどうか
        function searchDelimitChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return delimitCharacters.search(re);
        }
        // original document
        var str = $('#src_area').text();

        // 開始位置はドラッグした最後の文字
        startPosition = startPosition -1;

        // 開始文字
        var startChar = str.charAt(startPosition);

        // 開始位置
        var pos = startPosition;

        //console.log('startChar:', startChar);

        // はじめにstart位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで後ろにずらす
        if(searchBoundaryChar(startChar) < 0) {
            //console.log('boundaryではありません');
            if(searchDelimitChar(startChar) >= 0) {
               // console.log('delimiterです');
                pos = pos + 1;
             } else {
                //console.log('delimiterではありません');
                while(searchDelimitChar(startChar) < 0) {
                    pos = pos + 1;
                    startChar = str.charAt(pos);
                    //console.log(pos, ":", startChar)
                }
               // console.log('pos:', pos);

            }
        }

        while(searchBoundaryChar(startChar) >= 0) {
            //console.log('boundaryがあります');
            pos = pos + 1;
            startChar = str.charAt(pos);
            //console.log(pos, ":", startChar);
        }
        return pos;

    }


    /*
     * マウスドラッグ時の終了位置の調整
     */
    function validateEndDelimiter(endPosition) {

        function searchBoundaryChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return boundaryCharacters.search(re);
        }


        function searchDelimitChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return delimitCharacters.search(re);
        }

        // original document
        var str = $('#src_area').text();

        var endChar = str.charAt(endPosition - 1);

        var pos = endPosition - 1;

        // はじめにend位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで前にずらす
        while(searchBoundaryChar(endChar) >= 0){
            //console.log('boundaryがあります');
            pos = pos - 1;
            endChar = str.charAt(pos);
            //console.log(pos, ":", endChar);
        }
        //console.log('boundary修正endPosition', pos, ":", str.charAt(pos));
        // つぎに、delimitCharacterが現れるまでend位置を後ろにずらす
        endChar = str.charAt(pos);

        // 次に、その位置がdelimitであれば、そのまま
        // delimjitでなければ、delimitCharcterが現れるまでend位置を後ろにずらす
        if(searchDelimitChar(endChar) >= 0) {
            //console.log('delimiterです');
            return pos + 1;
        } else {
            //console.log('delimiterではありません');
            while(searchDelimitChar(endChar) < 0) {
                pos = pos + 1;
                endChar = str.charAt(pos);
                //console.log(pos, ":", endChar)
            }
            return pos;
        }
    }

    /*
     * マウスドラッグ時の終了位置の調整
     * ドラッグした位置以上に縮める
     */
    function validateEndDelimiter2(endPosition) {

        function searchBoundaryChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return boundaryCharacters.search(re);
        }


        function searchDelimitChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return delimitCharacters.search(re);
        }

        // original document
        var str = $('#src_area').text();

        var endChar = str.charAt(endPosition);

        var pos = endPosition;

        // はじめにend位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで前ににずらす
        if(searchBoundaryChar(endChar) < 0) {
            //console.log('boundaryではありません');

            if(searchDelimitChar(endChar) >= 0) {
                //console.log('delimiterです');
                pos = pos - 1;
            } else {
                //console.log('delimiterではありません');

                while(searchDelimitChar(endChar) < 0) {
                    pos = pos - 1;
                    endChar = str.charAt(pos);
                    //console.log(pos, ":", endChar)
                }

                //console.log('pos:', pos);

            }
        }

        while(searchBoundaryChar(endChar) >= 0) {
            //console.log('boundaryがあります');
            pos = pos - 1;
            endChar = str.charAt(pos);
            //console.log(pos, ":", endChar);
        }

        return pos + 1;


    }

    /*
     * text部分をドラッグし、選択した状態
     */

    //Todo

    // span編集モードでは
    // conn.unbind('click');
    // が必要のようだ
    function unbindConnectionEvent() {

        // connectionListを取得
        var connectionList = jsPlumb.getConnections();

        if(connectionList != undefined){

            //console.log('connectionList数:', connectionList.length);

            for(i in connectionList) {
                var conn = connectionList[i];
                conn.unbind("click");
            }
        }

    }

    function bindConnectionEvent() {
        // connectionListを取得
        var connectionList = jsPlumb.getConnections();

        if(connectionList != undefined){

            var conn = connectionList[i];
            // 選択
            conn.bind("click", function(conn, e) {
                //console.log('リレーションモード:', isRelationMode);

                if(mode == "relation") {


                    // 一旦削除して、新たに太い線をかく
                    e.stopPropagation();

                    if(isCtrl) {
                        var source = conn.source;
                        var target = conn.target;
                        var rgba = conn.paintStyleInUse["strokeStyle"];
                        var endpoints = conn.endpoints;
                        var connId = conn.getParameter('connId');
                        var type = conn.getParameter('type');

                        /*
                        var labelText = "";
                        var modId = "";
                        for(var i = 0; i < conn.overlays.length; i++) {
                            var overlay = conn.overlays[i];
                            console.log('label:', overlay["type"]);

                            if(overlay["type"] == "Label") {
                                console.log(overlay.getLabel());
                                labelText = overlay.getLabel();
                                modId = overlay["id"];
                            }
                        }
                        */

                        //console.log('選択されたコネクションID:', connId);

                        var subject = source.attr('id');
                        var object = target.attr('id');

                        //var c = makeConnection(source, target, type, rgba, connId, "selected");
                        //var c = makeConnection(subject, object, type, rgba, connId, "selected", labelText, modId, "");
                        var c = makeConnection2(subject, object, type, rgba, connId, "selected", modanns);

                        selectedConns.push(c);

                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);

                        // テーブルを選択状態にする
                        $('#relation_t_' + connId).addClass('t_selected');
                        // remove_btnを表示
                        $('.relation.t_selected .removeBtn').show();
                        //console.log('削除ボタン:', $('.relation.t_selected .removeBtn'));

                    } else {
                        //console.log('選択されました');
                        // 一旦、選択されていたconnectionを再描画する
                        //console.log('選択されているconnection数:',selectedConns.length);

                        for(i in selectedConns) {
                            var sConn = selectedConns[i];
                            var source = sConn.source;
                            var target = sConn.target;
                            var rgba = sConn.paintStyleInUse["strokeStyle"];
                            var endpoints = sConn.endpoints;
                            var connId = sConn.getParameter('connId');
                            var type = sConn.getParameter('type');

                            //console.log('選択を解除します');
                            //console.log('endpoints:',endpoints);

                            var subject = source.attr('id');
                            var object = target.attr('id');

                            //var c = makeConnection(source, target, type, rgba, connId);
                            //var c = makeConnection(subject, object, type, rgba, connId, "", "", "");
                            var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

                            jsPlumb.deleteEndpoint(endpoints[0]);
                            jsPlumb.deleteEndpoint(endpoints[1]);

                        }

                        // 空にする
                        selectedConns.splice(0, selectedConns.length);

                        var source = conn.source;
                        var target = conn.target;
                        var rgba = conn.paintStyleInUse["strokeStyle"];
                        var endpoints = conn.endpoints;
                        var connId = conn.getParameter('connId');
                        var type = conn.getParameter('type');

                        /*
                        var labelText = "";
                        var modId = "";
                        for(var i = 0; i < conn.overlays.length; i++) {
                            var overlay = conn.overlays[i];
                            console.log('label:', overlay["type"]);

                            if(overlay["type"] == "Label") {
                                console.log(overlay.getLabel());
                                labelText = overlay.getLabel();
                                modId = overlay["id"];
                            }
                        }
                        */

                        var subject = source.attr('id');
                        var object = target.attr('id');

                        //var c = makeConnection(source, target, type, rgba, connId, "selected");
                        //var c = makeConnection(subject, object, type, rgba, connId, "selected", labelText, modId, "");

                        var c = makeConnection2(subject, object, type, rgba, connId, "selected", modanns);
                        //console.log(c);

                        selectedConns.push(c);

                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);

                        // テーブルを選択状態にする
                        $('.relation').removeClass('t_selected');
                        $('.relation .removeBtn').hide();

                        $('#relation_t_' + connId).addClass('t_selected');
                        // remove_btnを表示

                        $('.relation.t_selected .removeBtn').show();

                    }
                }
                return false;
            });
        }

    }


    function doMouseup(e) {
        var selectionRange = window.getSelection();
        var sr = selectionRange.getRangeAt(0);


        if(sr.startContainer != $('div#doc_area').get(0)) {
            // ブラウザのでデフォルトの挙動で
            // ダブルクリックで、テキストが選択されるが、
            // 連続で行うと、その親のdoc_arreaが選択されるので、
            // それ以外の時に、以下を行う

            //e.preventDefault();


            //console.log('doMouseup');
            if(isShift) {
                return false;
            }



            if(annotationJson != undefined) {

                // 位置取得
                var selection = window.getSelection();

                //var doc = document.getElementById('doc_area');

                //var annoJson = JSON.parse($("#annojson").text());

                // 文字列が選択されていると、isCollapsed == false
                if(!selection.isCollapsed) {

                    var range = selection.getRangeAt(0);
                    var anchorRange = document.createRange();
                    anchorRange.selectNode(selection.anchorNode);
                    // console.log('anchorRange:', anchorRange);
                    // console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, anchorRange));//二つのRangeの始点同士の位置を比較
                    //console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_END, anchorRange));//selectionRangeの始点と、rangeの終点を比較
                    //console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.END_TO_START, anchorRange));//selectionRangeの終点と、rangeの始点を比較
                    // console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.END_TO_END, anchorRange));//二つのRangeの終点同士の位置を比較


                    // 選択されたテキストが属するノード
                    // 選択されたテキストより前にHTMLタグがある場合は、それ以降になる。
                    var nodeTxt = selection.anchorNode.textContent;

                    var parentNode = selection.anchorNode.parentNode;
                    //console.log('親ノード:', parentNode);

                    var r = document.createRange();

                    var range = selection.getRangeAt(0);

                    //console.log('selection.anchorNode.parentElement.id:', selection.anchorNode.parentElement.id);
                    //console.log('selection.focusNode.parentElement.id:', selection.focusNode.parentElement.id);

                    // anchorNodeの親ノードとfocusNodeの親ノードが同じidなら
                    // 新たにマークするか、あるいはマーク内にさらにマークである
                    if( selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {


                        if(!isCtrlAlt) {
                            // 新規マーク作成
                            //console.log('新規マーク');
                            createElement(annotationJson, selection);
                        } else {

                            //if(selected != null) {
                            if(selectedIds.length == 1) {
                                // 選択があり、さらにCtrl + Alt キーが押された状態で、anchorNodeまたはfocusNodeがselect上にある場合は
                                // 切り離すまたは削除

                                var selectedId = selectedIds.pop();
                                if(selectedId == selection.anchorNode.parentElement.id || selectedId == selection.focusNode.parentElement.id) {
                                    // anchorNodeまたはfocusNodeが選択された要素上にあるので
                                    //console.log('切り離し');
                                    separateElement(annotationJson, selection, selectedId);
                                    //selected = null;
                                } else {
                                    // selectionに選択要素のNodeが完全に入っているか
                                    if(selection.containsNode($('span#' +selectedId).get(0).childNodes[0], true)) {
                                        // ドラッグした領域が選択された要素の範囲を越えているので削除
                                        //console.log('削除');
                                        removeElement(annoJson, selection, selectedId);
                                        //selected = null;
                                    }
                                }
                            }
                        }
                    } else {

                        var anchorChilds = selection.anchorNode.parentNode.childNodes;
                        // focusノードを起点にしたchild node
                        var focusChilds = selection.focusNode.parentNode.childNodes;

                        var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
                        var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

                        //console.log('絶対anchorPosition:', absoluteAnchorPosition);
                        //console.log('絶対focusPosition', absoluteFocusPosition);

                        if(!isCtrlAlt) {

                            // この場合は、選択範囲の始点と終点が同じノード上似ないので
                            // 新規作成する場合と、伸ばす縮める場合がある
                            //console.log('新規作成または伸ばす、縮める');


                            // 選択範囲の終点がマークの終了位置と同じ
                            if(findJson(selection.focusNode.parentNode.id) != undefined && findJson(selection.focusNode.parentNode.id)['span']["end"] == absoluteFocusPosition) {
                                // 新規作成
                                //console.log("新規作成する場合もある1");

                                // focusNodeのマークの親マークの終了位置がfocusNodeのマークの終了位置より大きいものがある場合は
                                // マークがまたがるので、新規作成しない
                                function IsNodeAcross(selection) {
                                    var element = selection.focusNode.parentElement;

                                    var focusEndPosition = findJson(selection.focusNode.parentElement.id)['span']['end'];

                                    while(true) {
                                        if(element.id == "doc_area") {
                                            return true;
                                        }

                                        //console.log('node id:', element.id);

                                        if(findJson(element.id)['span']["end"] > focusEndPosition ) {
                                            return false;
                                        }

                                        element = element.parentElement;
                                    }
                                }
                                //console.log('新規?:', IsNodeAcross(selection));
                                if(IsNodeAcross(selection)) {
                                    createElement(annoJson,selection);
                                }

                            } else if(findJson(selection.focusNode.parentNode.id) != undefined && findJson(selection.focusNode.parentNode.id)['span']["begin"] == absoluteFocusPosition) {
                                // 選択範囲の終点がマークの開始位置と同じ
                                // 新規作成
                                //console.log("新規作成する場合もある2");

                                // focusNodeのマークの親マークの開始位置がfocusNodeのマークの開始位置より小さいものがある場合は
                                // マークがまたがるので、新規作成しない
                                function IsNodeAcross(selection) {
                                    var element = selection.focusNode.parentElement;

                                    var focusBeginPosition = findJson(selection.focusNode.parentElement.id)['span']['begin'];

                                    while(true) {
                                        if(element.id == "doc_area") {
                                            return true;
                                        }

                                        //console.log('node id:', element.id);

                                        if(findJson(element.id)['span']["begin"] < focusBeginPosition ) {
                                            return false;
                                        }

                                        element = element.parentElement;
                                    }
                                }
                                //console.log('新規?:', IsNodeAcross(selection));
                                if(IsNodeAcross(selection)) {
                                    createElement(annotationJson,selection);
                                }
                            }

                            if(findJson(selection.anchorNode.parentNode.id) != undefined && findJson(selection.anchorNode.parentNode.id)['span']["end"] == absoluteAnchorPosition) {
                                // 選択範囲の開始位置がマークの終了位置と同じ
                                // 新規作成
                                //console.log("新規作成する場合もある3");

                                // anchorNodeのマークの親マークの終了位置がanchorNodeのマークの終了位置より大きいものがある場合は
                                // マークがまたがるので、新規作成しない
                                function IsNodeAcross(selection) {
                                    var element = selection.anchorNode.parentElement;
                                    //var anchorEndPosition = annoJson[selection.anchorNode.parentElement.id]['end'];

                                    // focusノードを起点にしたchild node
                                    var focusChilds = selection.focusNode.parentElement.childNodes;

                                    // そのspanの文字数を計算
                                    var len = getFocusPosBySpan(focusChilds, selection);

                                    //console.log('selection.focusOffset:', selection.focusOffset);
                                    var absoluteBeginPosition = len + selection.focusOffset;

                                    //console.log('選択終了位置の絶対位置:', absoluteBeginPosition);

                                    while(true) {
                                        if(element.id == "doc_area") {
                                            return true;
                                        }

                                        //console.log('node id:', element.id);

                                        if(findJson(element.id)['span']["begin"] > absoluteBeginPosition && findJson(element.id)['span']['begin'] < findJson(selection.anchorNode.parentNode.id)['span']['begin']) {
                                            return false;
                                        }

                                        element = element.parentElement;
                                    }
                                }
                                //console.log('新規?:', IsNodeAcross(selection));
                                if(IsNodeAcross(selection)) {
                                    createElement(annotationJson, selection);
                                }

                            } else if(findJson(selection.anchorNode.parentNode.id) != undefined && findJson(selection.anchorNode.parentNode.id)['span']["begin"] == absoluteAnchorPosition) {
                                // 新規作成
                                //console.log("新規作成する場合もある4");

                                // anchorNodeのマークの終了位置と選択範囲の終了位置の間にあるマークの終了位置がある場合は
                                // マークがまたがるので、新規作成しない
                                function IsNodeAcross(selection) {
                                    var element = selection.anchorNode.parentElement;

                                    // focusノードを起点にしたchild node
                                    var focusChilds = selection.focusNode.parentElement.childNodes;

                                    // そのspanの文字数を計算
                                    var len = getFocusPosBySpan(focusChilds, selection);

                                    //console.log('selection.focusOffset:', selection.focusOffset);

                                    var absoluteEndPosition = len + selection.focusOffset;

                                    while(true) {
                                        if(element.id == "doc_area") {
                                            return true;
                                        }

                                        //console.log('node id:', element.id);

                                        if(findJson(element.id)['span']['end'] > findJson(selection.anchorNode.parentElement.id)['span']['end'] && findJson(element.id)['span']["end"] < absoluteEndPosition ) {
                                            return false;
                                        }

                                        element = element.parentElement;
                                    }
                                }
                                //console.log('新規?:', IsNodeAcross(selection));
                                if(IsNodeAcross(selection)) {
                                    createElement(annotationJson,selection);
                                }

                            }


                            if(selectedIds.length == 1) {
                                var selectedId = selectedIds.pop();
                                if(selectedId == selection.focusNode.parentElement.id) {

                                    // 縮める、伸ばす
                                    //console.log('縮める');
                                    shortenElement(annotationJson, selection, selectedId);
                                    //} else if(selected.attr('id') == selection.anchorNode.parentElement.id) {
                                } else if(selectedId == getSelectedIdByAnchorNode($('span#' + selectedId), selection.anchorNode)) {
                                    //console.log('伸ばします');
                                    extendElement(annotationJson, selection, selectedId);
                                }
                            }

                        } else {
                            // anchorNodeとfocusNodeが同じではない
                            // かつ Ctrl + Altが押されている
                            // この場合、anchorNodeまたはfocusNodeの親にselected要素があるかどうか？
                            // 分割
                            var selectedId = selectedIds.pop();

                            if(selectedId == selection.anchorNode.parentNode.id) {
                                // この場合、focusNodeが違う要素である
                                // console.log('focusNode.id', selection.focusNode.parentNode.id);
                            } else if(selectedId == selection.focusNode.parentNode.id) {
                                // この場合、anchorNodeが違う要素である
                                //console.log('anchorNode.id', selection.anchorNode.parentNode.id);
                            }

                            //console.log('分割');
                            separateElement(annotationJson, selection, selectedId);
                        }

                    }

                }
                // 新しい操作をしたらredoは削除
                redoArray = [];
                //sessionStorage.removeItem('redo');
                changeButtonState($('#redo_btn'), []);
                deselect();


                //jsPlumb.repaintEverything();
            }

        }

    }




    $('#edit_btn').click(function() {
        //console.log($(this).attr('src'));
        if($(this).attr('src') == 'images/edit_on_btn.png') {
            //$(this).attr("src", 'images/edit_off_btn.png');

            //isEditMode = false;

            mode = "view";



            $('#always_multiple_btn').prop('disabled', false);

            $('#doc_area span').die('click', clickSpan);

            $('div.instance').die('click', selectInstance);

            $('#doc_area').die('mouseup',  doMouseup);

            unsetCancelSelect();

            changeMode(mode);



        } else {
            //console.log('編集モード');

            //$(this).attr("src", 'images/edit_on_btn.png');


            //isEditMode = true;

            mode = "edit";



            // relationボタンをオフ
            if($('#relation_btn').attr('src') == 'images/relation_on_btn.png') {
                $('#relation_btn').attr('src', 'images/relation_off_btn.png');
            }
            $('#always_multiple_btn').prop('disabled', false);


            setCancelSelect();


            changeMode(mode);
            /*
            if(annotationJson.length > 0) {
                // 選択解除用にこれらの要素をクリックした時は、その親にイベントが伝搬しないようにする

                $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
                 "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
                "table.relation, table.relation tr td, " +
                "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div").live("click", function(event){
                    // eventの伝搬を止める
                    event.stopPropagation();
                });

                // 選択解除
                 $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                 "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
                    "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
                    "table.relation, table.relation tr td, " +
                    "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);
            } else {
                console.log('no cancel');
            }
            */


        }
        return false;
    })


    /*
     * span idの最大値を求める
     * spn idの形は T+数字
     */
    function getCateMaxId() {
        var numId = 0;
        for(i in annotationJson){
            if(parseInt(annotationJson[i]["id"].slice(1)) > numId){
                numId = parseInt(annotationJson[i]["id"].slice(1));
            }
        }
        return numId;
    }

    /*
     * connection idの最大値を求める
     * connection id の形は R + 数字
     */
    function getMaxConnId() {
        var numId = 0;
        for(var i in connArray){
            if(parseInt(connArray[i]["id"].slice(1)) > numId){
                numId = parseInt(connArray[i]["id"].slice(1));
            }
        }
        //console.log("max conn id:", numId);
        return numId;
    }

    /*
     * insansのidの数字部分の最大値を求める
     */
    function getMaxInsannsId() {
        var numId = 0;
        for(var i in insanns){
            if(parseInt(insanns[i]["id"].slice(1)) > numId){
                numId = parseInt(insanns[i]["id"].slice(1));
            }
        }
        //console.log("max insanns id:", numId);
        return numId;
    }

    /*
     * modannsのidの数字部分の最大値を求める
     */
    function getMaxModannsId() {
        var numId = 0;
        for(var i in modanns){
            if(parseInt(modanns[i]["id"].slice(1)) > numId){
                numId = parseInt(modanns[i]["id"].slice(1));
            }
        }
        //console.log("max insanns id:", numId);
        return numId;
    }


    /*
      * マーク新規作成
      */
    function createElement(annoJson, selection) {

        // 最初にannotationJosnの長さを取得
        createCount = annoJson.length;

        sortNumJson(annoJson);

        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        var anchorChilds = selection.anchorNode.parentNode.childNodes;
        var focusChilds = selection.focusNode.parentNode.childNodes;

        var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
        var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

        //console.log('absoluteAnchorPosition:', absoluteAnchorPosition);
        //console.log('absoluteFocusPosition:', absoluteFocusPosition);

        // 後ろから選択された場合は、
        // 位置を逆転させる
        var tmpPos;

        if(absoluteAnchorPosition > absoluteFocusPosition) {
            tmpPos = absoluteAnchorPosition;
            absoluteAnchorPosition = absoluteFocusPosition;
            absoluteFocusPosition = tmpPos;
        }

        var startPosition = validateStartDelimiter(absoluteAnchorPosition);
        var endPosition = validateEndDelimiter(absoluteFocusPosition);

        // 新規作成された要素
        var newElem = new Array();
        // 不完全要素
        var partialElem = new Array();

        var now = (new Date()).getTime();

        // idの最大値
        var maxId = getCateMaxId();

        // annoJsonに追加
        if(isMultiple) {
            // 選択された要素以外で、新たに作られた要素はaryになる
            var ary = findSameString(startPosition, endPosition, defaultCategory, annoJson);

            for(var i = 0; i < ary.length; i++) {

                var isAcross = false;

                // ここでjsonのbeginとendが他のjsonにまたがっていないかチェックする
                for(j in annoJson) {
                    if(ary[i]['span']['begin'] > annoJson[j]['span']['begin'] && ary[i]['span']['begin'] < annoJson[j]['span']['end'] && ary[i]['span']['end'] > annoJson[j]['span']['end'] ) {
                        // 開始位置がまたがっているので、不完全要素
                        isAcross = true;
                        ary[i]['span']['begin'] = validateStartDelimiter(annoJson[j]['span']['end']);
                        partialElem.push(ary[i]);
                        break;
                    } else if(ary[i]['span']['begin'] < annoJson[j]['span']['begin'] && ary[i]['span']['end'] > annoJson[j]['span']['begin'] && ary[i]['span']['end'] < annoJson[j]['span']['end']) {
                        // 終了位置がまたがっているので、不完全要素
                        ary[i]['span']['end'] = validateEndDelimiter(annoJson[j]['span']['begin']);
                        partialElem.push(ary[i]);
                        isAcross = true;
                        break;
                    }

                }

                if(!isAcross) {

                    ary[i]['created_at'] = now;

                    maxId = maxId + 1;
                    ary[i]['id'] = "T" + maxId;
                    annoJson.push(ary[i]);
                    newElem.push(ary[i]);
                }

            }
        }


        var obj = new Object();
        obj['span'] = {"begin": startPosition, "end": endPosition};
        //obj['begin'] = startPosition;
        //obj['end'] = endPosition;
        obj['category'] = defaultCategory;
        obj['created_at'] = now;
        obj['new'] = true;

        maxId = maxId + 1;
        obj['id'] = "T" + maxId;

        //console.log('annoJson:', annoJson);
        annoJson.push(obj);

        newElem.push(obj);

        // 一旦数字でソート
        sortNumJson(annoJson);

        // 一旦空にする
        selectedIds.splice(0, selectedIds.length);

        for(var i in annoJson) {

            if(annoJson[i]['new']) {
                // 選択状態にする
                //console.log('選択されたのは:', annoJson[i]['id']);
                selectedIds.push(annoJson[i]['id']);
                //selectedElements.push(annoJson[i]);
            }

            for(var j in partialElem) {
                if(annoJson[i]['new'] && annoJson[i]['span']['begin'] == partialElem[j]['span']['begin'] && annoJson[i]['span']['end'] == partialElem[j]['span']['end'] && annoJson[i].category == partialElem[j].category) {
                    //console.log("不完全要素は：", i);
                    // 選択状態にする
                    partialIds.push(i);
                }
            }

            // new プロパティを削除
            delete annoJson[i]['new']
        }

        $("#annojson").text(JSON.stringify(annoJson));



        // 新しい順でテーブルをソート
        //sortStatus = 'new';

        markAnnotation(annoJson);
        makeAnnoTable(annoJson);

        addCategoryColor(categories);
        //setCurrentStorage(annoJson);

        //saveCurrentCatanns();
        saveCurrent("catanns");

        //console.log('createCount:', createCount);

        if(createCount == 0) {
            // 一旦はずす
            unsetCancelSelect();
            setTimeout(setCancelSelect, 10);
        }

        createCount++;

    }

    function unsetCancelSelect() {
        //console.log('unsetCancelSelect ');
        $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div, " +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div").die("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        // 選択解除
        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div," +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div)").die("click", cancelSelect);
    }


    function setCancelSelect() {
        //console.log('setCancelSelect ');
        $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div" +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div").die("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div" +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div").live("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        // 選択解除
        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div, " +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div)").die("click", cancelSelect);



        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "table.relation, table.relation tr td, " +
            "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div, " +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div)").live("click", cancelSelect);


    }


    /*
     * マークを伸ばす
     */
    function extendElement(annoJson, selection, selectedId) {

        sortNumJson(annoJson);
        selectedIds.push(selectedId);

        var range = selection.getRangeAt(0);

        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        //console.log('range:', range);

        //console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, anchorRange));
        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。

        if(range.compareBoundaryPoints(Range.START_TO_START, anchorRange) > 0) {
            //console.log('後ろに伸ばします');
            //console.log(selection.focusNode.parentNode);

            // 選択された用素のの親の親と、selection.focusNodeの親が同じでないといけない
            //if(selected.get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){
            if($('span#' + selectedId).get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){

                // focusNodeの親ノードの位置を求めます
               // console.log('selection.focusNode.parentNode.id:', selection.focusNode.parentNode.id);
                var offset = 0;

                // focusノードを起点にしたchild node
                var focusChilds = selection.focusNode.parentElement.childNodes;

                // そのspanの文字数を計算
                var len = getFocusPosBySpan(focusChilds, selection);

                //console.log('len:', len);

                if(selection.focusNode.parentNode.id == 'doc_area') {

                } else {
                    offset = findJson(selection.focusNode.parentNode.id)['span']['begin'];
                }
                // 位置修正
                var endPosition = validateEndDelimiter(offset + len + selection.focusOffset);

                findJson(selectedId)['span']['end'] = endPosition;

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson, selectedIds);

                saveCurrent("catanns");

            }

        } else {

            if($('span#' + selectedId).get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){
                //console.log('前に伸ばします');
                // focusNodeの親ノードの位置を求めます
                //console.log(selection.focusNode.parentNode.id);
                var offset = 0;

                // focusノードを起点にしたchild node
                var focusChilds = selection.focusNode.parentElement.childNodes;

                // そのspanの文字数を計算
                var len = getFocusPosBySpan(focusChilds, selection);

                if(selection.focusNode.parentNode.id == 'doc_area') {

                } else {
                    offset = findJson(selection.focusNode.parentNode.id)['span']['begin'];
                }

                // 修正
                var startPosition = validateStartDelimiter(offset + len + selection.focusOffset);

                findJson(selectedId)['span']['begin'] = startPosition;

                sortNumJson(annotationJson);

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);

                //saveCurrentCatanns();
                saveCurrent("catanns");



            }
        }

        // instancenの再描画
        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);

        reMakeConnection();


    }

    /*
     * マークを縮める
     */
    function shortenElement(annoJson, selection, selectedId) {

        sortNumJson(annoJson);

        selectedIds.push(selectedId);

        var range = selection.getRangeAt(0);

        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        //console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, focusRange));
        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。

        var i;
        var len = annotationJson.length - 1;

        if(range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
            //console.log('後ろを縮める');
            //console.log('縮める位置は', selection.focusOffset);

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var spanLen = getFocusPosBySpan(focusChilds, selection);

            // 位置修正
            var endPosition = validateEndDelimiter2(findJson(selection.focusNode.parentNode.id)['span']['begin'] + spanLen + selection.focusOffset);

            // 選択範囲がマークの最初と同じであれば、
            // endPositionがマークのbeginよりも大きくなるので、
            // その場合は何もしない
            if(endPosition > findJson(selection.focusNode.parentNode.id)['span']['begin']) {

                findJson(selection.focusNode.parentNode.id)['span']['end'] = endPosition;

                sortNumJson(annotationJson);

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annoJson);

                //saveCurrentCatanns();
                saveCurrent("catanns");
            } else {
                // 結果的に削除
                //console.log('結果的に削除');

                for(i = len; i >= 0; i--) {
                    if(annotationJson[i]['id'] == selectedId) {

                        // このspanに関連するinstance, relation, modificationを削除
                        deleteInstanceAndRelationAndModificationFromSpan(annotationJson[i]['id']);

                        annotationJson.splice(i, 1);
                        selectedIds.pop();
                        break;
                    }
                }

                sortNumJson(annotationJson);

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);

                //saveCurrentCatanns();
                saveCurrent("catanns_insanns_relanns_modanns");
            }

        } else {
            //console.log('前を縮める');
            //console.log('縮める位置は', selection.focusOffset);

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var spanLen = getFocusPosBySpan(focusChilds, selection);

            // 修正
            var startPosition = validateStartDelimiter2(findJson(selection.focusNode.parentNode.id)['span']['begin'] + spanLen +  selection.focusOffset);

            // 選択範囲がメークの最後と同じであれば、
            // startPositionがマークのendよりも大きくなるので、
            // その場合は何もしない
            if(startPosition < findJson(selection.focusNode.parentNode.id)['span']['end']) {
                //console.log('startPosition:', startPosition);

                findJson(selection.focusNode.parentNode.id)['span']['begin'] = startPosition;

                sortNumJson(annotationJson);

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);

                //saveCurrentCatanns();
                saveCurrent("catanns");

            } else {
                // 結果的に削除
                //console.log('結果的に削除');

                for(i = len; i >= 0; i--) {
                    if(annotationJson[i]['id'] == selectedId) {

                        // このspanに関連するinstance, relation, modificationを削除
                        deleteInstanceAndRelationAndModificationFromSpan(annotationJson[i]['id']);

                        annotationJson.splice(i, 1);
                        selectedIds.pop();
                        break;
                    }
                }

                sortNumJson(annotationJson);

                $("#annojson").text(JSON.stringify(annotationJson));

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
                //setCurrentStorage(annotationJson);

                saveCurrent("catanns_insanns_relanns_modanns");
            }
        }

        // instancenの再描画
        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);

        reMakeConnectionOnDelete();

        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);


        reMakeConnection();
    }

    /*
     * マークを分割する
     */
    function separateElement(annoJson, selection, selectedId) {
        //console.log('separateElement');

        sortNumJson(annoJson);

        var anchorChilds = selection.anchorNode.parentNode.childNodes;
        // focusノードを起点にしたchild node
        var focusChilds = selection.focusNode.parentNode.childNodes;

        var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
        var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

        var tmpPos;
        if(absoluteAnchorPosition > absoluteFocusPosition) {
            tmpPos = absoluteAnchorPosition;
            absoluteAnchorPosition = absoluteFocusPosition;
            absoluteFocusPosition = tmpPos;
        }


        // nodeの始点または終点を選択した場合
        var selectedJson = findJson(selectedId);

        //if(absoluteAnchorPosition == annoJson[selectedId]['begin'] ||  absoluteFocusPosition == annoJson[selectedId]['end']) {
        if(absoluteAnchorPosition == selectedJson['span']['begin'] ||  absoluteFocusPosition == selectedJson['span']['end']) {
            //if(startPos == 0) {
            if(absoluteAnchorPosition == selectedJson['span']['begin']) {
                newStart = absoluteFocusPosition;

                //console.log('newStart:', newStart);
                // 修正
                var startPosition = validateStartDelimiter(newStart);

                //console.log('startPosition:', startPosition);

                // 新たな開始点が終了点より小さい場合のみ
                if(startPosition < selectedJson['span']['end']) {
                    //jsonを書き換え
                    //annoJson[selection.anchorNode.parentElement.id]['begin'] = startPosition;
                    selectedJson['span']['begin'] = startPosition;
                }

            } else if(absoluteFocusPosition == selectedJson['span']['end']) {

                //var newEnd = annoJson[selection.anchorNode.parentElement.id]['begin'] + startPos;
                var newEnd = absoluteAnchorPosition;
                // 修正
                var endPosition = validateEndDelimiter(newEnd);
                //jsonを書き換え
                selectedJson['span']['end'] = endPosition;

            }

        } else {
            //console.log('分割　真ん中');

            var newStart = absoluteFocusPosition;
            var newEnd = selectedJson['span']['end'];
            var newLabel = selectedJson['category'];

            var newStartPosition = validateStartDelimiter(newStart);
            var newEndPosition = validateEndDelimiter(newEnd);

            // 分離した前方の終了位置
           // var separatedEndPos = validateEndDelimiter(offset + startPos);
            var separatedEndPos = validateEndDelimiter(absoluteAnchorPosition);

            // 分離した前方の終了位置と分離した後方の終了位置が異なる場合のみ
            if(separatedEndPos != newEndPosition && selectedJson['span']['begin'] != newStartPosition) {
                //jsonを書き換え
                //annoJson[selection.anchorNode.parentElement.id]['end'] = separatedEndPos;
                selectedJson['span']['end'] = separatedEndPos;

                var maxId = getCateMaxId();
                maxId = maxId + 1;
                // 新しいjsonを追加
                var obj = new Object();
                obj['span'] = {"begin": newStartPosition, "end": newEndPosition};
                //obj['begin'] = newStartPosition;
                //obj['end'] = newEndPosition;
                obj['category'] = newLabel;
                obj['created_at'] = selectedJson['created_at'];
                obj['id'] = "T" + maxId;
                annoJson.push(obj);
            }
        }

        sortNumJson(annotationJson);

        $("#annojson").text(JSON.stringify(annotationJson));

        selectedIds.splice(0, selectedIds.length);
        selectedIds.push(selectedId);

        markAnnotation(annotationJson);
        makeAnnoTable(annotationJson);

        addCategoryColor(categories);
        //setCurrentStorage(annotationJson);
        //saveCurrentCatanns();

        saveCurrent("catanns");

        // instancenの再描画
        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);

        reMakeConnection();
    }


    // マークの削除
    function removeElement(annoJson, selection, selectedId) {
        sortNumJson(annotationJson);

        var range = selection.getRangeAt(0);

        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        if((range.compareBoundaryPoints(Range.START_TO_END, focusRange) == 1) && (range.compareBoundaryPoints(Range.END_TO_END, focusRange) == -1)) {

            //var num = selectedId;
            //console.log('削除:', num);

            var i;
            var len = annotationJson.length - 1;
            for(i = len; i >= 0; i--) {
                if(annotationJson[i]['id'] == selectedId) {

                    deleteInstanceAndRelationAndModificationFromSpan(annotationJson[i]["id"]);

                    annotationJson.splice(i, 1);
                    selectedIds.pop();
                    break;
                }
            }

            sortNumJson(annotationJson);

            $("#annojson").text(JSON.stringify(annotationJson));

            markAnnotation(annotationJson);
            makeAnnoTable(annotationJson);

            addCategoryColor(categories);
            //setCurrentStorage(annotationJson);

            /*

            //createCount = annotationJson.length;

            // 削除された場合は、それに接続するconnectionも削除
            var isDeleteRealtion = false;
            var len = connArray.length - 1;
            for(i = len; i >= 0; i--) {
                var conn = connArray[i];
                if(conn.subject == selectedId || conn.object == selectedId) {
                    console.log('接続を削除します source_id:', conn.source_id);
                    isDeleteRealtion = true;
                    connArray.splice(1, i);
                }

            }

            for(var k in hideConnArray) {
                var conn = hideConnArray[k];
                if(conn.subject == selectedId || conn.object == selectedId) {
                    hideConnArray.splice(k, 1);
                }
            }

            //setCurrentConnStorage(connArray);
            if(isDeleteRealtion) {
                //saveCurrentRelanns();
                saveCurrent("relanns");
            }

            */



            // instancenの再描画
            makeInstance(insanns);
            makeInstanceTable();
            addInstypeColor(instypes);

            reMakeConnectionOnDelete();
            makeRelationTable();
            addRelationColor(relations);

            saveCurrent("catanns_insanns_relanns_modanns");


        }
    }


    /*
     * anchorNodeはselectedの内側にあるか
     */
    function getSelectedIdByAnchorNode(selected, anchorNode) {

        var anchorRange = document.createRange();
        anchorRange.selectNode(anchorNode);

        // 選択用素のレンジ
        var selectedRange = document.createRange();
        selectedRange.selectNode(selected.get(0).childNodes[0]);

        //console.log('始点範囲比較:', anchorRange.compareBoundaryPoints(Range.START_TO_START, selectedRange));
        //console.log('終点範囲比較:', anchorRange.compareBoundaryPoints( Range.END_TO_END, selectedRange ))

        if(anchorRange.compareBoundaryPoints(Range.START_TO_START, selectedRange) > 0 && anchorRange.compareBoundaryPoints( Range.END_TO_END, selectedRange ) > 0) {
            // anchorNodeのspan選択用素の中にあれば、選択用素のIDを返す
            //console.log('selected.id:',selected.attr('id'))
            return selected.attr('id');
        }

        // anchorNodeが選択用素の中に無い場合は、anchoreNodeのidを返す
        //console.log('anchorNode:', anchorNode)
        //console.log('anchoreNode.id:',anchorNode.parentElement.id);
        return anchorNode.parentElement.id;

    }


    /*
     * span idをもとに、それに関するinstance,relation,modificationを削除する
     */
    function deleteInstanceAndRelationAndModificationFromSpan(id) {
        // idはannotationJsonのid
        //console.log('id:', id);

        var i;


        // 削除されるインスタンスのid
        var deleteInsIds = new Array();

        // 削除されるrelationのid
        var deleteRelIds = new Array();

        // このspan要素に関するinsatnceを削除
        var len = insanns.length - 1;
        for(i = len; i >= 0; i--) {
            var ins = insanns[i];
            if(ins["object"] == id) {
                deleteInsIds.push(ins["id"]);
                insanns.splice(i, 1);
            }
        }

        // このspan要素に関するrelationを削除する
        var len = connArray.length - 1;
        for(i = len; i >= 0; i--) {
            var conn = connArray[i];
            if(conn["subject"] == id || conn["object"] == id)  {
                deleteRelIds.push(conn["id"]);
                connArray.splice(i, 1);
            }
        }

        // 削除されるinstanceに関するrelationを削除する
        var len = connArray.length - 1;
        for(i = len; i >= 0; i--) {
            var conn = connArray[i];
            for(var j in deleteInsIds) {
                if(conn["subject"] == deleteInsIds[j] || conn["object"] == deleteInsIds[j] ) {
                    connArray.splice(i, 1);
                }
            }
        }

        // 削除されるinstanceに関するmodificationを削除
        var len = modanns.length - 1;
        for(i = len; i >= 0; i--) {
            var mod = modanns[i];

            for(var j in deleteInsIds) {
                if(mod["object"] == deleteInsIds[j]) {
                    modanns.splice(i, 1);
                }
            }

        }

        // 削除されるrelationに関するmodificationを削除
        var len = modanns.length - 1;
        for(i = len; i >= 0; i--) {
            var mod = modanns[i];

            for(var j in deleteRelIds) {
                if(mod["object"] == deleteRelIds[j]) {
                    modanns.splice(i, 1);
                }
            }

        }
    }

    /*
     * spanの表示順番でjsonのソート
     */
    function sortNumJson(json) {
        //console.log('sortNumJson');
        function compare(a, b) {
           // console.log((a['begin'] - b['begin']) || (b['end'] - a['end']));
            return((a['span']['begin'] - b['span']['begin']) || (b['span']['end'] - a['span']['end']));
        }
        json.sort(compare);
    }


    /*
     * 作成順でソート
     */
    function sortNewJson(json) {
        function compare(a, b) {
           // console.log(a['begin'],":", b['begin'], ":", (a['created_at'] - b['created_at']) );

            return((b['created_at'] - a['created_at']) || (a['span']['begin'] - b['span']['begin']) || (b['span']['end'] - a['span']['end']));
            /*
            if( new Number(a['id'].substr(1)) < new Number(b['id'].substr(1)) ) return -1;
            if( new Number(a['id'].substr(1)) > new Number(b['id'].substr(1)) ) return 1;
            return 0;
            */
        }
        json.sort(compare);
    }

    /*
     * カテゴリ順でソート
     */
    function sortCateJson(json) {
        /*
        var ary = new Array();
        for(var i in categories) {
            ary.push(categories[i].split("|")[0]);
        }
        ary.sort();
        */


        function compare(a, b) {
            //console.log('順番:', (a['category'] > b['category']) || (a['begin'] - b['begin']) || (b['end'] - a['end']));
            // console.log('比較:', (a['category']-0), (b['category']-0));
            if( a['category'] < b['category'] ) return -1;
            if( a['category'] > b['category'] ) return 1;
            return 0;

        }
        json.sort(compare);
    }

    /*
     * 作成順でrelationソート
     */
    function sortNewConn(connArray) {
        function compare(a, b) {
            return(b['created_at'] - a['created_at']);
        }
        connArray.sort(compare);
    }

    /*
     * Relation順でrelationソート
     */
    function sortRelConn(connArray) {
        /*
        var ary = new Array();
        for(var i in relations) {
            ary.push(relations[i].split("|")[0]);
        }
        ary.sort();
        */
        function compare(a, b) {
            /*
            for(var i in ary) {
                if(ary[i] == a['relation']) {
                    return -1;
                } else {
                    return 1;
                }
            }
            */
            if( a['type'] < b['type'] ) return -1;
            if( a['type'] > b['type'] ) return 1;
            return 0;
        }


        connArray.sort(compare);
    }


    /*
     * 作成順でinsannsソート
     */
    function sortIdInsanns(insanns) {
        function compare(a, b) {

            return(new Number(a['id'].substr(1)) - new Number(b['id'].substr(1)));
        }
        insanns.sort(compare);
    }

    /*
     * id順でinsannsソート
     */
    function sortNewInsanns(insanns) {
        function compare(a, b) {
            //console.log('created_at:', a["created_at"]);
            return((b['created_at'] - a['created_at']) );
        }
        insanns.sort(compare);
    }

    /*
     * type順でinsannsソート
     */
    function sortTypeInsanns(insanns) {
        var ary = new Array();
        for(var i in instypes) {
            ary.push(instypes[i].split("|")[0]);
        }
        ary.sort();

        function compare(a, b) {
            for(var i in ary) {
                if(ary[i] == a['type']) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
        insanns.sort(compare);
    }

    /*
     * 作成順でmodannsソート
     */
    function sortNewModanns(modanns) {
        function compare(a, b) {
            return(b['created_at'] - a['created_at']);
        }
        modanns.sort(compare);
    }

    /*
     * type順でinsannsソート
     */
    function sortTypeModanns(modanns) {
        var ary = new Array();
        for(var i in modtypes) {
            ary.push(modtypes[i].split("|")[0]);
        }
        ary.sort();

        function compare(a, b) {
            for(var i in ary) {
                if(ary[i] == a['type']) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
        modanns.sort(compare);
    }



    /*
     * 同じ文字列を探す
     * ただし、両外側はdelimiterであること
     */
    function findSameString(startPos, endPos, defaultCategory, annoJson) {
        var document = $('#src_area').text();
        var searchStr = document.substring(startPos, endPos);
        var strLen = endPos - startPos;

        var ary = new Array();

        var from = 0;
        while(true) {
            var sameStrPos = document.indexOf(searchStr, from);
            if(sameStrPos == -1) {
                break;
            }

            //console.log('同じ文字は:', sameStrPos);

            if(!isOutsideDelimiter(document, sameStrPos, sameStrPos + strLen)) {
                var obj = new Object();
                obj['span'] = {"begin": sameStrPos, "end": sameStrPos + strLen};
                //obj['begin'] = sameStrPos;
                //obj['end'] = sameStrPos + strLen;
                obj['category'] = defaultCategory;
                obj['new'] = true; // 新しくつくられた

                var isExist = false;

                for(var i = 0; i < annoJson.length; i++) {
                    if(annoJson[i]['span']['begin'] == obj['span']['begin'] && annoJson[i]['span']['end'] == obj['span']['end'] && annoJson[i].category == obj.category) {
                        isExist = true;
                        break;
                    }
                }

                // マウスでマークされた物以外の同じ文字列
                if(!isExist && startPos != sameStrPos) {
                    ary.push(obj);
                }

            }
            from = sameStrPos + 1;
        }

        return ary;

    }

    /*
     * focusNode上で、そのnodeまでの位置を求める
     */
    function getFocusPosBySpan(childNodes, selection) {
        var len = 0;

        //console.log('childNodes:', childNodes);

        for(var i = 0; i < childNodes.length; i++) {

            // docareaChilds[i]がfocusNodeならば、繰り返しを抜ける
            if(childNodes[i] == selection.focusNode) {
                //console.log('breakします')
                break;
            }

            if(childNodes[i].nodeName == "#text") {
                // text nodeであれば、textの長さ
                len += childNodes[i].nodeValue.length;
            } else {
                // text modeでなけばspanノードなので、
                // そのIDを取得して、文字列の長さを取得
                len += $('#' + childNodes[i].id).text().length;
            }
        }

        return len;
    }

    /*
     * anchorNode上で、そのnodeまでの位置を求める
     */
    function getAnchorPosBySpan(childNodes, selection) {
        var len = 0;

        for(var i = 0; i < childNodes.length; i++) {

            // docareaChilds[i]がanchorNodeならば、繰り返しを抜ける
            if(childNodes[i] == selection.anchorNode) {
                //console.log('breakします')
                break;
            }

            if(childNodes[i].nodeName == "#text") {
                // text nodeであれば、textの長さ
                len += childNodes[i].nodeValue.length;
            } else {
                // text modeでなけばspanノードなので、
                // そのIDを取得して、文字列の長さを取得
                len += $('#' + childNodes[i].id).text().length;
            }
        }

        return len;
    }



    /*
     * focusNode上で、その絶対位置を求める
     */
    function getAbsoluteFocusPosition(childNodes, selection) {
        var pos = 0;

        if(selection.focusNode.parentNode.nodeName == 'SPAN' && selection.focusNode.parentNode.id != "doc_area") {

            pos = findJson(selection.focusNode.parentNode.id)['span']["begin"];
        }

        for(var i = 0; i < childNodes.length; i++) {

            // docareaChilds[i]がfocusNodeならば、繰り返しを抜ける
            if(childNodes[i] == selection.focusNode) {
                pos += selection.focusOffset;
                break;
            }

            if(childNodes[i].nodeName == "#text") {
                // text nodeであれば、textの長さ
                pos += childNodes[i].nodeValue.length;
            } else {
                // text modeでなけばspanノードなので、
                // そのIDを取得して、文字列の長さを取得
                pos += $('#' + childNodes[i].id).text().length;
            }
        }
        return pos;
    }

    /*
     * anchorNode上で、その絶対位置を求める
     */
    function getAbsoluteAnchorPosition(childNodes, selection) {
        var pos = 0;

        if(selection.anchorNode.parentNode.nodeName == 'SPAN' && selection.anchorNode.parentNode.id != "doc_area") {
         pos = findJson(selection.anchorNode.parentNode.id)['span']["begin"];
        }

        for(var i = 0; i < childNodes.length; i++) {

            // docareaChilds[i]がanchorNodeならば、繰り返しを抜ける
            if(childNodes[i] == selection.anchorNode) {
                pos += selection.anchorOffset;
                break;
            }

            if(childNodes[i].nodeName == "#text") {
                // text nodeであれば、textの長さ
                pos += childNodes[i].nodeValue.length;
            } else {
                // text modeでなけばspanノードなので、
                // そのIDを取得して、文字列の長さを取得
                pos += $('#' + childNodes[i].id).text().length;
            }
        }

        return pos;
    }


    /*
     * multipleで作った時に、選択文字列の両外側がdelimiterであるかどうか
     */
    function isOutsideDelimiter(document, startPos, endPos) {
        var outOfBeginChar = document.charAt(startPos-1);
        var outOfEndChar = document.charAt(endPos);

        //console.log('開始文字の外側:',outOfBeginChar );
        //console.log('終了文字の外側', outOfEndChar);

        function searchDelimitChar(char){
            var re;
            if($.inArray(char,  metaCharacters) > 0) {
                re = new RegExp("\\" + char);
            } else {
                re = new RegExp(char);
            }
            return delimitCharacters.search(re);
        }

        var outOfBegin = searchDelimitChar(outOfBeginChar);
        var outOfEnd = searchDelimitChar(outOfEndChar);

        //console.log('delimiter?:', outOfBegin, ':', outOfEnd);

        if(outOfBegin < 0 || outOfEnd < 0) {
            return true;
        }
        return false;

    }


    /*
     * idのjsonを求める
     */
    function findJson(id) {
        for(i in annotationJson) {
            if(annotationJson[i]['id'] == id) {
                return annotationJson[i];
            }
        }
        return null;
    }

    /*
    * ブラウザデフォルトの選択解除
    */
    function deselect() {
        if (window.getSelection){
            var selection = window.getSelection();
            selection.collapse(document.body, 0);
        } else {
            var selection = document.selection.createRange();
            selection.setEndPoint("EndToStart", selection);
            selection.select();
        }
    }


    /*
     * キーダウン
     */
    $(document).keydown(function(e){
        //console.log('keyCode:', e.keyCode);
        //console.log('e.ctrlKey:', e.ctrlKey);

        if(mode == "relation") {
            // relation mode
            // win delete
            // mac fn + delete
            if(e.keyCode == 46) {

                //var isDeleteRel = false;// relationの削除
                //var isDeleteMod = false; // modificationの削除

                for(i in selectedConns){
                    var endpoints = selectedConns[i].endpoints;
                    var id = selectedConns[i].getParameter("connId");

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                    var len = connArray.length - 1;
                    for(k = len; k >= 0; k--) {
                        if(connArray[k]["id"] == id) {
                            //console.log('削除するconnection id:', id);
                            connArray.splice(k, 1);
                            //isDeleteRel = true;
                        }
                    }

                }



                // table再描画
                makeRelationTable();
                addRelationColor(relations);
                selectedConns.splice(0, selectedConns.length);
                //setCurrentConnStorage(connArray);

                // 削除したrelationがあれば
               // if(isDeleteRel) {
               //     //saveCurrentRelanns();
               //     saveCurrent("relanns_modanns");
               // }

                if(selectedModificationIds.length > 0) {
                    deleteModification();
                }

                saveCurrent("catanns_insanns_relanns_modanns");

            } else if((!e.ctrlKey  && e.keyCode == 191) || (!e.ctrlKey && e.keyCode == 83)) {
                // ?キー
                // sキー
                // modificatinを作る
                createModification("Speculation");
                //selectedConns.splice(0, selectedConns.length);

                } else if((!e.ctrlKey && e.keyCode == 78) || (!e.ctrlKey && e.keyCode == 88)) {

                //console.log('create modification');
                // xキー
                // nキー
                createModification("Negation");
                //selectedConns.splice(0, selectedConns.length);

            } else if(e.keyCode == 17) {
                //console.log('set ctrlKey');
                // Ctrlキー
                isCtrl = true;
            } else if(e.keyCode == 16) {
                isShift = true;
            }

        } else if(mode == "edit") {

            // win ctrl
            // mac command
            if(($.os.name != "mac" && e.keyCode == 17) || ($.os.name == "mac" && e.keyCode == 224)) {
                isCtrl = true;
            }

            if(e.keyCode == 16) {
                isShift = true;
            }

            // win ctrl + alt
            // mac command + option
            if(isCtrl && e.keyCode == 18) {
                isCtrlAlt = true;
            }

            // delete key
            // win delete
            // mac fn + delete
            if(e.keyCode == 46) {

                //console.log('削除');

                //var isDeleteCat = false;
                //var isDeleteRel = false; // relationも同時に削除されるか
                //var isDeleteIns = false; // instanceも同時に削除されるか
                //var isDeleteMod = false; // modificationも同時に削除されるか


                var deleteConns = new Array();

                //削除
                if(selectedIds.length > 0) {

                    //isDeleteCat = true;

                    for(var i in selectedIds) {
                        var selectedId = selectedIds[i];

                        var len = annotationJson.length - 1;
                        var j;

                        for(j = len; j >= 0; j--){
                            if(annotationJson[j]['id'] == selectedId) {
                                // span要素が削除される場合、そのインスタンスも削除される
                                for(var n in insanns) {
                                    if(insanns[n]["object"] == selectedId) {
                                        selectedInstanceIds.push(insanns[n]["id"]);
                                        //isDeleteIns = true;
                                    }

                                }
                                annotationJson.splice(j, 1);


                            }
                        }


                        len = connArray.length - 1;
                        for(j = len; j >= 0; j--){
                            var conn = connArray[j];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                deleteConns.push(conn);
                                connArray.splice(j, 1);
                               // isDeleteRel = true;
                            }
                        }

                        len = tmpHidedConnArray.length - 1;
                        for(j = len; j >= 0; j--){
                            var conn = tmpHidedConnArray[j];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                deleteConns.push(conn);
                                tmpHidedConnArray.splice(j, 1);
                                //isDeleteRel = true;
                            }
                        }
                    }





                    // 空にする
                    selectedIds.splice(0, selectedIds.length);
                    sortNumJson(annotationJson);

                    $("#annojson").text(JSON.stringify(annotationJson));

                    //createCount = annotationJson.length;

                    markAnnotation(annotationJson);
                    makeAnnoTable(annotationJson);

                    addCategoryColor(categories);
                    //setCurrentStorage(annotationJson);


                   // makeInstance(insanns);
                   // makeInstanceTable();
                   // addInstypeColor(instypes);


                }

                //
                if(selectedInstanceIds.length > 0) {


                    for(var i in selectedInstanceIds) {
                        var selectedId = selectedInstanceIds[i];
                        //console.log('削除されるインスタンス:', selectedId);
                        //isDeleteIns = true;

                        var len = insanns.length - 1;
                        var k;

                        for(k = len; k >= 0; k--){
                            if(insanns[k]['id'] == selectedId) {
                                insanns.splice(k, 1);
                            }
                        }

                        len = connArray.length - 1;
                        for(k = len; k >= 0; k--){
                            var conn = connArray[k];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                // 削除されるrelationのidを確保
                                deleteConns.push(conn);

                                connArray.splice(k, 1);
                                //isDeleteRel = true;
                            }
                        }

                        len = tmpHidedConnArray.length - 1;
                        for(k = len; k >= 0; k--){
                            var conn = tmpHidedConnArray[k];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                // 削除されるrelationのidを確保
                                deleteConns.push(conn["id"]);

                                tmpHidedConnArray.splice(k, 1);
                                //isDeleteRel = true;
                            }
                        }

                        len = modanns.length - 1;
                        for(k = len; k >= 0; k--) {
                            var mod = modanns[k];
                            if(mod["object"] == selectedId) {
                                // instanceの削除に伴って、modificationも削除
                                modanns.splice(k, 1);
                                //isDeleteMod = true;
                            }
                        }

                    }

                    // relationの削除に伴って、削除されるmodificationがあるか
                    for(var i in deleteConns) {
                        var conn = deleteConns[i];

                        len = modanns.length - 1;
                        for(k = len; k >= 0; k--){
                            var mod = modanns[k];
                            if(conn["id"] == mod["object"]){
                                modanns.splice(k, 1);
                                //isDeleteMod = true;
                            }

                        }
                    }


                    selectedInstanceIds.splice(0, selectedInstanceIds.length);
                    sortNewInsanns(insanns);

                    makeInstance(insanns);
                    makeInstanceTable();
                    addInstypeColor(instypes);


                }

                // さらに、connArrayからtmpHideConnArrayで削除されたconnを削除する
                len = connArray.length - 1;
                for(i = len; i >= 0; i--){
                    var conn = connArray[i];
                    for(var j in deleteConns) {
                        if(conn == deleteConns[j]) {
                            connArray.splice(i, 1);
                        }
                    }
                }

                // relationを書き直し
                reMakeConnectionOnDelete();
                makeRelationTable();
                addRelationColor(relations);

                deleteModification();

                /*
                // saveする文字列

                var saveStr = "";

                if(isDeleteCat) {
                    saveStr += "catanns";
                }

                if(isDeleteIns) {
                    saveStr += "_insanns";
                }
                if(isDeleteRel) {
                    saveStr += "_relanns";
                }
                if(isDeleteMod) {
                    saveStr += "_modanns";
                }
                */

                saveCurrent("catanns_insanns_relanns_modanns");



            } else if(e.keyCode == 73) {
                // Iキー
                // インスタンスを作る
                //console.log('Iキー');
                createInstance();
                reMakeConnection();


            } else if((!e.ctrlKey && e.keyCode == 191) || (!e.ctrlKey && e.keyCode == 83)) {
                // ?キー
                // sキー
                // modificatinを作る
                createModification("Speculation");
            } else if((!e.ctrlKey && e.keyCode == 78) || (!e.ctrlKey && e.keyCode == 88)) {
                // xキー
                // nキー
                createModification("Negation");
            }

            // z(90)で選択要素を前に
            // x(88)で選択要素を次に
            //console.log('isCtrl:', isCtrl);
            //console.log('isCtrlAlt:', isCtrlAlt);

            if(e.keyCode == 90 && !e.ctrlKey && selectedIds.length == 1) {

                selectedIds.splice(0, selectedIds.length);
                sortNumJson(annotationJson);

                if(selectedIdOrder > 0) {
                    selectedIdOrder--;
                } else {
                    selectedIdOrder = annotationJson.length - 1;

                }

                selectedId = annotationJson[selectedIdOrder]['id'];
                selectedIds.push(selectedId);

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);

            } else if(e.keyCode == 88 && !e.ctrlKey && selectedIds.length == 1) {

                selectedIds.splice(0, selectedIds.length);
                sortNumJson(annotationJson);

                if(selectedIdOrder < annotationJson.length -1) {
                    selectedIdOrder++;
                } else {
                    selectedIdOrder = 0;

                }
                selectedId = annotationJson[selectedIdOrder]['id'];

                selectedIds.push(selectedId);

                markAnnotation(annotationJson);
                makeAnnoTable(annotationJson);

                addCategoryColor(categories);
            }

            /*
            if(e.ctrlKey) {
                if(e.keyCode == 90 && undoArray.length > 0) {
                    // 選択状態は解除
                    selectedIds.splice(0, selectedIds.length);
                    selectedInstanceIds.splice(0, selectedInstanceIds.length);
                    selectedModificationIds.splice(0., selectedModificationIds.length);

                    console.log('doUndo');
                    // undo
                    doUndo();
                } else if(e.keyCode == 88 && redoArray.length > 0) {
                    // 選択状態は解除
                    selectedIds.splice(0, selectedIds.length);
                    selectedInstanceIds.splice(0, selectedInstanceIds.length);
                    selectedModificationIds.splice(0., selectedModificationIds.length);

                    console.log('doRedo');
                    // redo
                    doRedo();
                }
            }
            */

        }

        if(e.ctrlKey) {


            //console.log('undoNameArray.length:', undoNameArray.length);
            //console.log('redoNameArray.length:', redoNameArray.length);

            if(e.keyCode == 90 && undoNameArray.length > 0) {

                //console.log("--undo--");
                // 選択状態は解除
                selectedIds.splice(0, selectedIds.length);
                selectedInstanceIds.splice(0, selectedInstanceIds.length);
                selectedConns.splice(0,selectedConns.length);
                selectedModificationIds.splice(0., selectedModificationIds.length);

                // undo
                doUndo();
            } else if(e.keyCode == 88 && redoNameArray.length > 0) {
                //console.log("--redo--");
                // 選択状態は解除
                selectedIds.splice(0, selectedIds.length);
                selectedInstanceIds.splice(0, selectedInstanceIds.length);
                selectedConns.splice(0,selectedConns.length);
                selectedModificationIds.splice(0., selectedModificationIds.length);

                // redo
                doRedo();
            }
        }

    });

    /*
     * キーアップ
     */
    $(document).keyup(function(e){
        // ctrlキー
        // win,mac共通
        if(($.os.name != "mac" && e.keyCode == 17) || ($.os.name == "mac" && e.keyCode == 224)) {
            isCtrl = false;
        }
        // win:altキー,mac:optionキー
        if(e.keyCode == 18) {
            isCtrlAlt = false;
        }

        if(e.keyCode == 16) {
            isShift = false;
        }

    });


    function createInstance() {

        //var annset = insanns[0]["annset"];
        //var type = insanns[0]["type"];
        var type = "subClassOf";

        selectedInstanceIds.splice(0, selectedInstanceIds.length);

        if(selectedIds.length > 0) {


            //console.log('instance max id;', maxId);
            for(var i in selectedIds) {
                //console.log('選択されたspan:', selectedIds[i]);

                var instance = new Object();
                var id = "E" + (getMaxInsannsId() + 1);
                instance["id"] = id;
                //instance["annset"] = annset;
                instance["object"] = selectedIds[i];
                instance["type"] = type;
                instance["created_at"] = (new Date()).getTime();

                //console.log('instance id:', instance["id"]);

                insanns.push(instance);
                selectedInstanceIds.push(id);
            }

        }
        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);
        //setCurrentInsannsStorage(insanns);

        saveCurrent("insanns");

        // 選択されたspan要素は選択をはずす
        // span編集モードの選択を削除
        selectedIds.splice(0, selectedIds.length);
        $('#doc_area span').removeClass('selected').removeClass('partialSelected');
        $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
        $('table.annotation .removeBtn').hide();

    }

    /*
     * instanceの選択
     */
     function selectInstance(e) {
         //console.log('selectInsatnce');
         e.preventDefault();
         //console.log('click span');
         //console.log('shiftキーが押されている:', e.shiftKey);

         // 下に重なってる要素のclickイベントを解除
         $('#doc_area span').unbind('click',arguments.callee);

         if(mode == "relation") {

             var id = $(this).attr('id').split('_')[1];

             //console.log($(this));

             //console.log('id:', id);
             // relation モード
             // relation mode
             //console.log('relation mode');
             //console.log('this:', $(this));
             //console.log('instance id:', $(this).attr('id'));
             //console.log('sourceElem:', sourceElem);

             if(sourceElem == null) {
                 //console.log('here');
                 sourceElem = $('#' + id);
                 sourceElem.css('border-color', '#000000').addClass('ins_selected').attr('id');
             } else {
                 targetElem = $('#' + id);

                 //console.log('there');

                 // 色の指定
                 var color;

                 for(var i in relations) {
                     if(relations[i].split('|')[0] == defaultRelation) {
                         color = relations[i].split('|')[2];
                     }
                 }

                 // rgbaに変換
                 var rgba = colorTrans(color);

                 // connection作成
                 var connId = "R" + (getMaxConnId() + 1);

                 var subject = sourceElem.attr('id');
                 var object = targetElem.attr('id');

                 ///var conn = makeConnection(sourceElem, targetElem, defaultRelation, rgba, connId);
                 //var conn = makeConnection(subject, object, defaultRelation, rgba, connId, "unselected", "", "", "");

                 // 選択されているものは選択をはずす
                 deselectConnection();

                   /*
                 var conn = makeConnection2(subject, object, defaultRelation, rgba, connId, "selected", modanns);

                 selectedConns.push(conn);

                 var source_id = conn.sourceId;
                 var target_id = conn.targetId;
                 var rgba = conn.paintStyleInUse["strokeStyle"];
                 var type = conn.getParameter("type");
                 var id = conn.getParameter("connId");
                    */

                 var obj = new Object();
                 obj.subject = subject;
                 obj.object = object;
                 obj.type = defaultRelation;
                 obj.id = connId;
                 obj.created_at = (new Date()).getTime();

                 // distanceをつける
                 addDistanceToRelation(obj);

                 if(e.shiftKey) {
                     // targetを次のソースにする
                     e.preventDefault();
                     deselect();

                      /*
                     // instanceの枠の色を元に戻す
                     $('div.instance').map(function() {
                         if($(this).hasClass('ins_selected')){
                             $(this).removeClass('ins_selected');

                             addInstanceBorderColor($(this),categories);

                         }
                     });
                     */

                     if(sourceElem.hasClass('source_selected')) {
                         sourceElem.removeClass('source_selected');
                         sourceElem = null;

                         sourceElem = targetElem;
                         sourceElem.addClass('source_selected');
                     } else if(sourceElem.hasClass('ins_selected')) {
                         $('#' + id).removeClass('ins_selected');

                         addInstanceBorderColor($('#' + id),categories);
                         sourceElem = null;
                         sourceElem = targetElem;
                         sourceElem.css('border-color', '#000000').addClass('ins_selected').attr('id');
                     }




                 } else if(e.ctrlKey) {
                     // sourceは元のまま
                     targetElem = null;
                 } else {
                     sourceElem.removeClass('source_selected');

                     // instanceの枠の色を元に戻す
                     $('div.instance').map(function() {
                         if($(this).hasClass('ins_selected')){
                             $(this).removeClass('ins_selected');

                             addInstanceBorderColor($(this),categories);

                         }
                     });

                     sourceElem = null;
                     targetElem = null;

                 }


                 connArray.push(obj);

                 sortConnByDistance(connArray);

                 // 書きなおし
                 jsPlumb.reset();
                 for(var j in connArray) {
                     var conn = connArray[j];
                     var sId = conn['subject'];
                     var tId = conn['object'];

                     var color;
                     for(var k in relations) {
                         if(relations[k].split('|')[0] == conn['type']) {
                             color = relations[k].split('|')[2];
                         }
                     }

                     var rgba = colorTrans(color);
                     var id = conn['id'];
                     var type = conn['type'];

                     //console.log('sElem:', sElem);


                     //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                     //makeConnection(sId, tId, type, rgba, connId, "unselected", "", "", "");
                     if(id == connId) {
                         var rgbas = rgba.split(',');
                         rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';

                         var c = makeConnection2(sId, tId, type, rgba, id, "selected", modanns);
                         selectedConns.push(c);
                     } else {
                         makeConnection2(sId, tId, type, rgba, id, "unselected", modanns);
                     }



                 }



                 // テーブル書き換え
                 makeRelationTable();
                 addRelationColor(relations);
                 //setCurrentConnStorage(connArray);
                 saveCurrent("relanns");
             }

             //console.log('sourceElem2:', sourceElem);

         } else {
             // editモード
             //console.log('select instance');

             if(isCtrl) {
                 //console.log('ctrlキーが押されています');
                 var id = $(this).css('border-color', '#000000').addClass('ins_selected').attr('id');

                 // 該当するテーブルを選択状態にする
                 $('#instance_t_' + $(this).attr('id')).addClass('t_selected');


                 // remove_btnを表示
                 $('.instance.t_selected .removeBtn').show();


                 selectedInstanceIds.push(id);


             } else {
                 // 一旦選択を解除
                 var elem = $('.ins_selected').removeClass('ins_selected');
                 addInstanceBorderColor(elem, categories);
                 // remove_btnを表示
                 $('#insannstable .removeBtn').hide();
                 $('#insannstable .t_selected').removeClass('t_selected');


                 selectedInstanceIds.splice(0, selectedInstanceIds.length);

                 var id = $(this).css('border-color', '#000000').addClass('ins_selected').attr('id');

                 // 該当するテーブルを選択状態にする
                 $('#instance_t_' + $(this).attr('id')).addClass('t_selected');


                 // remove_btnを表示
                 $('.instance.t_selected .removeBtn').show();


                 selectedInstanceIds.push(id);


             }
         }


    }

    function createModification(type) {


        var i;
        /*
        var mod = modanns[i];
        var type = mod["type"];
        var object = mod["object"];
        var id = mod["id"];
        */
        //console.log('mode:',mode);

        if(mode == "relation") {
            //console.log('選択されたrelationの数:', selectedConns.length);

            for(i = 0; i <  selectedConns.length; i++) {
                var conn = selectedConns[i];

                var obj = new Object();
                obj["type"] = type;
                obj["object"] = conn.getParameter("connId");
                //console.log('connId:', conn.getParameter("connId"));
                //console.log('max id:', getMaxModannsId() + 1);
                obj["id"] = "M" + (getMaxModannsId() + 1);
                obj['created_at'] = (new Date()).getTime();

                modanns.push(obj);

                // 選択状態にする
                selectedModificationIds.push(obj["id"]);
            }

            selectedConns.splice(0, selectedConns.length);


            //console.log('selectedConns.length:', selectedConns.length);

            // relationテーブルの色の枠をもとに戻す
            // remove_btnを表示
            $('#relationtable .removeBtn').hide();
            $('#relationtable .t_selected').removeClass('t_selected');

            /*
            // selectedConnsを空にする
            for(i = 0; i < selectedConns.length; i++) {
                var sConn = selectedConns[i];
                var source = sConn.source;
                var target = sConn.target;
                var rgba = sConn.paintStyleInUse["strokeStyle"];
                var endpoints = sConn.endpoints;
                var connId = sConn.getParameter('connId');
                var type = sConn.getParameter('type');

                //console.log('選択を解除します');
                //console.log('endpoints:',endpoints);

                var subject = source.attr('id');
                var object = target.attr('id');

                //var c = makeConnection(source, target, type, rgba, connId);
                //var c = makeConnection(subject, object, type, rgba, connId, "unselected", "", "", "");
                var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

            }
            */


        } else if(mode == "edit") {
            //console.log("here");
            for(i = 0; i < selectedInstanceIds.length; i++) {

                var ins = selectedInstanceIds[i];

                var obj = new Object();
                obj["type"] = type;
                obj["object"] = ins;
                //console.log('instance id:',ins);
                obj["id"] = "M" + (getMaxModannsId() + 1);
                obj['created_at'] = (new Date()).getTime();
                modanns.push(obj);



                selectedModificationIds.push(obj['id']);
            }


            // instanceの枠の色を元に戻す
            $('div.instance').map(function() {
                if($(this).hasClass('ins_selected')){
                    $(this).removeClass('ins_selected');

                    addInstanceBorderColor($(this),categories);

                }
            });

            // remove_btnを表示
            $('#insannstable .removeBtn').hide();
            $('#insannstable .t_selected').removeClass('t_selected');



            selectedInstanceIds.splice(0, selectedInstanceIds.length);
        }

        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);

        //saveCurrentModanns();
        saveCurrent("modanns");

    }


    function selectInsModification(e) {

        // clickイベントの伝搬停止
        e.stopPropagation();

        //console.log('select modification:', $(this));


        var id = $(this).attr('id');

        if(e.ctrlKey) {
            //console.log('ctrlがおされています');
            $(this).addClass('mod_selected');

            // 該当するテーブルを選択状態にする
            $('#modification_t_' + $(this).attr('id')).addClass('t_selected');
            // remove_btnを表示
            $('.modification.t_selected .removeBtn').show();

            selectedModificationIds.push(id);
        } else {
            // 一旦選択を解除
            unselectModification();

            $(this).addClass('mod_selected');

            // 該当するテーブルを選択状態にする
            $('#modification_t_' + $(this).attr('id')).addClass('t_selected');
            // remove_btnを表示
            $('.modification.t_selected .removeBtn').show();

            selectedModificationIds.push(id);
        }


    }


    function deleteModification() {

        //console.log('deleteModification');
        //console.log('selectedModificationIds.length:', selectedModificationIds.length);

        for(var i in selectedModificationIds) {

            // 選択されているmodificationは
            var selectedModId = selectedModificationIds[i];

            var k;
            var len = modanns.length - 1;
            for(var k = len; k >= 0; k--) {
                if(modanns[k]['id'] == selectedModId) {
                    //console.log('spliceします');
                    modanns.splice(k, 1);
                }
            }


            var conns = getConnectionData();

            for(var j in conns) {
                var conn = conns[j];

                var labelText = "";
                var modId = "";
                for(var i = 0; i < conn.overlays.length; i++) {
                    var overlay = conn.overlays[i];
                    //console.log('label:', overlay["type"]);

                    if(overlay["type"] == "Label") {
                        //console.log(overlay.getLabel());
                        labelText = overlay.getLabel();
                        modId = overlay["id"];

                        if(selectedModId == modId) {
                            //

                            var connId = conn["id"];
                            var subject = conn["subject"];
                            var object = conn["object"]
                            var rgba = conn["paintStyle"];
                            var endpoints = conn["endpoints"];
                            var type = conn['type'];

                            jsPlumb.deleteEndpoint(endpoints[0]);
                            jsPlumb.deleteEndpoint(endpoints[1]);

                            var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);
                        }
                    }
                }

            }



        }



        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);

        //saveCurrentModanns();
        selectedModificationIds.splice(0, selectedModificationIds.length);
    }

    /*
     * カテゴリー適用ボタン
     */
    $('.category_apply_btn').live('click', function() {

        // 選択されているannotationテーブルのcategoryに適用
        for(var i in selectedIds) {

            for(var j in annotationJson){
                //console.log('json.id:', parseInt(annotationJson[j]['id']));

                var applyJson = annotationJson[j];

                if(applyJson['id'] == selectedIds[i]) {
                    applyJson['category'] = $(this).text();

                    $("#annojson").text(JSON.stringify(annotationJson));

                    markAnnotation(annotationJson);
                    makeAnnoTable(annotationJson);

                    addCategoryColor(categories);

                }
            }
        }
        //setCurrentStorage(annotationJson);
        //saveCurrentCatanns();
        saveCurrent("catanns");
    });

    /*
     * 関係適用ボタン
     */
    $('.relation_apply_btn').live('click', function() {
        if(selectedConns.length > 0) {
            for(i in selectedConns) {

                var conn = selectedConns[i];

                //console.log('適用されるconn:', conn);

                var source = conn.source;
                var target = conn.target;
                var endpoints = conn.endpoints;
                var connId = conn.getParameter("connId");
                var type = $(this).text();

                var color = $(this).parent().css('backgroundColor');

                var rgba = color.substr(0, color.length -1) + ',' + connOpacity + ')';
                rgba = rgba.replace('rgb', 'rgba');



                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

                var subject = source.attr('id');
                var object = target.attr('id');

                //var conn = makeConnection(source, target, type, rgba, connId);
                //var conn = makeConnection(subject, object, type, rgba, connId, "unselected", labelText, modId, "");
                var conn = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

                var source_id = conn.sourceId;
                var target_id = conn.targetId;
                var rgba = conn.paintStyleInUse["strokeStyle"];
                var type = conn.getParameter("type");
                var id = conn.getParameter("connId");

                var obj = new Object();
                obj.source_id = source_id;
                obj.target_id = target_id;
                obj.type = type;
                obj.id = id;

                // connArrayの中身を入れ替える
                for(var j in connArray) {
                    if(connArray[j]["id"] == id) {
                        //console.log('connArrayを書き換え:', id);
                        connArray[j] = obj;
                        break;
                    }
                }
            }

            selectedConns.splice(0, selectedConns.length);

            // テーブル書き換え
            makeRelationTable();
            addRelationColor(relations);
            //setCurrentConnStorage(connArray);
            //saveCurrentRelanns();
            saveCurrent("relanns");
        }
    });


    /*
     * modificatio0n適用ボタン
     */
    $('.modtype_apply_btn').live('click', function() {

        //console.log('click modtype_apply_btn');

        for(var i in selectedModificationIds) {


            var modId = selectedModificationIds[i];

            for(var j in modanns) {
                var mod = modanns[j];

                if(modId == mod["id"]) {
                    mod['type'] = $(this).text();
                }

            }
        }

        makeModification(modanns);
        makeModificationTable();
        addModtypeColor(modtypes);

        //saveCurrentModanns();
        saveCurrent("modanns");

    });




    /*
    * annotation list上で選択
    */
    function selectAnnotationTable(e) {

        var  selectedId;
        var tagName = $(this).get(0).tagName;

        if(tagName == 'TD') {
            selectedId =  $(this).parent().parent().parent().attr('id').split('_')[1].valueOf();
        } else if(tagName == 'DIV') {
            selectedId =  $(this).parent().parent().parent().parent().attr('id').split('_')[1].valueOf();
        }

        if(isCtrl) {
            //console.log('複数選択');

            selectedIds.push(selectedId);

            // selectedを削除して、class指定が空になった要素はclass="noCategoy"にする
            //$('#doc_area span[class=""]').addClass('noCategory');
            $('span#' + selectedId).addClass('selected');

            if(tagName == 'TD') {
                $(this).parent().parent().parent().addClass('t_selected');
            } else if(tagName == 'DIV') {
                $(this).parent().parent().parent().parent().addClass('t_selected');
            }

            $('.annotation.t_selected .removeBtn').show();

        } else if(isShift && selectedIds.length == 1) {

            e.preventDefault();

            //console.log("shiftキーが押されています");

            var firstId = selectedIds.pop();
            selectedIds.splice(0, selectedIds.length);

            var firstTable = $('#t_' + firstId);

            var lastTable;

            if(tagName == 'TD') {
                lastTable = $(this).parent().parent().parent().parent();
            } else if(tagName == 'DIV') {
                lastTable = $(this).parent().parent().parent().parent();
            }

            var firstIndex;
            var lastIndex;

            $('table.annotation').map(function(i){
                var id = $(this).attr('id').split('_')[1].valueOf();

                if(id == firstTable.attr('id').split('_')[1].valueOf()){
                    firstIndex = i;
                } else if(id == lastTable.attr('id').split('_')[1].valueOf()) {
                    lastIndex = i;
                }
            });

            if(lastIndex < firstIndex) {
                var tmpIndex = lastIndex;
                lastIndex = firstIndex;
                firstIndex = tmpIndex;
            }

            $('table.annotation').map(function(i){
                if(i >= firstIndex && i <= lastIndex) {
                    $(this).addClass('t_selected');
                    var selectedId =  $(this).attr('id').split('_')[1].valueOf();
                    $('span#' + selectedId).addClass('selected');
                    selectedIds.push(selectedId);
                }
            })

            $('.annotation.t_selected .removeBtn').show();

        } else {
            //console.log('何も押されていません');
            // 一旦空にする
            selectedIds.splice(0, selectedIds.length);

            selectedIds.push(selectedId);

            $('span#' + selectedId).addClass('selected');

            $('#doc_area span').removeClass('selected');
            $('table.annotation').removeClass('t_selected');
            $('.removeBtn').hide();
            $('span#' + selectedId).addClass('selected');

            if(tagName == 'TD') {
                $(this).parent().parent().parent().addClass('t_selected');
            } else if(tagName == 'DIV') {
                $(this).parent().parent().parent().parent().addClass('t_selected');;
            }

            $('.annotation.t_selected .removeBtn').show();

        }

        deselect();
        return false;
    }


    /*
     * annotation list部分をクリックで選択する
     */
    //$('table.annotation tr td, table.annotation tr td div').live('click', selectAnnotationTable);


    /*
     * relation list上で選択
     */
    function selectRelationTable(e) {
        //console.log('relationテーブルが選択されました');

        var  selectedId;
        var tagName = $(this).get(0).tagName;

        if(tagName == 'TD') {
            selectedId =  $(this).parent().parent().parent().attr('id').split('_')[2].valueOf();
        } else if(tagName == 'DIV') {
            selectedId =  $(this).parent().parent().parent().parent().attr('id').split('_')[2].valueOf();
        }

        //console.log('selectedId:', selectedId);

        // 一時敵に隠蔽されたconnection以外
        if(!$('#relation_t_' + selectedId).hasClass('tmp_hide')) {

            if(e.ctrlKey) {

                //console.log("ctrlキーが押されています");

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');
                }

                $('.relation.t_selected .removeBtn').show();

                //このIDのconnectionを取得
                var conns = getConnectionData();

                var conn;
                for(var i in conns) {
                    if(conns[i].id == selectedId) {
                        conn = conns[i];
                        break;
                    }
                }

                //var source = $('#' + conn.subject);
                //var target = $('#' + conn.object);
                var source = $('#' + conn.subject);
                var target = $('#' + conn.object);
                var rgba = conn.paintStyle;
                var type = conn.type;
                var endpoints = conn.endpoints;

                var rgbas = rgba.split(',');
                rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';


                //var c = makeConnection(source, target, type, rgba, selectedId, "selected");
                //var c = makeConnection(conn.source_id, conn.target_id, type, rgba, selectedId, "selected", labelText, modId, "");
                var c = makeConnection2(conn.subject, conn.object, type, rgba, selectedId, "selected", modanns);

                selectedConns.push(c);

                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

            } else if(e.shiftKey && selectedConns.length == 1) {

                // ただし、一時非表示がある場合は、何もしない
                if(tmpHidedConnArray == 0) {
                    e.preventDefault();

                    ///console.log("shiftキーが押されています");


                    // 一度選択をはずす
                    for(i in selectedConns) {
                        var sConn = selectedConns[i];
                        var source = sConn.source.attr('id');
                        var target = sConn.target.attr('id');

                        //console.log('source:',source);

                        var rgba = sConn.paintStyleInUse["strokeStyle"];
                        var endpoints = sConn.endpoints;
                        var connId = sConn.getParameter('connId');
                        var type = sConn.getParameter('type');

                            //var c = makeConnection(source, target, type, rgba, connId, "unselected", labelText, modId, "");

                        var c = makeConnection2(source, target, type, rgba, connId, "unselected", modanns);

                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);

                    }


                    var firstConn = selectedConns.pop();
                    selectedConns.splice(0, selectedConns.length);

                    var firstId = firstConn.getParameter('connId');
                    var lastId = selectedId;

                    var firstIndex;
                    var lastIndex;

                    $('table.relation').map(function(i){
                        var id = $(this).attr('id').split('_')[2].valueOf();

                        if(id == firstId){
                            firstIndex = i;
                        } else if(id == lastId) {
                            lastIndex = i;
                        }
                    });

                    if(lastIndex < firstIndex) {
                        var tmpIndex = lastIndex;
                        lastIndex = firstIndex;
                        firstIndex = tmpIndex;
                    }


                    //connection dataを取得
                    var conns = getConnectionData();

                    // 選択されたconnectionのidを入れる
                    var selectedConnArray = new Array();

                    $('table.relation').map(function(i){
                        if(i >= firstIndex && i <= lastIndex) {
                            $(this).addClass('t_selected');
                            var selectedId =  $(this).attr('id').split('_')[2].valueOf();
                            $('span#' + selectedId).addClass('selected');

                            // ここでいれる
                            for(var i in conns) {
                                if(conns[i].id == selectedId) {
                                    selectedConnArray.push(conns[i]);
                                }
                            }
                        }
                    });

                    $('.relation.t_selected .removeBtn').show();



                    for(var k in selectedConnArray) {
                        var conn = selectedConnArray[k];
                       // var source = $('#' + conn.source_id);
                       // var target = $('#' + conn.target_id);
                        var rgba = conn.paintStyle;
                        var type = conn.type;
                        var endpoints = conn.endpoints;
                        var id = conn.id;

                        var rgbas = rgba.split(',');
                        rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';



                            //var c = makeConnection(source, target, type, rgba, id, "selected");
                        //var c = makeConnection(conn.source_id, conn.target_id, type, rgba, id, "selected", labelText, modId, "");
                        var c = makeConnection2(conn.subject, conn.object, type, rgba, id, "selected", modanns);

                        selectedConns.push(c);

                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);
                    }


                }
            } else {


                //console.log("何も押されていません");
                //console.log('selectedConns.length:', selectedConns.length);

                for(var i = 0; i < selectedConns.length; i++) {
                    var sConn = selectedConns[i];
                    var source = sConn.source;
                    var target = sConn.target;
                    var rgba = sConn.paintStyleInUse["strokeStyle"];
                    var endpoints = sConn.endpoints;
                    var connId = sConn.getParameter('connId');
                    var type = sConn.getParameter('type');

                    /*
                    var labelText = "";
                    var modId = "";
                    for(var i = 0; i < conn.overlays.length; i++) {
                        var overlay = conn.overlays[i];
                        console.log('label:', overlay["type"]);

                        if(overlay["type"] == "Label") {
                            console.log(overlay.getLabel());
                            labelText = overlay.getLabel();
                            modId = overlay["id"];
                        }
                    }
                    */

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var rgbas = rgba.split(',');
                    rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',' + connOpacity + ')';


                    //var c = makeConnection(source, target, type, rgba, connId);
                    //var c = makeConnection(subject, object, type, rgba, connId, labelText, modId, "");
                    var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                }

                // 一旦空にする
                selectedConns.splice(0, selectedConns.length);

                $('table.relation').removeClass('t_selected');
                $('table.relation .removeBtn').hide();

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');
                }

                $('.relation.t_selected .removeBtn').show();

                //このIDのconnectionを取得
                var conns = getConnectionData();

                var conn;
                for(var i in conns) {
                    if(conns[i].id == selectedId) {
                        conn = conns[i];
                        break;
                    }
                }




                var source = $('#' + conn.subject);
                var target = $('#' + conn.object);
                var rgba = conn.paintStyle;
                var type = conn.type;
                var endpoints = conn.endpoints;

                /*
                var labelText = "";
                var modId = "";
                for(var i = 0; i < conn.overlays.length; i++) {
                    var overlay = conn.overlays[i];
                    console.log('label:', overlay["type"]);

                    if(overlay["type"] == "Label") {
                        console.log(overlay.getLabel());
                        labelText = overlay.getLabel();
                        modId = overlay["id"];
                    }
                }
                */
                var rgbas = rgba.split(',');
                rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';


               // var c = makeConnection(conn.source_id, conn.target_id, type, rgba, selectedId, "selected", labelText, modId, "");
                var c = makeConnection2(conn.subject, conn.object, type, rgba, selectedId, "selected", modanns);

                selectedConns.push(c);

                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

            }
        }
        deselect();
    }

    /*
     *
     */
    function selectModificationTable(e) {
        //e.stopPropagation();

        //console.log('selectModificationTable');

        var  selectedId;
        var tagName = $(this).get(0).tagName;

        if(tagName == 'TD') {
            selectedId =  $(this).parent().parent().parent().attr('id').split('_')[2].valueOf();
        } else if(tagName == 'DIV') {
            selectedId =  $(this).parent().parent().parent().parent().attr('id').split('_')[2].valueOf();
        }

        //console.log('selectedId:', selectedId);
        //console.log('e.ctrlKey:', e.ctrlKey);


        /*
        if(mode == "edit") {

            if(e.ctrlKey) {
                //console.log('複数選択');


                selectedModificationIds.push(selectedId);

                $('div span#' + selectedId).addClass('mod_selected');

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');;
                }

                $('.modification.t_selected .removeBtn').show();




            } else if(e.shiftKey && selectedModificationIds.length == 1) {


                e.preventDefault();

                console.log("shiftキーが押されています");

                var firstId = selectedModificationIds.pop();

                selectedModificationIds.splice(0, selectedModificationIds.length);

                var firstTable = $('#modification_t_' + firstId);

                var lastTable;

                if(tagName == 'TD') {
                    lastTable = $(this).parent().parent().parent().parent();
                } else if(tagName == 'DIV') {
                    lastTable = $(this).parent().parent().parent().parent();
                }

                var firstIndex;
                var lastIndex;

                $('table.modification').map(function(i){
                    var id = $(this).attr('id').split('_')[2].valueOf();

                    if(id == firstTable.attr('id').split('_')[2].valueOf()){
                        firstIndex = i;
                    } else if(id == lastTable.attr('id').split('_')[2].valueOf()) {
                        lastIndex = i;
                    }
                });

                if(lastIndex < firstIndex) {
                    var tmpIndex = lastIndex;
                    lastIndex = firstIndex;
                    firstIndex = tmpIndex;
                }

                $('table.modification').map(function(i){
                    if(i >= firstIndex && i <= lastIndex) {
                        $(this).addClass('t_selected');
                        var selectedId =  $(this).attr('id').split('_')[2].valueOf();

                        $('div span#' + selectedId).addClass('mod_selected');
                        selectedModificationIds.push(selectedId);
                    }
                })

                $('.modification.t_selected .removeBtn').show();


            } else {
                //console.log('何も押されていません');
                // 一旦空にする
                selectedModificationIds.splice(0, selectedModificationIds.length);


                // 一旦選択を解除
                var elem = $('.mod_selected').removeClass('mod_selected');

                // remove_btnを表示
                $('#modificationtable .removeBtn').hide();
                $('#modificationtable .t_selected').removeClass('t_selected');

                selectedModificationIds.push(selectedId);

                $('div span#' + selectedId).addClass('mod_selected').attr('id');

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');;
                }

                $('.modification.t_selected .removeBtn').show();

            }

        } else if(mode == "relation") {
        */

            if(e.ctrlKey) {
                selectedModificationIds.push(selectedId);


                // instanceのmodificationを選択
                $('div span#' + selectedId).addClass('mod_selected');

                // relationのmodificationを選択
                var objectId;
                var i;
                for(i = 0; i < modanns.length; i++) {
                    var mod = modanns[i];
                    if(selectedId == mod["id"]) {
                        objectId = mod["object"];

                    }
                }

                //console.log('objectId:', objectId);
                // ここで該当するrelationをみつけて、書き直し

                var conns = getConnectionData();
                for(i = 0; i < conns.length; i++) {
                    var conn = conns[i];

                    var subject = conn["subject"];
                    var object = conn["object"];
                    var rgba = conn["paintStyle"];
                    var id = conn["id"];
                    var endpoints = conn["endpoints"];
                    var type = conn["type"];


                    if(id == objectId) {
                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);
                        var c = makeConnection2(subject, object, type, rgba, id, "unselected", modanns);

                    }

                }
                addModtypeColor(modtypes);


                //$('div span#' + selectedId).addClass('mod_selected').attr('id');

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');
                }

                $('.modification.t_selected .removeBtn').show();

            } else if(e.shiftKey && selectedModificationIds.length == 1) {
                e.preventDefault();

                //console.log("shiftキーが押されています");

                var firstId = selectedModificationIds.pop();

                selectedModificationIds.splice(0, selectedModificationIds.length);

                var firstTable = $('#modification_t_' + firstId);

                var lastTable;

                if(tagName == 'TD') {
                    lastTable = $(this).parent().parent().parent().parent();
                } else if(tagName == 'DIV') {
                    lastTable = $(this).parent().parent().parent().parent();
                }

                var firstIndex;
                var lastIndex;

                $('table.modification').map(function(i){
                    var id = $(this).attr('id').split('_')[2].valueOf();

                    if(id == firstTable.attr('id').split('_')[2].valueOf()){
                        firstIndex = i;
                    } else if(id == lastTable.attr('id').split('_')[2].valueOf()) {
                        lastIndex = i;
                    }
                });

                if(lastIndex < firstIndex) {
                    var tmpIndex = lastIndex;
                    lastIndex = firstIndex;
                    firstIndex = tmpIndex;
                }

                $('table.modification').map(function(i){
                    if(i >= firstIndex && i <= lastIndex) {
                        $(this).addClass('t_selected');
                        var selectedId =  $(this).attr('id').split('_')[2].valueOf();

                        // instanceのmodificationを選択
                        $('div span#' + selectedId).addClass('mod_selected');
                        selectedModificationIds.push(selectedId);
                    }
                })

                $('.modification.t_selected .removeBtn').show();



                // relationのmodificationを選択
                var objectIds = new Array();
                var i;
                var j;
                for(i = 0; i < modanns.length; i++) {
                    var mod = modanns[i];

                    for(j = 0; j < selectedModificationIds.length; j++) {

                        if(selectedModificationIds[j] == mod["id"]) {
                            objectIds.push(mod["object"]);

                        }
                    }

                }

                //console.log('objectId:', objectId);
                // ここで該当するrelationをみつけて、書き直し

                var conns = getConnectionData();
                for(i = 0; i < conns.length; i++) {
                    var conn = conns[i];

                    var subject = conn["subject"];
                    var object = conn["object"];
                    var rgba = conn["paintStyle"];
                    var id = conn["id"];
                    var endpoints = conn["endpoints"];
                    var type = conn["type"];

                    for(j = 0; j < objectIds.length; j++) {
                        if(id == objectIds[j]) {
                            jsPlumb.deleteEndpoint(endpoints[0]);
                            jsPlumb.deleteEndpoint(endpoints[1]);
                            var c = makeConnection2(subject, object, type, rgba, id, "unselected", modanns);

                        }
                    }


                }
                addModtypeColor(modtypes);


            } else {
                // 一旦空にする
                selectedModificationIds.splice(0, selectedModificationIds.length);

                // 一旦選択を解除
                var elem = $('.mod_selected').removeClass('mod_selected');

                // remove_btnを表示
                $('#modificationtable .removeBtn').hide();
                $('#modificationtable .t_selected').removeClass('t_selected');


                selectedModificationIds.push(selectedId);


                // instanceのmodificationを選択状態
                $('div span#' + selectedId).addClass('mod_selected').attr('id');

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');;
                }

                $('.modification.t_selected .removeBtn').show();



                // relationのmodificationを選択状態
                var objectId;
                var i;
                for(i = 0; i < modanns.length; i++) {
                    var mod = modanns[i];
                    if(selectedId == mod["id"]) {
                        objectId = mod["object"];

                    }
                }

                //console.log('objectId:', objectId);
                // ここで該当するrelationをみつけて、書き直し

                var conns = getConnectionData();
                for(i = 0; i < conns.length; i++) {
                    var conn = conns[i];

                    var subject = conn["subject"];
                    var object = conn["object"];
                    var rgba = conn["paintStyle"];
                    var id = conn["id"];
                    var endpoints = conn["endpoints"];
                    var type = conn["type"];


                    if(id == objectId) {
                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);
                        var c = makeConnection2(subject, object, type, rgba, id, "unselected", modanns);

                    }

                }
                addModtypeColor(modtypes);


                //$('div span#' + selectedId).addClass('mod_selected').attr('id');

                if(tagName == 'TD') {
                    $(this).parent().parent().parent().addClass('t_selected');
                } else if(tagName == 'DIV') {
                    $(this).parent().parent().parent().parent().addClass('t_selected');
                }

                $('.modification.t_selected .removeBtn').show();
            }
        //}

        deselect();
        return false;
    }


    function selectInstanceTable() {


        var  selectedId;
        var tagName = $(this).get(0).tagName;

        if(tagName == 'TD') {
            selectedId =  $(this).parent().parent().parent().attr('id').split('_')[2].valueOf();
        } else if(tagName == 'DIV') {
            selectedId =  $(this).parent().parent().parent().parent().attr('id').split('_')[2].valueOf();
        }

        //console.log('selectedId:', selectedId);

        if(isCtrl) {
            //console.log('複数選択');

            selectedInstanceIds.push(selectedId);

            $('div#' + selectedId).css('border-color', '#000000').addClass('ins_selected').attr('id');

            if(tagName == 'TD') {
                $(this).parent().parent().parent().addClass('t_selected');
            } else if(tagName == 'DIV') {
                $(this).parent().parent().parent().parent().addClass('t_selected');
            }

            $('.instance.t_selected .removeBtn').show();

        } else if(isShift && selectedIds.length == 1) {

            e.preventDefault();

            //console.log("shiftキーが押されています");

            var firstId = selectedInstanceIds.pop();
            selectedInstanceIds.splice(0, selectedInstanceIds.length);

            var firstTable = $('#instance_t_' + firstId);

            var lastTable;

            if(tagName == 'TD') {
                lastTable = $(this).parent().parent().parent().parent();
            } else if(tagName == 'DIV') {
                lastTable = $(this).parent().parent().parent().parent();
            }

            var firstIndex;
            var lastIndex;

            $('table.instance').map(function(i){
                var id = $(this).attr('id').split('_')[2].valueOf();

                if(id == firstTable.attr('id').split('_')[2].valueOf()){
                    firstIndex = i;
                } else if(id == lastTable.attr('id').split('_')[2].valueOf()) {
                    lastIndex = i;
                }
            });

            if(lastIndex < firstIndex) {
                var tmpIndex = lastIndex;
                lastIndex = firstIndex;
                firstIndex = tmpIndex;
            }

            $('table.instance').map(function(i){
                if(i >= firstIndex && i <= lastIndex) {
                    $(this).addClass('t_selected');
                    var selectedId =  $(this).attr('id').split('_')[2].valueOf();

                    $('div#' + selectedId).css('border-color', '#000000').addClass('ins_selected').attr('id');
                    selectedInstanceIds.push(selectedId);
                }
            })

            $('.instance.t_selected .removeBtn').show();

        } else {
            //console.log('何も押されていません');
            // 一旦空にする
            selectedInstanceIds.splice(0, selectedInstanceIds.length);



            selectedInstanceIds.push(selectedId);


            // 一旦選択を解除
            var elem = $('.ins_selected').removeClass('ins_selected');
            addInstanceBorderColor(elem, categories);
            // remove_btnを表示
            $('#insannstable .removeBtn').hide();
            $('#insannstable .t_selected').removeClass('t_selected');



            $('div#' + selectedId).css('border-color', '#000000').addClass('ins_selected').attr('id');

            if(tagName == 'TD') {
                $(this).parent().parent().parent().addClass('t_selected');
            } else if(tagName == 'DIV') {
                $(this).parent().parent().parent().parent().addClass('t_selected');;
            }

            $('.instance.t_selected .removeBtn').show();

        }

        deselect();
        return false;
    }



    /*
     * annotation list部分のeditable上でクリック
     */
    function focusEditTable(e) {
        var id =  $(this).parent().parent().parent().parent().attr('id').split('_')[1].valueOf();

        if(isCtrl) {

            selectedIds.push(id);

            $('span#' + id).addClass('selected');

            $(this).parent().parent().parent().parent().addClass('t_selected');
            $('.annotation.t_selected .removeBtn').show();
        } else if(isShift && selectedIds.length == 1) {

            //console.log("shiftキーが押されています");

            var firstId = selectedIds.pop();
            selectedIds.splice(0, selectedIds.length);

            var firstTable = $('#t_' + firstId);
            var lastTable = $('#t_' + id);

            var firstIndex;
            var lastIndex;

            $('table.annotation').map(function(i){
                var tableId = $(this).attr('id').split('_')[1].valueOf();

                if(tableId == firstId){
                    firstIndex = i;
                } else if(tableId == id) {
                    lastIndex = i;
                }
            });

            if(lastIndex < firstIndex) {
                var tmpIndex = lastIndex;
                lastIndex = firstIndex;
                firstIndex = tmpIndex;
            }

            $('table.annotation').map(function(i){
                if(i >= firstIndex && i <= lastIndex) {
                    $(this).addClass('t_selected');
                    var selectedId =  $(this).attr('id').split('_')[1].valueOf();
                    $('span#' + selectedId).addClass('selected');
                    selectedIds.push(selectedId);
                }
            })

            $('.annotation.t_selected .removeBtn').show();

        } else {

            // 一旦空にする
            selectedIds.splice(0, selectedIds.length);

            selectedIds.push(id);

            $('#doc_area span').removeClass('selected');
            $('table.annotation').removeClass('t_selected');
            $('table.newAnnotation').removeClass('t_selected');
            $('.removeBtn').hide();

            $('span#' + id).addClass('selected');

            $(this).parent().parent().parent().parent().addClass('t_selected');
            $('.annotation.t_selected .removeBtn').show();

        }
    }




    /*
     * loadアイコンクリックでロードウィンドウ表示
     */
    $('#load_btn').click(function() {
        $('#load_dialog').show();
    });

    /*
     * load submitボタンクリックでサーバーからデータをロード
     */
    $('#load_submit').click(function() {
        loadAnnotation();
        $('#load_dialog').hide();
        return false;
    });

    /*
     * load キャンセル
     */
    $('#load_cancel').click(function() {
        $('#load_dialog').hide();
        return false;
    });

    /*
     * saveアイコンクリックでセーブウィンドウ表示
     */
    $("#save_btn").click(function(){
        $('#save_dialog').show();
        $('#save_url').val(targetUrl);
        return false;
    });


    jQuery.fn.center = function () {

        //position:absolute;を与えて、ウィンドウのサイズを取得し、topとleftの値を調整

        this.css("position","absolute");

        this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");

        this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");

        return this;

    };



    /*
     * save submitボタンクリックでサーバーにデータをPOST
     */
    $('#save_submit').click(function() {
        $('#save_dialog').hide();
        $('#loading').center().show();
        //var post_catanns = JSON.parse($("#annojson").text());
        var doc = $('#src_area').text();
        /*
        for(i in post_catanns) {
            delete post_catanns[i]["x"];
            delete post_catanns[i]["y"];
        }
        */
        var post_catanns = annotationJson


        var postData = {
            "text":doc,
            "catanns": post_catanns,
            "relanns": connArray,
            "insanns": insanns,
            "modanns": modanns
        }

        $.ajax({
            type: "post",
            url: $('#save_url').val(),
            data: postData,
            //dataType: "jsonp",
            //jsonp : 'callback',
            //crossDomain: true,
            //processData: false,
            //contentType: "application/json",
            success: function(res){
                //console.log( "Data Saved: " + res );
                $('#loading').hide();

                //var result = JSON.parse(res);
                if(res) {
                    $('#msg_area').html("Data saved!").fadeIn().fadeOut(5000, function() {
                        $(this).html('').removeAttr('style');
                        $(this).html(targetUrl);
                    });
                }else {
                    alert("Data save failed!");
                };
            },
            error: function(res, textStatus, errorThrown){
                //console.log("エラー:", res, ":", textStatus);
                $('#save_dialog').hide();
                $('#msg_area').html("unknown error").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    $(this).html(targetUrl);
                });
            }
        });

        return false;
    });

    /*
     * saveキャンセル
     */
    $('#save_cancel').click(function() {
        $('#save_dialog').hide();
        return false;
    });

    /*
     * always_multiple_btnをクリック
     */
    $('#always_multiple_btn').live("click", function() {
        //console.log($(this).attr('src'));
        if($(this).attr('src') == 'images/always_multiple_on_btn.png') {
            $(this).attr("src", 'images/always_multiple_off_btn.png');
            $('#multiple_btn').prop('disabled', false);
            $('#multiple_btn').css('opacity', 1);
            isMultiple = false;
        } else {
            $(this).attr("src", 'images/always_multiple_on_btn.png');
            $('#multiple_btn').prop('disabled', true);
            $('#multiple_btn').css('opacity', 0.3);
            isMultiple = true;
        }
        return false;
    });

    /*
     * multiple_btnをクリック
     */
    $('#multiple_btn').click(function() {
        if(selectedIds.length == 1) {
            var id = selectedIds[0];
           //var annoJson = JSON.parse($("#annojson").text());
            //console.log('id:', id);

            var selectedAnno;
            for(var k in annotationJson) {
                if(annotationJson[k]['id'] == id) {
                    selectedAnno = annotationJson[k];
                    break;
                }
            }


            //console.log('selectedAnno:', selectedAnno);
            var startPos = selectedAnno["span"]["begin"];
            var endPos = selectedAnno["span"]["end"];
            var category = selectedAnno["category"];

            var origElem = selectedAnno;

            // 新規作成された要素
            var newElem = new Array();
            // 不完全要素
            var partialElem = new Array();

            var now = (new Date()).getTime();
            var maxId = getCateMaxId();

            var ary = findSameString(startPos, endPos, category, annotationJson);

            for(var i = 0; i < ary.length; i++) {

               var isAcross = false;

               // ここでjsonのbeginとendが他のjsonにまたがっていないかチェックする
               for(j in annotationJson) {
                   if(ary[i]['span']['begin'] > annotationJson[j]['span']['begin'] && ary[i]['span']['begin'] < annotationJson[j]['span']['end'] && ary[i]['span']['end'] > annotationJson[j]['span']['end'] ) {
                       // 開始位置がまたがっているので、不完全要素
                       isAcross = true;
                       ary[i]['span']['begin'] = validateStartDelimiter(annotationJson[j]['span']['end']);
                       partialElem.push(ary[i]);
                       break;
                   } else if(ary[i]['span']['begin'] < annotationJson[j]['span']['begin'] && ary[i]['span']['end'] > annotationJson[j]['span']['begin'] && ary[i]['span']['end'] < annotationJson[j]['span']['end']) {
                       // 終了位置がまたがっているので、不完全要素
                       ary[i]['end'] = validateEndDelimiter(annotationJson[j]['begin']);
                       partialElem.push(ary[i]);
                       isAcross = true;
                       break;
                   }

               }

               if(!isAcross) {
                   //console.log("ary[i]['begin']:", ary[i]["begin"]);
                   //console.log("ary[i]['end']:", ary[i]["end"]);
                   maxId = maxId + 1;
                   ary[i]['id'] = "T" + maxId;

                   ary[i]['created_at'] = now;
                   annotationJson.push(ary[i]);
                   newElem.push(ary[i]);
               }

            }

           sortNumJson(annotationJson);

           for(var i in annotationJson) {

               if(annotationJson[i]['new']) {
                   // 選択状態にする
                   selectedIds.push(annotationJson[i]['id']);
                   //selectedElements.push(annoJson[i]);
               }

               for(var j in partialElem) {
                   if(annotationJson[i]['new'] && annotationJson[i]['span'].begin == partialElem[j]['span'].begin && annotationJson[i]['span'].end == partialElem[j]['span'].end && annotationJson[i].category == partialElem[j].category) {
                       //console.log("不完全要素は：", i);
                       // 選択状態にする
                       partialIds.push(i);
                   }
               }

               // new プロパティを削除
               delete annotationJson[i]['new']
           }

           $("#annojson").text(JSON.stringify(annotationJson));

           markAnnotation(annotationJson);
           makeAnnoTable(annotationJson);

           addCategoryColor(categories);
           //setCurrentStorage(annotationJson);

           //saveCurrentCatanns();
           saveCurrent("catanns");
        }
        return false;
    });


    /*
     * notice_ok_btnをクリック
     */
    $('#notice_ok_btn').live('click', function() {
        $('#notice_area').empty();

        if($('.partial').hasClass('partialSelected')) {
            $('.partial').addClass('selected');
        }

        if($('.t_partial').hasClass('t_partialSelected')) {
            $('.t_partial').addClass('t_selected');
        }

        $('.partial').removeClass('partialSelected').removeClass('partial');
        $('.t_partial').removeClass('t_partialSelected').removeClass('t_partial');
    });

    /*
     * annotation作成順ソート
     */
    $('#sort_new_btn').live('click', function() {

        if($(this).attr('src') == 'images/sort_new_off_btn.png') {
            $(this).attr("src", 'images/sort_new_on_btn.png');
            $('#sort_num_btn').attr('src', 'images/sort_num_off_btn.png');
            $('#sort_cate_btn').attr('src', 'images/sort_cate_off_btn.png');
            sortStatus = 'new';

            makeAnnoTable(annotationJson);
            addCategoryColor(categories);
        }

        return false;
    });

    /*
     * annotation text順ソート
     */
    $('#sort_num_btn').live('click', function() {

        if($(this).attr('src') == 'images/sort_num_off_btn.png') {
            $(this).attr("src", 'images/sort_num_on_btn.png');
            $('#sort_new_btn').attr('src', 'images/sort_new_off_btn.png');
            $('#sort_cate_btn').attr('src', 'images/sort_cate_off_btn.png');
            sortStatus = 'num';

            makeAnnoTable(annotationJson);
            addCategoryColor(categories);
        }
        return false;
    });


    /*
     * annotation Category順ソート
     */
    $('#sort_cate_btn').live('click', function() {



        if($(this).attr('src') == 'images/sort_cate_off_btn.png') {
            $(this).attr("src", 'images/sort_cate_on_btn.png');
            $('#sort_num_btn').attr('src', 'images/sort_num_off_btn.png');
            $('#sort_new_btn').attr('src', 'images/sort_new_off_btn.png');
            sortStatus = 'cate';

            makeAnnoTable(annotationJson);
            addCategoryColor(categories);
        }
        return false;

    });

    /*
     * relation 作成順ソート
     */
    $('#sort_rel_new_btn').live('click', function() {

        if($(this).attr('src') == 'images/sort_new_off_btn.png') {
            $(this).attr("src", 'images/sort_new_on_btn.png');
            $('#sort_rel_btn').attr('src', 'images/sort_rel_off_btn.png');
            sortConnStatus = 'new';

            makeRelationTable();
            addRelationColor(relations);
        }

        return false;
    });

    /*
     * relation RelCategory順ソート
     */
    $('#sort_rel_btn').live('click', function() {

        if($(this).attr('src') == 'images/sort_rel_off_btn.png') {
            $(this).attr("src", 'images/sort_rel_on_btn.png');
            $('#sort_rel_new_btn').attr('src', 'images/sort_new_off_btn.png');
            sortConnStatus = 'rel';

            makeRelationTable();
            addRelationColor(relations);
        }
        return false;
    });


    /*
     * 一時的に非表示状態にしたコネクションの再表示
     */
    function showHideAllConnections(flag, relType) {

        if(flag == "show") {
            // hidden connection draw
            var start = tmpHidedConnArray.length - 1;
            for(var i = start;  i >= 0;  i--) {
                var connObj = tmpHidedConnArray[i];
                var s_id = connObj['subject'];
                var t_id = connObj['object'];
                var rgba = connObj['paintStyle'];
                var connId = connObj['id'];
                var type = connObj['type'];

                /*
                var labelText = "";
                var modId = "";
                for(var i = 0; i < connObj.overlays.length; i++) {
                    var overlay = connObj.overlays[i];
                    console.log('label:', overlay["type"]);

                    if(overlay["type"] == "Label") {
                        console.log(overlay.getLabel());
                        labelText = overlay.getLabel();
                        modId = overlay["id"];
                    }
                }
                */

                //console.log('s_id:', s_id);
                if(relType == "all") {

                    $('.rel_hide').attr('checked','checked');
                    //makeConnection($('#' + s_id), $('#' + t_id), type, rgba, connId);

                    //makeConnection(s_id, t_id, type, rgba, connId, "unselected", labelText, modId, "");

                    makeConnection2(s_id, t_id, type, rgba, connId, "unselected", modanns);
                    tmpHidedConnArray.splice(i, 1);
                    $('.tmp_hide').removeClass('tmp_hide');

                } else {
                    if(type == relType) {

                        //makeConnection($('#' + s_id), $('#' + t_id), type, rgba, connId);

                        //makeConnection(s_id, t_id, type, rgba, connId, "unselected", labelText, modId, "");

                        makeConnection2(s_id, t_id, type, rgba, connId, "unselected", modanns);
                        tmpHidedConnArray.splice(i, 1);
                        $('.tmp_hide.t_' + type).removeClass('tmp_hide');
                    }
                }
            }


            selectedConns.splice(0, selectedConns.length);

            jsPlumb.repaintEverything();

        } else {

        }
    }

    /*
     * relation showボタンクリック
     */
    /*
    $('#relation_show_btn').click(function() {
        showHideAllConnections("show", "all");
        $('#notice_area').empty();
        $('.tmp_hide').removeClass('tmp_hide');
    });
    */

    /*
     * relationモードボタンクリック
     */
    $('#relation_btn').click(function() {

        if(sourceElem != null) {
            //console.log('sourceElemがあります');
            sourceElem = null;
            $('.source_selected').removeClass('source_selected');

            // 空にする
            selectedConns.splice(0, selectedConns.length);
        }

        // テーブルを選択解除にする
        $('.relation').removeClass('t_selected');
        $('.annotation').removeClass('t_selected');
        $('.removeBtn').hide();

        if($(this).attr('src') == 'images/relation_off_btn.png') {
            //$(this).attr("src", 'images/relation_on_btn.png');

            $('#always_multiple_btn').prop('disabled', true);

            // relationモード
            //isRelationMode = true;


            mode = "relation";
            // connectionにclickイベントをバインド
            // bindConnectionEvent();

            changeMode(mode);

            /*
            $('#doc_area span').live('click', clickSpan);

            // annotation tableの選択を不可
            $('table.annotation tr td, table.annotation tr td div').die('click', selectAnnotationTable);
            $('.editable').die('focus', focusEditTable);
            $('div.editable').addClass('non_edit').removeClass('editable').unbind('click.editable');

            sessionStorage.setItem('mode', 'relation');

            $('#rel_area').show();

            // span編集モードの選択を削除
            selectedIds.splice(0, selectedIds.length);
            $('#doc_area span').removeClass('selected').removeClass('partialSelected');
            $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
            $('.removeBtn').hide();

            $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                'table.annotation tr td div, ' +
                'table.newAnnotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, form, #load_dialog, #load_btn, :button, :text, :input')
            $('#doc_area').die('mouseup', doMouseup);


            // 選択解除
            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, " +
                "table.newAnnotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div)").die("click", cancelSelect);

            // sourceElem とtargetElemの選択解除
            $("*:not(#doc_area span, #ins_area div)").live("click", cancelSelectSourceAndTargetElement);



            // relation テーブル編集
            $('table.relation tr td, table.relation tr td div').live('click', selectRelationTable);
            */

            /*
            // connection 再描画
            for(j in hideConnArray) {
                var connObj = hideConnArray[j];
                var sElem = connObj['subject'];
                var tElem = connObj['object'];
                var rgba = connObj['paintStyle'];
                var connId = connObj['id'];
                var type = connObj['type'];

                console.log('sElem:', sElem);



                makeConnection($('#' + sElem), $('#' + tElem), type, rgba, connId);

            }
            */

        } else {
            // viewモード
            //$(this).attr("src", 'images/relation_off_btn.png');

            // viewモード
            mode = 'view';



            // span編集モード

            // connectionのclickイベントをunbind
            //unbindConnectionEvent();

            //console.log('選択された接続数:',selectedConns.length);
            //もし選択せれた接続があれば、線を細く書き直す
            for(var i in selectedConns) {
                var sConn = selectedConns[i];
                var source = sConn.source;
                var target = sConn.target;
                var rgba = sConn.paintStyleInUse["strokeStyle"];
                var endpoints = sConn.endpoints;
                var connId = sConn.getParameter('connId');
                var type = sConn.getParameter('type');

                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

                /*
                var labelText = "";
                var modId = ""
                for(var i = 0; i < conn.overlays.length; i++) {
                    var overlay = conn.overlays[i];
                    console.log('label:', overlay["type"]);

                    if(overlay["type"] == "Label") {
                        console.log(overlay.getLabel());
                        labelText = overlay.getLabel();
                        modId = overlay["id"]
                    }
                }
                */


                // makeConnection(source, target, type, rgba, connId, "unselected", labelText, modId, "");
                makeConnection2(source, target, type, rgba, connId, "unselected", modanns);
            }

            changeMode(mode);
            /*


            //console.log('text edit mode');

            isRelationMode = false;
            // annotation tableの選択を可
            $('table.annotation tr td, table.annotation tr td div').live('click', selectAnnotationTable);
            $('div.non_edit').addClass('editable').removeClass('non_edit');
            $('.editable').editable(function(value, settings) {

                // 要素と値を渡して、jsonを編集
                return editAnnotation($(this), value);

            });

            $('.editable').live('focus', focusEditTable);

            sessionStorage.setItem('mode',"annotation")



            $('#doc_area').live('mouseup',  doMouseup);

            // 選択解除

            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, " +
                " .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);


            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

            // sourceElem とtargetElemの選択解除
            $("*:not(#doc_area span)").die("click", cancelSelectSourceAndTargetElement);
            */
        }

    });


    function unselectRelation() {
        $('table.relation').removeClass('t_selected');
        $('table.relation .removeBtn').hide();

        for(var i in selectedConns) {
            var sConn = selectedConns[i];
            var source = sConn.source;
            var target = sConn.target;
            var rgba = sConn.paintStyleInUse["strokeStyle"];
            var endpoints = sConn.endpoints;
            var connId = sConn.getParameter('connId');
            var type = sConn.getParameter('type');

            /*
            var labelText = "";
            var modId = ""
            for(var i = 0; i < sConn.overlays.length; i++) {
                var overlay = sConn.overlays[i];
                console.log('label:', overlay["type"]);

                if(overlay["type"] == "Label") {
                    console.log(overlay.getLabel());
                    labelText = overlay.getLabel();
                    modId = overlay["id"];
                }
            }
            */

            //var c = makeConnection(source, target, type, rgba, connId);
            var subject = source.attr('id');
            var object = target.attr('id');

            //var c = makeConnection(subject, object, type, rgba, connId, "unselected", labelText, modId, "");

            var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);
        }
        // 空にする
        selectedConns.splice(0, selectedConns.length);
    }




    function changeMode(mode) {

        sourceElem = null;
        targetElem = null;

        if(mode == 'view') {

            $('#doc_area').removeAttr('style');
            $('#ins_area').removeAttr('style');


            var bg_color = $('#doc_area').css('backgroundColor');

            if(bg_color.substr(0,4) == 'rgba') {
                var rgba = bg_color.replace('rgba', '').replace('(', '').replace(')', '');
                var rgbas = rgba.split(',');
                var rgb = 'rgb(' + rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ')' ;
                $('#doc_area').css('backgroundColor', rgb);
            }



            //console.log(rgb);


            $('#edit_btn').attr("src", 'images/edit_off_btn.png');
            $('#relation_btn').attr("src", 'images/relation_off_btn.png');

            // span編集モードの選択を削除
            selectedIds.splice(0, selectedIds.length);
            $('#doc_area span').removeClass('selected').removeClass('partialSelected');
            $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
            $('.removeBtn').hide();

            // マウスアップで、spanの操作をアンバインド
            $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                'table.annotation tr td div, ' +
                'table.newAnnotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, form, ' +
                '#load_dialog, #load_btn, :button, :text, :input');
            $('#doc_area').die('mouseup', doMouseup);

            // 選択解除イベントをアンバインド
            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, " +
                "table.newAnnotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div, " +
                "#ins_area div span.modification)").die("click", cancelSelect);



            $('.editable').die('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').die('click', selectInstanceTable);


            // sourceElem とtargetElemの選択解除をアンバインド
            $("*:not(#doc_area span, #ins_area div)").die("click", cancelSelectSourceAndTargetElement);


            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

            $('table.annotation tr td, table.annotation tr td div').die('click', selectAnnotationTable);

            $('table.modification tr td, table.modification tr td div').die('click', selectModificationTable);

            removeEditableFromTable();
            $('.editable').die('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').die('click', selectInstanceTable);

            // relation テーブル編集をアンバインド
            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

            $('#doc_area span').die('click', clickSpan);

            $('div.instance').die('click', selectInstance);


            if(selectedModificationIds.length > 0) {
                selectedModificationIds.splice(0, selectedModificationIds.length);
                unselectModification();
                addModtypeColor(modtypes);
            }


            duplicateDocArea();



            // relationの選択を解除
            unselectRelation();

            unsetCancelSelect();


            // インスタンス上のmodificationを選択不可にする
            $('span.instance_modification').die('click', selectInsModification);


        } else if(mode == 'edit') {

            $('#doc_area').css('z-index', 1);
            $('#ins_area').css('z-index', 2);

            var bg_color = $('#doc_area').css('backgroundColor');

            if(bg_color.substr(0, 4) != 'rgba') {
                var rgb = bg_color.replace('rgb', '').replace('(', '').replace(')', '');
                var rgba = 'rgba(' + rgb + ',0.5)';
                //console.log(bg_color);
                //console.log(rgba);
            }




            $('#doc_area').css('backgroundColor', rgba);

            $('#edit_btn').attr("src", 'images/edit_on_btn.png');
            $('#relation_btn').attr("src", 'images/relation_off_btn.png');


            // spanの選択を削除
            selectedIds.splice(0, selectedIds.length);
            $('#doc_area span').removeClass('source_selected');
            $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
            $('.removeBtn').hide();

            $('#clone_area div').remove();

            setCancelSelect();

            //console.log(mode);

            // relationの選択を解除
            unselectRelation();

            // modificationの選択を削除
            if(selectedModificationIds.length > 0) {
                selectedModificationIds.splice(0, selectedModificationIds.length);
                unselectModification();
                addModtypeColor(modtypes);
            }

            /*
            // マウスアップで、spanの操作をバインド
            $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                'table.annotation tr td div, ' +
                'table.newAnnotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, form, #load_dialog, #load_btn, :button, :text, :input')
            $('#doc_area').live('mouseup', doMouseup);

            // 選択解除イベントをバインド
            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, " +
                "table.newAnnotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);
            */


            //relation list部分をクリックで選択する
            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);


            $('table.annotation tr td, table.annotation tr td div').live('click', selectAnnotationTable);
            // annotation listのedit部分にfocusされた場合に選択状態にします。
            addEditableToTable();
            $('.editable').die('focus', focusEditTable);
            $('.editable').live('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').die('click', selectInstanceTable);
            $('table.instance tr td, table.instance tr td div').live('click', selectInstanceTable);

            $('table.modification tr td, table.modification tr td div').die('click', selectModificationTable);
            $('table.modification tr td, table.modification tr td div').live('click', selectModificationTable);


            $('#doc_area span').die('click', clickSpan);
            $('#doc_area span').live('click', clickSpan);

            $('div.instance').die('click', selectInstance);
            $('div.instance').live('click', selectInstance);

            //テキスト部分でドラッグ後マウスアップ
            $('#doc_area').die('mouseup',  doMouseup);
            $('#doc_area').live('mouseup',  doMouseup);


            // sourceElem とtargetElemの選択解除をアンバインド
            $("*:not(#doc_area span, #ins_area div)").die("click", cancelSelectSourceAndTargetElement);

            // インスタンス上のmodificationを選択可能にする
            $('span.instance_modification').die('click', selectInsModification);
            $('span.instance_modification').live('click', selectInsModification);



        } else if(mode == 'relation') {

            $('#doc_area').removeAttr('style');
            $('#ins_area').removeAttr('style');


            var bg_color = $('#doc_area').css('backgroundColor');

            if(bg_color.substr(0, 4) != 'rgba') {
                var rgb = bg_color.replace('rgb', '').replace('(', '').replace(')', '');
                var rgba = 'rgba(' + rgb + ',0.5)';
                //console.log(bg_color);
                //console.log(rgba);
            }

            $('#edit_btn').attr("src", 'images/edit_off_btn.png');
            $('#relation_btn').attr("src", 'images/relation_on_btn.png');

            // span編集モードの選択を削除
            selectedIds.splice(0, selectedIds.length);
            $('#doc_area span').removeClass('selected').removeClass('partialSelected');
            $('table.annotation').removeClass('t_selected').removeClass('t_partialSelected');
            $('.removeBtn').hide();

            // マウスアップで、spanの操作を解除
            $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                'table.annotation tr td div, ' +
                'table.newAnnotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, form, #load_dialog, #load_btn, :button, :text, :input')
            $('#doc_area').die('mouseup', doMouseup);

            setCancelSelect();

            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);
            $('table.relation tr td, table.relation tr td div').live('click', selectRelationTable);

            $('table.modification tr td, table.modification tr td div').die('click', selectModificationTable);
            $('table.modification tr td, table.modification tr td div').live('click', selectModificationTable);


            $('.editable').die('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').die('click', selectInstanceTable);

            // sourceElem とtargetElemの選択解除をアンバインド
            //$("*:not(#doc_area span, #ins_area div)").die("click", cancelSelectSourceAndTargetElement);
           // $("*:not(#doc_area span, #ins_area div)").live("click", cancelSelectSourceAndTargetElement);

            $('#doc_area span').die('click', clickSpan);
            $('#doc_area span').live('click', clickSpan);

            $('div.instance').die('click', selectInstance);
            $('div.instance').live('click', selectInstance);

            // インスタンス上のmodificationを選択不可にする
            $('span.instance_modification').die('click', selectInsModification);

            duplicateDocArea();

        }

        sessionStorage.setItem('mode', mode);

    }



    function duplicateDocArea(){
        //var clone = $('#doc_area').clone(true).attr('id', 'doc_area_clone');

        $('#clone_area .clone_div').remove();

        var doc_area_top = $('#doc_area').get(0).offsetTop;
        var doc_area_left = $('#doc_area').get(0).offsetLeft;
        var offset = parseInt($('#doc_area').css('paddingLeft').replace('px', ''));
        var doc_area_width = parseInt($('#doc_area').css('width').replace('px', ''));

        //console.log('offset:', offset);
        //console.log('doc_area_left :', doc_area_left );
        var offset_right = parseInt($('#doc_area').css('paddingRight').replace('px', ''));

        //console.log('offset_right:', offset_right);
        //console.log('doc_area_width:', doc_area_width);

        var doc_area_right =  doc_area_width - offset_right;

        //console.log('doc_area_right:', doc_area_right);
        // 行高さ
        var lineHeight = parseInt($('#doc_area').css('lineHeight'));

        //$('#document_area').append(clone);
        //console.log('lineHeight:', lineHeight);

        var cloneArray = new Array();

        for(var i in annotationJson) {
            var anno = annotationJson[i];
            //console.log('left:', anno['left']);

            var width = $('#' + anno['id']).outerWidth();
            var height = $('#' + anno['id']).outerHeight();


            if(anno['id'] == "T63") {
                //console.log(anno);
                //console.log('height:', height);
            }


            if(height > lineHeight) {
                // 行数
                var lineNum = Math.ceil(height/lineHeight);
                for(var j = 0; j < lineNum; j++) {

                    var w = doc_area_right - anno['left'];

                    var obj = new Object();

                    if(j == 0) {
                        //console.log('anno["top"]:', anno['top']);
                        //console.log('1行め');

                        obj["id"] = "clone_" + anno["id"] + "_" + j;
                        obj["left"] = anno["left"];
                        obj["top"] = anno["top"];
                        obj["width"] = w;
                        obj["height"] = baseSpanHeight;
                        obj["title"] = anno["category"];
                        cloneArray.push(obj);

                    } else if(j == lineNum -1) {
                        //console.log('最終行です');
                        var top = anno['top'] + j * lineHeight;
                        var left = offset;

                        obj["id"] = "clone_" + anno["id"] + "_" + j;
                        obj["left"] = offset;
                        obj["top"] = top;
                        obj["width"] = anno['x'];
                        obj["height"] = baseSpanHeight;
                        obj["title"] = anno["category"];
                        cloneArray.push(obj);

                    } else if(j > 0 && j < lineNum -1){
                        //console.log('2行め以降です');
                        var top = anno['top'] + j * lineHeight;
                        var left = offset;

                        obj["id"] = "clone_" + anno["id"] + "_" + j;
                        obj["left"] = left;
                        obj["top"] = top;
                        obj["width"] = doc_area_right;
                        obj["height"] = baseSpanHeight;
                        obj["title"] = anno["category"];
                        cloneArray.push(obj);

                    }

                }
            } else {

                obj = new Object();
                obj["id"] = "clone_" + anno["id"];
                obj["left"] = anno["left"];
                obj["top"] = anno["top"];
                obj["width"] = width;
                obj["height"] = height;
                obj["title"] = anno["category"];
                cloneArray.push(obj);


            }

        }

        // 大きいDIVが下にくるようにソート
        sortCloneByWidth(cloneArray);

        for(var i in cloneArray) {

            var obj = cloneArray[i];

            var div = '<div id="' + obj['id'] + '" class="clone_div" ' +
                'style="position:absolute;left:' + obj['left'] + 'px;top:' + obj['top']  + 'px;' +
                'width:' + obj["width"] +'px;height:' + obj["height"] +'px;background-color:red; opacity:0" class="clone_div" title="' + obj['title'] + '"></div>';

            $('#clone_area').append(div);
        }




        // instanceのclone

        var instances = $('#ins_area div');
        instances.map(function() {
            //console.log($(this));
            var clone_id = 'clone_' + $(this).attr('id');
            var clone_ins = $(this).clone(true).attr('id', clone_id).css('backgroundColor', 'blue').css('opacity', "0").empty();
            $('#clone_area').append(clone_ins);

        })


        $('.clone_div').click(clickSpan);

        /*
        $('span',clone).map(function() {
            //console.log($(this));

               $(this).attr('id', $(this).attr('id') + '_d');

        });


        $('#document_area').append(clone);



        $('#doc_area_clone').click(function() {
            console.log("click clone");

        });
        $('#doc_area_clone span').click(function() {
            console.log($(this).attr('id'));
        });
        */
    }

    /*
     * 複製を幅でソート
     */
    function sortCloneByWidth(ary) {
        function compare(a, b) {
            return(b['width'] - a['width']);
        }
        ary.sort(compare);
    }

    /*
     * 16進数からrgbaへの色変換
     */
    function colorTrans(color) {
        var c = color.slice(1);
        var r = c.substr(0,2);
        var g = c.substr(2,2);
        var b = c.substr(4,2);
         //console.log("color:", r,":", g, ":", b);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);

        return 'rgba(' + r + ',' +  g + ',' + b + ', ' + connOpacity + ')';

    }


    /*
     * subject, objectが削除された場合の
     * コネクションの再描画
     */
    function reMakeConnectionOnDelete() {
        jsPlumb.reset();
        for(var i in connArray) {
            var conn = connArray[i];
            var sId = conn['subject'];
            var tId = conn['object'];
            var connId = conn['id'];
            var type = conn['type'];


            var color;
            for(var k in relations) {
                if(relations[k].split('|')[0] == conn['type']) {
                    color = relations[k].split('|')[2];
                }
            }

            var rgba = colorTrans(color);

            makeConnection2(sId, tId, type, rgba, connId, "unselected", modanns);

        }


        var conns = getConnectionData();

        for(var i in conns) {
            var conn = conns[i];
            var source = $('#' + conn.subject);
            var target = $('#' + conn.object);
            var rgba = conn.paintStyle;
            var type = conn.type;
            var endpoints = conn.endpoints;
            var id = conn.id;

            for(var j in tmpHidedConnArray) {
                var hideConn = tmpHidedConnArray[j];

                if(id == hideConn['id']) {
                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                }

            }


        }


    }


    /*
     * spanやinstanceの位置が変更になったときの
     * コネクションの再描画
     */
    function reMakeConnection() {

        var conns = getConnectionData();

        for(var i in conns) {
            var conn = conns[i];
            var source = $('#' + conn.subject);
            var target = $('#' + conn.object);
            var rgba = conn.paintStyle;
            var type = conn.type;
            var endpoints = conn.endpoints;
            var id = conn.id;

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);



            var rgbas = rgba.split(',');


            var isDrawSelected = false;

            for(var j in selectedConns) {


                if(selectedConns[j].getParameter("connId") == id) {

                    rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';
                    makeConnection2(conn.subject, conn.object, type, rgba, id, "selected", modanns);
                    isDrawSelected = true;
                }

            }

            // 選択状態で書かれていなければ、書きます
            if(!isDrawSelected) {
                rgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',' + connOpacity +  ')';
                makeConnection2(conn.subject, conn.object, type, rgba, id, "unselected", modanns);
            }


            //makeConnection(source, target, type, rgba, id);

            //makeConnection(conn.subject, conn.object, type, rgba, id, "unselected", labelText, modId, "");

            //selectedConns.push(c);

        }

        //console.log('---remakeConnection-----selectedConns.length:',selectedConns.length);
    }


    function reMakeConnectionByConnArray() {
        var conns = getConnectionData();


        for(var j in conns) {
            var conn = conns[j];
            var source = $('#' + conn.subject);
            var target = $('#' + conn.object);
            var rgba = conn.paintStyle;
            var type = conn.type;
            var endpoints = conn.endpoints;
            var id = conn.id;

            var labelText = "";
            var modId = "";
            for(var i = 0; i < conn.overlays.length; i++) {
                var overlay = conn.overlays[i];
                //console.log('label:', overlay["type"]);

                if(overlay["type"] == "Label") {
                    //console.log(overlay.getLabel());
                    labelText = overlay.getLabel();
                    modId = overlay["id"];
                }
            }

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);

            //makeConnection(source, target, type, rgba, id);

            //makeConnection(conn.subject, conn.object, type, rgba, id, "unselected", labelText, modId, "");

            makeConnection2(conn.subject, conn.object, type, rgba, id, "unselected", modanns);

            //selectedConns.push(c);

        }
    }


    /*
     * コネクションの作成
     * source, target, relation, rgba, connId, flag
     */
    /*
    function makeConnection(sourceId, targetId, type, rgba, connId, flag, labelText, modId, modStyle) {

        //console.log('make connection');
        //console.log('rgba:', rgba);
        //console.log('sourceId:', sourceId);
        //console.log('targetId:', targetId);


        var sourceElem;
        var targetElem;
        // sourceElem と targetElemの取得
        // sourceIdがTから始まっている場合はspan要素
        // それ以外はインスタンス



        sourceElem = $('#' + sourceId);
        targetElem = $('#' + targetId);

        //console.log('targetElem:',targetElem);




        var padding_left = parseInt($('#doc_area').css('padding-left'));
        var padding_top = parseInt($('#doc_area').css('padding-top'));

       // console.log('doc_area　トップ:', $('#doc_area').get(0).offsetTop);
        var doc_area_top = $('#doc_area').get(0).offsetTop;
        var doc_area_left = $('#doc_area').get(0).offsetLeft;

        //var source_id = sourceElem.attr('id');
        //var target_id = targetElem.attr('id');

        var sourceX, sourceY;
        var targetX, targetY;

        if(sourceId.substr(0,1) == "T") {
            // span要素
            sourceX = sourceElem.get(0).offsetLeft - padding_left;
            sourceY = sourceElem.get(0).offsetTop - padding_top;
        } else {
            sourceX = sourceElem.get(0).offsetLeft - doc_area_left;
            sourceY = sourceElem.get(0).offsetTop - doc_area_top;
        }

        if(targetId.substr(0,1) == "T") {
            // span要素
            targetX = targetElem.get(0).offsetLeft - padding_left;
            targetY = targetElem.get(0).offsetTop - padding_top;
        } else {
            targetX = targetElem.get(0).offsetLeft - doc_area_left;
            targetY = targetElem.get(0).offsetTop - doc_area_top;
        }



        // dunnySpanから計算されたspanの右上の位置
        var sourceRX;
        var sourceRY;

        var targetRX;
        var targetRY;

        for(i in annotationJson) {
            var anno = annotationJson[i];
            if(anno["id"] == sourceId) {
                sourceRX = anno["x"];
                sourceRY = anno["y"];
            }
            if(anno["id"] == targetId) {
                targetRX = anno["x"];
                targetRY = anno["y"];
            }
        }

        var sourceWidth = sourceElem.outerWidth();
        var sourceHeight = sourceElem.outerHeight();
        var targetWidth = targetElem.outerWidth();
        var targetHeight = targetElem.outerHeight();


        //console.log('位置:', sourceX, ":", sourceY, ":", sourceWidth, ":", sourceHeight);

        var sourceRealWidth = $('#m_' + sourceId).outerWidth();
        var sourceRealHeight = $('#m_' + sourceId).outerHeight();

        // 行数
        var sourceLineNum = Math.floor(sourceHeight / sourceRealHeight);

        // 行高さ
        var lineHeight = parseInt($('#doc_area').css('lineHeight'));

        var curviness = 16;//べじぇ曲線の曲率
        var sourceAnchors;
        var targetAnchors;

        if(sourceHeight > lineHeight) {
            // sourceが2行以上

            if(targetHeight > lineHeight) {
                // source, targetともに2行以上
                //console.log('source, targetは2行以上です。');

                //console.log('sourceRX:', sourceRX);
                //console.log('targetY:', targetY);

                if(sourceRY <= targetY) {
                    //console.log('targetX:', targetX);
                    //console.log('sourceRX:', sourceRX);
                    //console.log('sourceが完全に上方にある');
                    //
                    // この場合は、sourceの下部とtargetの上部
                    // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                    sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];
                    targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0], [0, 0.5, -1, 0, targetX, -(targetHeight - lineHeight)/2]];

                } else if((sourceY < targetY) && (sourceRX < targetY)){
                    // sourceがtargetより上方にあるが、重なっている
                    sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX)/2, 0]];
                    targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0], [1, 0.5, -1, targetX/2, 0]];

                } else if((sourceY > targetY) && (sourceRY < targetRY)) {
                    // sourceがtargetより上方にあるが、重なっている
                    sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, sourceRX/2, 0]];
                    targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0], [1, 0.5, -1, -(targetWidth - targetRX)/2, 0]];

                } else {
                    // sourceが完全に下
                    // この場合は、sourceの上部とtargetの下部
                    // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                    sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, sourceRX/2, 0]];
                    targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0], [1, 0.5, -1, -(targetWidth - targetRX)/2, 0]];
                }

            } else {
                // sourceだけ2行以上
                //console.log(sourceElem, ':sourceは2行、targetは1行です。');
                targetAnchors = "AutoDefault";


                //console.log('sourceY:', sourceY);
                //console.log('sourceRY:', sourceRY);
                //console.log('targetY:', targetY);
                //console.log('targetRY:', targetRY);


                if(sourceY <= targetY) {
                    // sourceがtargetの上方
                    //console.log('sourceがtargetの上方');
                    sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];

                } else if(sourceY > targetY && sourceY < targetRY) {
                    //console.log('sourceがtargetの中にある');
                    // sourceがtargetの中にある
                    sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];
                } else {
                    //console.log('sourceがtargetの下方');
                    // sourceがtargetの下方
                    sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];
                }
            }

        } else {
            // sourceが1行
            if(targetHeight > lineHeight) {
                // targetだけ2行以上
                //console.log('targetは2行以上です。');
                sourceAnchors = "AutoDefault";

                if(sourceY <= targetY) {
                    // sourceがtargetの上方
                    //console.log('sourceがtargetの上方');
                    // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                    targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0], [0, 0.5, -1, 0, targetX, -(targetHeight - lineHeight)/2]];

                } else if(sourceY > targetY && sourceY < targetRY) {
                    //console.log('sourceがtargetの中にある');
                    // sourceがtargetの中にある
                    targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0], [1, 0.5, 1, 0, -(targetWidth - targetRX), (targetHeight - lineHeight)/2]];
                } else {
                    //console.log('sourceがtargetの下方');
                    // sourceがtargetの下方
                    targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0], [1, 0.5, 1, 0, -(targetWidth - targetRX), (targetHeight - lineHeight)/2]];
                }

            } else {
                // source, targetともに1行
                //console.log('targetは1行です。');

                if(sourceY == targetY ) {
                    // 同じ行にある場合
                    if(targetX - sourceRX < 50 ) {
                        sourceAnchors = ["TopCenter", "BottomCenter"];
                        targetAnchors = ["TopCenter", "BottomCenter"];
                    } else if(sourceX - targetRX < 50) {
                        sourceAnchors = ["TopCenter", "BottomCenter"];
                        targetAnchors = ["TopCenter", "BottomCenter"];
                    }

                } else {
                    // 同じ行にはない
                    //console.log('同じ行にはない');
                    if(sourceY + lineHeight <= targetY) {
                        // 上下に近い場合
                        sourceAnchors = ["RightMiddle", "LeftMiddle"];
                        targetAnchors = ["RightMiddle", "LeftMiddle"];
                    } else if(targetY + lineHeight <= sourceY) {
                        sourceAnchors = ["RightMiddle", "LeftMiddle"];
                        targetAnchors = ["RightMiddle", "LeftMiddle"];
                    } else {
                        sourceAnchors = "AutoDefault";
                        targetAnchors = "AutoDefault";
                    }
                }
            }
        }

        //console.log('sourceAnchors:', sourceAnchors);

        if(sourceId == targetId) {
            //console.log('自己参照');
            curviness = 50;
            if(sourceHeight > lineHeight) {
                // source,targetとも2行以上
                sourceAnchors = [0.5, 0, -1, -1, sourceX/2, 0];
                targetAnchors = [0.5, 0, 1, -1,  targetX/2, 0];
            } else {
                // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフ
                sourceAnchors = [0.5, 0, -1, -1];
                targetAnchors = [0.5, 0, 1, -1];
            }

        }




        if((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T") ) {
            // 両方がspan

        } else {
            // どちらかがインスタンス
            if(targetId.substr(0,1) == "T") {
                // targetがspan, sourceがインスタンス


                if(targetY < sourceY) {
                    // targetが上方にある場合
                    curviness = 16;
                    sourceAnchors = ["TopCenter"];
                    targetAnchors = ["BottomCenter"];
                } else {
                    curviness = 24;
                    sourceAnchors = ["TopCenter"];
                    targetAnchors = ["TopCenter"];
                }


            } else if(sourceId.substr(0,1) == "T") {
                // targetがインスタンス、sourceがspan

                //console.log(sourceId, ':sourceY:', sourceY);
                //console.log(targetId, ':targetY:', targetY);
                //console.log('-----');


                if(sourceY < targetY) {
                    // sourceが上方にある場合
                    curviness = 16;
                    sourceAnchors = ["BottomCenter"];
                    targetAnchors = ["TopCenter"];
                } else {
                    curviness = 24;
                    sourceAnchors = ["TopCenter"];
                    targetAnchors = ["TopCenter"];
                }

            } else {
                // 両方がspan
                curviness = 24;
                sourceAnchors = ["TopCenter"];
                targetAnchors = ["TopCenter"];
            }
        }

        //console.log('コネクションrgba:', rgba);

        jsPlumb.makeSource(sourceElem, {
            anchor:sourceAnchors,
            paintStyle:{ fillStyle:rgba, radius:3 }
        });

        jsPlumb.makeTarget(targetElem, {
            anchor:targetAnchors,
            paintStyle:{ fillStyle:rgba, radius:3 }
        });

        var lineWidth = 2;
        if(flag == "selected") {
            lineWidth = 4;
        }








        //console.log('labelText:', labelText);

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            connector:[ "Bezier", { curviness:curviness }],
            detachable:false,
           // paintStyle:{ lineWidth:10, strokeStyle:'rgba(0, 0, 200, 0.5)'},
            paintStyle:{ lineWidth:lineWidth, strokeStyle:rgba },
            hoverPaintStyle:{lineWidth:5 },
            overlays:  [
                        ["Arrow", { width:12, length:12, location:0.95, id:"arrow",  direction:1 }],
                        ["Label", { label:labelText, id:modId, cssClass:modStyle, location:0.5, events:{click:function(labelOverlay, originalEvent) {
                            if(mode == "edit") {
                                console.log("click on label overlay for :", labelOverlay);
                                console.log('modId', labelOverlay["id"]);
                                originalEvent.stopPropagation();


                                if(isCtrl) {

                                } else {
                                    // 一旦、modificationの選択を削除
                                    unselectModification();
                                }

                                //labelOverlay["cssClass"] = "mod_selected";
                                //jsPlumb.repaintEverything();

                                var conns = getConnectionData();
                                for(var i = 0; i < conns.length; i++) {
                                    if(conns[i]["id"] == connId) {
                                        //console.log("これ", conns[i]);

                                        var endpoints = conns[i]["endpoints"];

                                        // 一旦削除して、再描画
                                        jsPlumb.deleteEndpoint(endpoints[0]);
                                        jsPlumb.deleteEndpoint(endpoints[1]);
                                        var c = makeConnection(sourceElem.attr('id'), targetElem.attr('id'), type, rgba, connId, "selected", labelText, modId, "mod_selected");


                                    }
                                }

                                // 該当するテーブルを選択状態にする

                                $('#modification_t_' + modId).addClass('t_selected');
                                selectedModificationIds.push(modId);

                            }

                        }}}]
                        ],
            parameters:{connId:connId, type:type}
        });




        jsPlumb.unmakeSource(conn.sourceId).unmakeTarget(conn.targetId);


        // 選択
        conn.bind("click", function(conn, e) {
            //console.log('リレーションモード:', isRelationMode);

            if(mode == "relation") {


                // 一旦削除して、新たに太い線をかく
                e.stopPropagation();

                if(isCtrl) {
                    var source = conn.source;
                    var target = conn.target;
                    var rgba = conn.paintStyleInUse["strokeStyle"];
                    var endpoints = conn.endpoints;
                    var connId = conn.getParameter('connId');
                    var type = conn.getParameter('type');

                    var labelText = "";
                    var modId = "";
                    for(var i = 0; i < conn.overlays.length; i++) {
                        var overlay = conn.overlays[i];
                        console.log('label:', overlay["type"]);

                        if(overlay["type"] == "Label") {
                            console.log(overlay.getLabel());
                            labelText = overlay.getLabel();
                            modId = overlay["id"];
                        }
                    }


                    //console.log('選択されたコネクションID:', connId);

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var c = makeConnection(subject, object, type, rgba, connId, "selected", labelText, modId, "");

                    selectedConns.push(c);

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                    // テーブルを選択状態にする
                    $('#relation_t_' + connId).addClass('t_selected');
                    // remove_btnを表示
                    $('.relation.t_selected .removeBtn').show();
                    //console.log('削除ボタン:', $('.relation.t_selected .removeBtn'));

                } else {
                    console.log('選択されました');
                    // 一旦、選択されていたconnectionを再描画する
                    //console.log('選択されているconnection数:',selectedConns.length);


                    // 空にする
                    selectedConns.splice(0, selectedConns.length);

                    var source = conn.source;
                    var target = conn.target;
                    var rgba = conn.paintStyleInUse["strokeStyle"];
                    var endpoints = conn.endpoints;
                    var connId = conn.getParameter('connId');
                    var type = conn.getParameter('type');

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var labelText = "";
                    var modId = "";
                    for(var i = 0; i < conn.overlays.length; i++) {
                        var overlay = conn.overlays[i];
                        //console.log('label:', overlay["type"]);

                        if(overlay["type"] == "Label") {
                           // console.log(overlay.getLabel());
                            labelText = overlay.getLabel();
                            modId = overlay["id"];
                        }
                    }


                    var c = makeConnection(subject, object, type, rgba, connId, "selected", labelText, modId, "");

                    //console.log(c);

                    selectedConns.push(c);

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                    // テーブルを選択状態にする
                    $('.relation').removeClass('t_selected');
                    $('.relation .removeBtn').hide();

                    $('#relation_t_' + connId).addClass('t_selected');
                    // remove_btnを表示

                    $('.relation.t_selected .removeBtn').show();

                }
            }
            return false;
        });




        //console.log('作成されたconnection id:', conn.getParameter("connId"), conn.getParameter("type"));


        return conn;

    //}

    }
    */




    /*
     * コネクションの作成
     * source, target, relation, rgba, connId, flag
     */
    function makeConnection2(sourceId, targetId, type, rgba, connId, flag, modanns) {
        //console.log('connId:', connId);
        //if(connId == "R15") {

        //console.log('make connection');
        //console.log('rgba:', rgba);
        //console.log('sourceId:', sourceId);
        //console.log('targetId:', targetId);


        var sourceElem;
        var targetElem;
        // sourceElem と targetElemの取得
        // sourceIdがTから始まっている場合はspan要素
        // それ以外はインスタンス

        /*
         if(sourceId.substr(0,1) == "T") {
         // span要素
         sourceElem = $('#' + sourceId);
         } else {
         sourceElem = $('#'  + sourceId);
         }


         if(targetId.substr(0,1) == "T") {
         targetElem = $('#' + targetId);
         } else {
         targetElem = $('#' + targetId);
         }
         */

        sourceElem = $('#' + sourceId);
        targetElem = $('#' + targetId);

        //console.log('targetElem:',targetElem);

        /*
         if(sourceElem == undefined && targetElem == undefined) {
         // 両方がインスタンス

         } else if(sourceElem == undefined) {
         // sourceがインスタンス

         } else if(targetElem == undefined) {
         // targetがインスタンス

         } else {
         // 両方がspan

         }
         */





        var padding_left = parseInt($('#doc_area').css('padding-left'));
        var padding_top = parseInt($('#doc_area').css('padding-top'));

        // console.log('doc_area　トップ:', $('#doc_area').get(0).offsetTop);
        var doc_area_top = $('#doc_area').get(0).offsetTop;
        var doc_area_left = $('#doc_area').get(0).offsetLeft;

        //var source_id = sourceElem.attr('id');
        //var target_id = targetElem.attr('id');

        var sourceX, sourceY;
        var targetX, targetY;

        if(sourceId.substr(0,1) == "T") {
            // span要素
            sourceX = sourceElem.get(0).offsetLeft - padding_left;
            sourceY = sourceElem.get(0).offsetTop - padding_top;
        } else {
            sourceX = sourceElem.get(0).offsetLeft - doc_area_left;
            sourceY = sourceElem.get(0).offsetTop - doc_area_top;
        }

        if(targetId.substr(0,1) == "T") {
            // span要素
            targetX = targetElem.get(0).offsetLeft - padding_left;
            targetY = targetElem.get(0).offsetTop - padding_top;
        } else {
            targetX = targetElem.get(0).offsetLeft - doc_area_left;
            targetY = targetElem.get(0).offsetTop - doc_area_top;
        }



        // dunnySpanから計算されたspanの右上の位置
        var sourceRX;
        var sourceRY;

        var targetRX;
        var targetRY;

        for(i in annotationJson) {
            var anno = annotationJson[i];
            if(anno["id"] == sourceId) {
                sourceRX = anno["x"];
                sourceRY = anno["y"];
            }
            if(anno["id"] == targetId) {
                targetRX = anno["x"];
                targetRY = anno["y"];
            }
        }

        var sourceWidth = sourceElem.outerWidth();
        var sourceHeight = sourceElem.outerHeight();
        var targetWidth = targetElem.outerWidth();
        var targetHeight = targetElem.outerHeight();


        //console.log('位置:', sourceX, ":", sourceY, ":", sourceWidth, ":", sourceHeight);

        var sourceRealWidth = $('#m_' + sourceId).outerWidth();
        var sourceRealHeight = $('#m_' + sourceId).outerHeight();

        // 行数
        var sourceLineNum = Math.floor(sourceHeight / sourceRealHeight);

        // 行高さ
        var lineHeight = parseInt($('#doc_area').css('lineHeight'));

        var curviness = 16;//べじぇ曲線の曲率
        var sourceAnchors;
        var targetAnchors;

        if(sourceHeight > lineHeight) {
            // sourceが2行以上

            if(targetHeight > lineHeight) {
                 // source, targetともに2行以上
                //console.log('source, targetは2行以上です。');
                if(targetY == sourceY) {
                    if(hasInstance(sourceId)) {
                        sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                    } else {
                        sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                    }

                    if(hasInstance(targetId)) {
                        targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                    } else {
                        targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                    }


                } else   if(sourceY < targetY) {
                    //console.log('sourceが上');
                    // targetのアンカーは常に上
                    targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                    if(sourceY + (3 * lineHeight) < targetY) {

                        //console.log('sourceがかなり上');

                        sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0]];


                    } else {
                        //console.log('sourceがすこし上');
                        if(hasInstance(sourceId)) {
                            sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                        } else {
                            sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                        }

                    }


                } else {
                    //console.log('targetが上');
                    // sourceのアンカーは常に上
                    sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                    if(targetY + (3 * lineHeight) < sourceY) {
                        //console.log('targetがかなり上');
                        targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0]];
                    } else {
                        //console.log('targetが少し上');
                        if(hasInstance(targetId)) {
                            targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                        } else {
                            targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                        }

                    }

                }


            } else {
                // sourceだけ2行以上
                //console.log(sourceElem, ':sourceは2行、targetは1行です。');
               // targetAnchors = "AutoDefault";
                targetAnchors = ["TopCenter", "BottomCenter"];

                //
                if(sourceY < targetY && targetY < sourceRY) {
                    //console.log(connId, 'sourceがtargetの中にある');
                    // targetがsourceの中にある
                    if(hasInstance(sourceId)) {
                        sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                    } else {
                        sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                    }

                    if(hasInstance(targetId)) {
                        targetAnchors = ["BottomCenter"];
                    } else {
                        targetAnchors = ["TopCenter"];
                    }


                } else {
                    if(sourceY <= targetY) {
                        // sourceがtargetの上方

                        // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                        //sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0]];

                        if(sourceY + (2 * lineHeight) < targetY) {
                            //console.log('2行以上上方');
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0]];
                        } else {
                            //console.log('2行以下上方');
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            if(hasInstance(sourceId)) {
                                sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                            } else {
                                sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                            }

                        }
                        //console.log('-----1');

                    } else {
                        //targetが上方
                        //console.log(connId, '-----targetが上');
                        if(targetY + (2 * lineHeight) < sourceY) {
                            //console.log('targetがかなり上');

                            if(hasInstance(sourceId)) {
                                sourceAnchors = [[ 0.5, 0, 1, 1, sourceX/2, 0]];
                            } else {
                                sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                            }

                            targetAnchors = ["BottomCenter"];
                        } else {
                            //console.log('targetが少し上');
                            // sourceがtargetの下方
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            //sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];


                            if(hasInstance(sourceId)) {
                                sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                            } else {
                                sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                            }

                            if(hasInstance(targetId)) {
                                targetAnchors = ["BottomCenter"];
                            } else {
                                targetAnchors = ["TopCenter"];
                            }

                            //console.log('-----3');

                        }


                    }
                }


            }

        } else {
            // sourceが1行
            if(targetHeight > lineHeight) {

                //console.log('targetだけ2行以上');
                //console.log('targetは2行以上です。');
                //sourceAnchors = "AutoDefault";
                sourceAnchors = ["TopCenter", "BottomCenter"];

                if(sourceY > targetY && sourceY < targetRY) {
                    //console.log('sourceがtargetの中にある');
                    // sourceがtargetの中にある

                    if(hasInstance(sourceId)) {
                        sourceAnchors = ["BottomCenter"];
                    } else {
                        sourceAnchors = ["TopCenter"];
                    }

                    if(hasInstance(targetId)) {
                        targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                    } else {
                        targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                    }

                } else {
                    if(sourceY <= targetY) {
                        //console.log('sourceが上方');
                        //console.log('sourceがtargetの上方');
                        if(sourceY + (3 * lineHeight) < targetY) {
                            //console.log('sourceがかなり上');
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            sourceAnchors = ["BottomCenter"];

                            if(hasInstance(targetId)) {
                                targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                            } else {
                                targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                            }

                        } else {
                            //console.log('sourceが少し上');
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット

                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            if(hasInstance(targetId)) {
                                targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                            } else {
                                targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                            }

                        }


                    }  else {
                        //console.log('sourceが下方');
                        if(targetY + (3 * lineHeight) < sourceY) {

                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0]];
                        } else {

                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            if(hasInstance(targetId)) {
                                targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                            } else {
                                targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                            }

                        }
                        // sourceがtargetの下方
                        //targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0], [1, 0.5, 1, 0, -(targetWidth - targetRX), (targetHeight - lineHeight)/2]];

                    }
                }



            } else {
                //console.log('source, targetともに1行')

                if(sourceY == targetY ) {
                    // 同じ行にある場合
                    if(targetX - sourceRX < 50 ) {

                        if(hasInstance(sourceId)) {
                            sourceAnchors = ["BottomCenter"];
                        } else {
                            sourceAnchors = ["TopCenter", "BottomCenter"];
                        }

                        if(hasInstance(targetId)) {
                            targetAnchors = ["BottomCenter"];
                        } else {
                            targetAnchors = ["TopCenter", "BottomCenter"];
                        }

                    } else if(sourceX - targetRX < 50) {
                        if(hasInstance(sourceId)) {
                            sourceAnchors = ["BottomCenter"];
                        } else {
                            sourceAnchors = ["TopCenter", "BottomCenter"];
                        }

                        if(hasInstance(targetId)) {
                            targetAnchors = ["BottomCenter"];
                        } else {
                            targetAnchors = ["TopCenter", "BottomCenter"];
                        }

                    }

                } else {
                    // 同じ行にはない
                    //console.log('同じ行にはない');
                    sourceAnchors = ["TopCenter", "BottomCenter"];
                    targetAnchors = ["TopCenter", "BottomCenter"];

                    if(sourceY < targetY) {
                        if(sourceY + (2 * lineHeight) < targetY) {

                            sourceAnchors = ["BottomCenter"];

                            if(hasInstance(targetId)) {
                                targetAnchors = ["BottomCenter"];
                            } else {
                                targetAnchors = ["TopCenter"];
                            }

                        } else {
                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            if(hasInstance(targetId)) {
                                targetAnchors = ["BottomCenter"];
                            } else {
                                targetAnchors = ["TopCenter"];
                            }

                        }


                    } else {
                        if(targetY + (2 * lineHeight) < sourceY) {
                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            targetAnchors = ["BottomCenter"];
                        } else {
                            // 上下に近い場合
                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                            if(hasInstance(targetId)) {
                                targetAnchors = ["BottomCenter"];
                            } else {
                                targetAnchors = ["TopCenter"];
                            }

                        }


                    }
                }
            }
        }

        //console.log('sourceAnchors:', sourceAnchors);

        if(sourceId == targetId) {
            //console.log('自己参照');
            curviness = 50;
            if(sourceHeight > lineHeight) {
                // source,targetとも2行以上
                if(hasInstance(sourceId) || hasInstance(targetId)) {
                    sourceAnchors = [0.5, 1, -1, 1, sourceX/2, 0];
                    targetAnchors = [0.5, 1, 1, 1,  targetX/2, 0];
                } else {
                    sourceAnchors = [0.5, 0, -1, -1, sourceX/2, 0];
                    targetAnchors = [0.5, 0, 1, -1,  targetX/2, 0];
                }

            } else {
                // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフ
                if(hasInstance(sourceId) || hasInstance(targetId)) {
                    sourceAnchors = [0.5, 1, -1, 1];
                    targetAnchors = [0.5, 1, 1, 1];
                } else {
                    sourceAnchors = [0.5, 0, -1, -1];
                    targetAnchors = [0.5, 0, 1, -1];
                }

            }

        }

        /*
         if(sourceId.substr(0,1) == "T") {
         // span要素
         } else {
         // instance
         curviness = 32;
         sourceAnchors = ["TopCenter"];
         //sourceAnchors = [[ 0.5, 0, 0, -1]];
         }

         if(targetId.substr(0,1) == "T") {
         // span要素
         } else {
         // instance
         curviness = 32;
         targetAnchors = ["TopCenter"];
         //targetAnchors = [[ 0.5, 0, 0, -1]];
         }
         */

        // 中央の値
        var source_center;
        var target_center;

        // curvinessの掛け率
        var rate = 0.15;
        // curvinessのオフセット
        var c_offset = 16;

        if((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T") ) {
            // 両方がspan
            source_center = sourceX + (sourceRX - sourceX)/2;
            target_center = targetX + (targetRX - targetX)/2;

            curviness = Math.abs((source_center - target_center)) * rate + c_offset;

        } else {
            // どちらかがインスタンス
            //console.log('どちらかがインスタンス')

            if((sourceId.substr(0,1) != "T") && (targetId.substr(0,1) != "T")) {
                //console.log('両方がinstance');
                curviness = 24;

                if(hasInstance(sourceId)) {
                    sourceAnchors = ["BottomCenter"];
                } else {
                    sourceAnchors = ["TopCenter"];
                }

                if(hasInstance(targetId)) {
                    targetAnchors = ["BottomCenter"];
                } else {
                    targetAnchors = ["TopCenter"];
                }


                source_center = (sourceX + 10/2); // 10はinstanceの幅
                target_center = (targetX + 10/2); // 10はinstanceの幅

                curviness = Math.abs((source_center - target_center)) * rate + c_offset;


            } else {
                if(sourceId.substr(0,1) != "T") {
                    //console.log('targetがspan, sourceがインスタンス');

                    sourceAnchors = ["TopCenter"];


                    if(targetHeight < lineHeight) {
                        // targetが1行
                        if(targetY < sourceY) {
                            // targetが上にある
                            if(targetY + (3 * lineHeight) < sourceY) {
                                // targetが上方にある場合
                                curviness = 16;
                                targetAnchors = ["BottomCenter"];
                            } else {
                                curviness = 24;

                                if(hasInstance(targetId)) {
                                    targetAnchors = ["BottomCenter"];
                                } else {
                                    targetAnchors = ["TopCenter"];
                                }

                            }

                        } else {
                            // targetが下にある
                            if(sourceY + (3 * lineHeight) < targetY) {
                                if(hasInstance(targetId)) {
                                    targetAnchors = ["BottomCenter"];
                                } else {
                                    targetAnchors = ["TopCenter"];
                                }

                            } else {
                                if(hasInstance(targetId)) {
                                    targetAnchors = ["BottomCenter"];
                                } else {
                                    targetAnchors = ["TopCenter"];
                                }

                            }

                        }
                    } else {
                        // targetが2行以上
                        if(sourceY < targetY && targetY < sourceRY) {
                            //console.log(connId, 'sourceがtargetの中にある');
                            // sourceがtargetの中にある

                            targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0]];
                        } else {
                            if(sourceY <= targetY) {
                                // sourceが上方

                                if(sourceY + (2 * lineHeight) < targetY) {
                                    //console.log('2行以上上方');
                                    // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                                    if(hasInstance(targetId)) {
                                        targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                                    } else {
                                        targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                                    }

                                } else {
                                    //console.log('2行以下上方');
                                    // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                                    if(hasInstance(targetId)) {
                                        targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                                    } else {
                                        targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                                    }

                                }


                            } else {
                                //targetが上方
                                //console.log(connId, '-----targetが上');
                                if(targetY + (2 * lineHeight) < sourceY) {
                                    //console.log('targetがかなり上');
                                    targetAnchors = [[ 0.5, 1, 0, 1, -(targetWidth - targetRX)/2, 0]];
                                } else {
                                    //console.log('targetが少し上');
                                    // sourceがtargetの下方
                                    if(hasInstance(targetId)) {
                                        targetAnchors = [[ 0.5, 1, 0, 1, targetX/2, 0]];
                                    } else {
                                        targetAnchors = [[ 0.5, 0, 0, -1, targetX/2, 0]];
                                    }



                                }

                            }
                        }


                    }

                    source_center = (sourceX + 10/2); // 10はinstanceの幅
                    target_center = targetX + (targetRX - targetX)/2;

                    curviness = Math.abs((source_center - target_center)) * rate + c_offset;

                } else if(targetId.substr(0,1) != "T") {
                    //console.log('targetがインスタンス、sourceがspan');

                    targetAnchors = ["TopCenter"];

                    // sourceが2行以上の場合
                    if(sourceHeight > lineHeight) {


                        if(sourceY + (3 * lineHeight) <= targetY) {
                            // sourceがtargetの3行以上上方
                            //console.log('---------sourceがtargetの上方');
                            //console.log('sourceY:', sourceY);
                            //console.log('targetY:', targetY);
                            //console.log('targetRY:', targetRY);
                            //console.log('lineHeight:', lineHeight);

                            sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0]];

                        } else if(sourceY > targetY && targetY < sourceRY) {
                            //console.log('sourceがtargetの中にある');
                            // sourceがtargetの中にある
                            sourceAnchors = [[ 0.5, 1, 0, 1, -(sourceWidth - sourceRX)/2, 0]];
                        } else {
                            //console.log('-----sourceがtargetの下方');
                            // sourceがtargetの下方
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            //sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];

                            if(hasInstance(sourceId)) {
                                sourceAnchors = [[ 0.5, 1, 0, 1, sourceX/2, 0]];
                            } else {
                                sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0]];
                            }


                        }
                    } else {
                        if(sourceY + (3 * lineHeight) <= targetRY) {
                            // sourceがtargetの3行以上上方
                            //console.log('---------sourceがtargetの上方');
                            //console.log('sourceY:', sourceY);
                            //console.log('targetY:', targetY);
                            //console.log('targetRY:', targetRY);
                            //console.log('lineHeight:', lineHeight);


                            sourceAnchors = ["BottomCenter"];

                        } else if(sourceY > targetY && sourceY < targetRY) {
                            //console.log('sourceがtargetの中にある');
                            // sourceがtargetの中にある
                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                        } else {
                            //console.log('-----sourceがtargetの下方');
                            // sourceがtargetの下方
                            // x位置, y位置, xカーブ方向, yカーブ方向, xオフセット, yオフセット
                            //sourceAnchors = [[ 0.5, 0, 0, -1, sourceX/2, 0], [1, 0.5, 1, 0, -(sourceWidth - sourceRX), (sourceHeight - lineHeight)/2]];

                            if(hasInstance(sourceId)) {
                                sourceAnchors = ["BottomCenter"];
                            } else {
                                sourceAnchors = ["TopCenter"];
                            }

                        }

                    }


                    source_center = sourceX + (sourceRX - sourceX)/2;
                    target_center = (targetX + 10/2); // 10はinstanceの幅


                    curviness = Math.abs((source_center - target_center)) * rate + c_offset;
                }




                //console.log('curviness:', curviness);

            }
        }

        //console.log('コネクションrgba:', rgba);

        jsPlumb.makeSource(sourceElem, {
            anchor:sourceAnchors,
            paintStyle:{ fillStyle:rgba, radius:3 }
        });

        jsPlumb.makeTarget(targetElem, {
            anchor:targetAnchors,
            paintStyle:{ fillStyle:rgba, radius:3 }
        });

        var lineWidth = 1;
        if(flag == "selected") {
            lineWidth = 2;
        }


        var overlays = new Array();

        // arrowの適用
        var arrowArray = new Array();
        arrowArray.push('Arrow');
        var arrow = {width:12, length:12, location:0.95, id:"arrow",  direction:1 };
        arrowArray.push(arrow);

        overlays.push(arrowArray);


        var i;
        var cnt = 0;

        if(modanns != undefined) {
            for(i = 0; i < modanns.length; i++) {
                var mod = modanns[i];
                var objectId = mod["object"];
                var modId = mod["id"];
                var modType = mod["type"];

                //console.log(modId, ':--objectId--:', objectId, ":", connId);


                if(objectId == connId) {
                    // このリレーションにmodificationがつく
                    //console.log('このリレーションにmodificationがつく');

                    var labelArray = new Array();
                    labelArray.push('Label');

                    var events = {
                        click:function(labelOverlay, originalEvent) {
                            if(mode == "relation") {
                                //console.log("click on label overlay for :", labelOverlay);
                                //console.log('originalEvent:', originalEvent);
                                //console.log('modId', labelOverlay["id"]);

                               // originalEvent.stopPropagation();

                                originalEvent.stopImmediatePropagation();

                                if(isCtrl) {

                                } else {
                                    // 一旦、modificationの選択を削除
                                    unselectModification();
                                }

                                //labelOverlay["cssClass"] = "mod_selected";
                                //jsPlumb.repaintEverything();

                                selectedModificationIds.push(labelOverlay["id"]);

                                var conns = getConnectionData();
                                for(var i = 0; i < conns.length; i++) {
                                    if(conns[i]["id"] == connId) {
                                        //console.log("これ", conns[i]);

                                        var endpoints = conns[i]["endpoints"];

                                        // 一旦削除して、再描画
                                        jsPlumb.deleteEndpoint(endpoints[0]);
                                        jsPlumb.deleteEndpoint(endpoints[1]);
                                        //var c = makeConnection(sourceElem.attr('id'), targetElem.attr('id'), type, rgba, connId, "selected", modanns, "mod_selected");

                                        var c = makeConnection2(sourceElem.attr('id'), targetElem.attr('id'), type, rgba, connId, "unselected", modanns);


                                    }
                                }

                                addModtypeColor(modtypes);
                                // 該当するテーブルを選択状態にする

                                $('#modification_t_' + modId).addClass('t_selected');
                                $('.modification.t_selected .removeBtn').show();



                            }

                        }
                    };


                    var cssClass = "";


                    for(var j in selectedModificationIds) {
                        if(modId == selectedModificationIds[j]) {
                            cssClass = "mod_selected";
                            break;
                        }
                    }



                    if(modType == "Negation") {


                        var obj = {label:'<span class="modification mod_Negation" >X</span>', id:modId,  cssClass:cssClass, location:(cnt * 0.1)+0.5, events:events};
                        labelArray.push(obj);

                    } else if(modType == "Speculation") {

                        var obj = {label:'<span class="modification mod_Speculation" >?</span>', id:modId,  cssClass:cssClass, location:(cnt * 0.1)+0.5, events:events};
                        labelArray.push(obj);
                    }

                    overlays.push(labelArray);

                    cnt++;

                }

            }
        }

        //console.log('labelText:', labelText);
        var rgbas = rgba.split(',');
        var hoverRgba = rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ',1)';



        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            connector:[ "Bezier", { curviness:curviness }],
            detachable:false,
            // paintStyle:{ lineWidth:10, strokeStyle:'rgba(0, 0, 200, 0.5)'},
            paintStyle:{ lineWidth:lineWidth, strokeStyle:rgba },
            hoverPaintStyle:{lineWidth:2,strokeStyle: hoverRgba},
            overlays:overlays,
            tooltip:type,
            cssClass:type,

            parameters:{connId:connId, type:type}
        });




        jsPlumb.unmakeSource(conn.sourceId).unmakeTarget(conn.targetId);


        // 選択
        conn.bind("click", function(conn, e) {
            //console.log('リレーションモード:', isRelationMode);
            //console.log('e:', e);

            if($(e.currentTarget) == "path") {
                //console.log('click path');
            }
            //console.log('e.currentTarget:', $(e.currentTarget));

            if(mode == "relation") {

                // modificationの選択をはずす

                $('table.modification .removeBtn').hide();
                $('table.modification').removeClass('t_selected');
                selectedModificationIds.splice(0, selectedModificationIds.length);
                addModtypeColor(modtypes);


                // 一旦削除して、新たに太い線をかく
                e.stopPropagation();

                if(e.ctrlKey) {
                    var source = conn.source;
                    var target = conn.target;
                    var rgba = conn.paintStyleInUse["strokeStyle"];
                    var endpoints = conn.endpoints;
                    var connId = conn.getParameter('connId');
                    var type = conn.getParameter('type');

                    /*
                    var labelText = "";
                    var modId = "";
                    for(var i = 0; i < conn.overlays.length; i++) {
                        var overlay = conn.overlays[i];
                        //console.log('label:', overlay["type"]);

                        if(overlay["type"] == "Label") {
                            //console.log(overlay.getLabel());
                            labelText = overlay.getLabel();
                            modId = overlay["id"];
                        }
                    }
                    */


                    selectedConns.push(conn);

                    /*

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    //var c = makeConnection(subject, object, type, rgba, connId, "selected", modanns, "");
                    var c = makeConnection2(subject, object, type, rgba, connId, "selected", modanns);



                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                    */

                    // テーブルを選択状態にする
                    $('#relation_t_' + connId).addClass('t_selected');
                    // remove_btnを表示
                    $('.relation.t_selected .removeBtn').show();
                    //console.log('削除ボタン:', $('.relation.t_selected .removeBtn'));


                } else {
                    //console.log('選択されました');
                    // 一旦、選択されていたconnectionを再描画する
                    //console.log('選択されているconnection数:',selectedConns.length);

                    /*
                     for(i in selectedConns) {
                     var sConn = selectedConns[i];
                     var source = sConn.source;
                     var target = sConn.target;
                     var rgba = sConn.paintStyleInUse["strokeStyle"];
                     var endpoints = sConn.endpoints;
                     var connId = sConn.getParameter('connId');
                     var type = sConn.getParameter('type');


                     //console.log('選択を解除します');
                     //console.log('endpoints:',endpoints);

                     var subject = source.attr('id');
                     var object = target.attr('id');

                     var c = makeConnection(subject, object, type, rgba, connId, "unselected");

                     jsPlumb.deleteEndpoint(endpoints[0]);
                     jsPlumb.deleteEndpoint(endpoints[1]);

                     }
                     */

                    // 空にする
                    selectedConns.splice(0, selectedConns.length);

                    var source = conn.source;
                    var target = conn.target;
                    var rgba = conn.paintStyleInUse["strokeStyle"];
                    var endpoints = conn.endpoints;
                    var connId = conn.getParameter('connId');
                    var type = conn.getParameter('type');

                    var subject = source.attr('id');
                    var object = target.attr('id');


                    selectedConns.push(conn);

                    /*
                    //var c = makeConnection(subject, object, type, rgba, connId, "selected", modanns, "");

                    var c = makeConnection2(subject, object, type, rgba, connId, "selected", modanns);

                    //console.log(c);



                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                    */

                    // テーブルを選択状態にする
                    $('.relation').removeClass('t_selected');
                    $('.relation .removeBtn').hide();

                    $('#relation_t_' + connId).addClass('t_selected');
                    // remove_btnを表示

                    $('.relation.t_selected .removeBtn').show();

                }
                reMakeConnection();

            }

            return false;

        });


        /*
         // 選択解除
         conn.bind("contextmenu", function(conn, e){
         e.preventDefault();
         e.stopPropagation();

         var source = conn.source;
         var target = conn.target;
         var rgba = conn.paintStyleInUse["strokeStyle"];
         var endpoints = conn.endpoints;
         var connId = conn.getParameter("connId");
         var type = conn.getParameter("type");

         for(i in selectedConns) {
         if(selectedConns[i] == conn){
         selectedConns.splice(i, 1);
         }
         }

         makeConnection(source, target, type, rgba, connId);

         jsPlumb.deleteEndpoint(endpoints[0]);
         jsPlumb.deleteEndpoint(endpoints[1]);

         // テーブルを選択解除にする
         $('#relation_t_' + connId).removeClass('t_selected');
         // remove_btnを非表示

         $('#relation_t_' + connId + ' .removeBtn').hide();

         return false;

         });
         */

        //console.log('作成されたconnection id:', conn.getParameter("connId"), conn.getParameter("type"));


        return conn;


      // }
    }


    function makeInstance(insanns) {
        $('#ins_area').empty();

        // 行高さ
        var lineHeight = parseInt($('#doc_area').css('lineHeight'));

        var w = 10; // 幅
        var h = 10;  // 高さ

        var margin = 2;   // おなじオブジェクトにインスタンスが複数ある場合の、その間

        var ins_area_offset_top = $('#ins_area').get(0).offsetTop;
        var ins_area_offset_left = $('#ins_area').get(0).offsetLeft;

        var padding_left = parseInt($('#ins_area').css('padding-left'));
        var padding_top = parseInt($('#ins_area').css('padding-top'));

        //console.log('ins_area_offset_top:', ins_area_offset_top);
        //console.log('ins_area_offset_left :', ins_area_offset_left );
        //console.log('padding_left:', padding_left);
        //console.log('padding_top:', padding_top);

        var uniqueInsList = new Array();

        for(var i in insanns) {

            var uniqueNum = 0;

            var ins = insanns[i];

            var objectId = ins["object"];


            for(var j in uniqueInsList) {
                if(uniqueInsList[j] == objectId) {
                    //console.log('あります');
                    uniqueNum++;
                }
            }

            uniqueInsList.push(objectId);

            var elem = $('#' + objectId);

            var left = elem.get(0).offsetLeft + ins_area_offset_left - padding_left;
            var top = elem.get(0).offsetTop - padding_top - h;
            // var top = elem.get(0).offsetTop - h;
            var height = elem.outerHeight();
            var width = elem.outerWidth();

            //console.log('object of instance:', elem, " top:",top, ", left:", left, ", width:", width, ", height:", height);
            //console.log('ins_area top:', $('#ins_area').get(0).offsetTop);

            // divを書く位置
            var posX;
            var posY;

            // 元のcategory annotationのcategory
            var cate;
            // 枠の色、インスタンスの元のcategory annotationの色
            var borderColor;

            // 元のspanの幅を求める
            for(var j in annotationJson) {
                var catann = annotationJson[j];
                if(catann["id"] == objectId) {
                    var offset;

                    //console.log("x:y:", catann["x"], ":", catann["y"]);
                    var rx = catann["x"];
                    var ry = catann["y"];

                    if(height > lineHeight) {
                        //console.log("2行以上です");

                        // offsetを左右に振り分ける
                        if(uniqueNum > 0) {
                            if(uniqueNum % 2 == 0) {
                                offset = -( margin + w) * Math.ceil(uniqueNum/2);
                            } else {
                                offset = ( margin + w) * Math.ceil(uniqueNum/2);
                            }
                        } else {
                            offset = 0;
                        }


                        posX = left + (width -left)/2  + offset;
                        posY = top;

                    } else {
                        // 1行なので、単純に幅を求めて
                        // offsetを加える
                        //console.log('1行です');


                        // offsetを左右に振り分ける
                        if(uniqueNum > 0) {
                            if(uniqueNum % 2 == 0) {
                                offset = -( margin + w) * Math.ceil(uniqueNum/2);
                            } else {
                                offset = ( margin + w) * Math.ceil(uniqueNum/2);
                            }
                        } else {
                            offset = 0;
                        }
                        posX = left + (rx -left)/2  + offset;
                        posY = top;
                    }

                    cate = catann["category"];

                }
            }

            for(var k in categories) {
                if(categories[k].split('|')[0] == cate) {
                    borderColor = categories[k].split('|')[2];
                    break;
                }
            }

            // ここでspanの上部にdivを描く?
            var div = '<div id="' + ins["id"] +'" class="instance ' + ins["type"] + ' ' + cate + '" style="position:absolute;left:' + posX + 'px; top:' + posY + 'px; width:' + w +'px; height:' + h + 'px; border-color:' + borderColor +'" ></div>';

            //var div = '<div id="' + ins["id"] +'" class="instance ' + ins["type"] + ' ' + cate + '" style="position:absolute;left:' + posX + 'px; top:' + posY + 'px; width:' + w +'px; height:' + h + 'px;" ></div>';
            $('#ins_area').append(div);

            // 選択マークをつける
            for(var m in selectedInstanceIds) {
                $('#ins_area div#' + selectedInstanceIds[m]).css('border-color', '#000000').addClass('ins_selected');
            }


        }


    }

    function makeModification(modanns) {
        //console.log('makeModification');

        $('div.instance span.modification').remove();

        for(var i in modanns) {
            var mod = modanns[i];
            var type = mod["type"];
            var object = mod["object"];

            var modId = mod["id"];

            //console.log('id:', id);
            //console.log('object:', object);

            if(object.substr(0,1) == "R") {
                // relationがmodificationされている

                var conns = getConnectionData();

                for(var j in conns) {
                    var conn = conns[j];
                    var connSubject = conn["subject"];
                    var connObject = conn["object"];
                    var rgba = conn["paintStyle"];
                    var connId = conn["id"];
                    var connType = conn["type"];
                    var endpoints = conn["endpoints"];

                    if(object == connId)  {
                        // 一旦消して、新たに書く
                        //console.log('書きます', connId);
                        jsPlumb.deleteEndpoint(endpoints[0]);
                        jsPlumb.deleteEndpoint(endpoints[1]);
                        var c = makeConnection2(connSubject, connObject, connType, rgba, connId, "unselected", modanns);

                    }

                }


            } else {
                // instanceがmodificationされている
                for(var j in insanns) {
                    var ins = insanns[j];
                    if(ins["id"] == object) {
                        if(type == "Negation") {
                            $('#' + object).append('<span class="modification mod_' + type + ' instance_modification" id="' + modId + '">X</span>');
                        } else if(type == "Speculation") {
                            $('#' + object).append('<span class="modification mod_' + type + ' instance_modification" id="' + modId + '">?</span>');
                        }

                    }
                }

            }

        }

    }


    function unselectModification() {


        //for(var i in selectedModificationIds) {

            // 選択されているmodificationは
           // var selectedModId = selectedModificationIds[i];
           // console.log('selectedModId:', selectedModId);


            var conns = getConnectionData();

            for(var j in conns) {
                var conn = conns[j];

                //var labelText = "";
                //var modId = "";
                //for(var i = 0; i < conn.overlays.length; i++) {
                   // var overlay = conn.overlays[i];
                    //console.log('label:', overlay["type"]);

                    //if(overlay["type"] == "Label") {
                       // console.log(overlay.getLabel());
                        //labelText = overlay.getLabel();
                        //modId = overlay["id"];

                        //if(selectedModId == modId) {

                            var connId = conn["id"];
                            var subject = conn["subject"];
                            var object = conn["object"]
                            var rgba = conn["paintStyle"];
                            var endpoints = conn["endpoints"];
                            var type = conn['type'];

                            //console.log(connId, "を書き直します");

                            jsPlumb.deleteEndpoint(endpoints[0]);
                            jsPlumb.deleteEndpoint(endpoints[1]);

                            //var c = makeConnection(subject, object, type, rgba, connId, "unselected", labelText, modId, "");
                            var c = makeConnection2(subject, object, type, rgba, connId, "unselected", modanns);
                        //}
                    //}
               // }

            }

       // }



        // modificationの選択をはずす
        $('span.mod_selected').removeClass('mod_selected');
        $('table.modification .removeBtn').hide();
        $('table.modification').removeClass('t_selected');


        selectedModificationIds.splice(0, selectedModificationIds.length);

    }

    function changeConnectionOpacity(opacity) {
        var conns = getConnectionData();

        for(var j in conns) {
            var conn = conns[j];
            //var source = $('#' + conn.subject);
            //var target = $('#' + conn.object);
            var rgba = conn.paintStyle;

            var as = rgba.split(",");
            //console.log(conn["id"], ", as[3]:", as[3]);
            //var a = as[3].replace(")", "");

            rgba = as[0] + "," + as[1] + "," + as[2] + "," + opacity + ")";

           // console.log('rgba:',a);
            //rgba(0,51,255, 0.5)

            var type = conn.type;
            var endpoints = conn.endpoints;
            var id = conn.id;

            var labelText = "";
            var modId = "";
            for(var i = 0; i < conn.overlays.length; i++) {
                var overlay = conn.overlays[i];
                //console.log('label:', overlay["type"]);

                if(overlay["type"] == "Label") {
                    //console.log(overlay.getLabel());
                    labelText = overlay.getLabel();
                    modId = overlay["id"];
                }
            }

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);

            //makeConnection(source, target, type, rgba, id);

            //makeConnection(conn.subject, conn.object, type, rgba, id, "unselected", labelText, modId, "");

            makeConnection2(conn.subject, conn.object, type, rgba, id, "unselected", modanns);
        }
    }

    // instanceがあるか
    function hasInstance(cate_id) {

        var has = false;

        for(var i in insanns) {
            var ins = insanns[i];

            if(ins["object"] == cate_id) {
                has = true;
                break;
            }

        }

        return has;

    }



});

