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
     *
     */
    var isEditMode = false;


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
     * relationモードか？
     */
    var isRelationMode = false;

    /*
     * relationテーブルのsort状態
     */
    var sortConnStatus = "new";

    /*
     * 接続用span要素
     */
    var sourceElem;
    var targetElem;


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
     * connection id
     * 最初のconnectionは 0 + 1=1から始まる
     */
    var connId = 0;

    /*
     * 線の透明度
     */
    var connOpacity = 0.6;



    /*
     * insanns
     */
    var insanns;

    var sortInsannsStatus = 'new';


    /*
     * modanns
     */
    var modanns;

    var sortModannsStatus = 'new';

    /*
     * conf.txtより読み取る設定値
     */
    var delimitCharacters;
    var boundaryCharacters;
    var categories = new Array();
    var relations = new Array();
    var instypes = new Array();
    var modtypes = new Array();
    var defaultCategory;
    var defaultRelation;
    var defaultInstype;
    var defaultModtype;

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
     * msg_areaに文字列を表示
     */
    function showMsg(str) {
        $('#msg_area').html(str);
    }

    /*
     * ?targetUrlパラメーターがある場合に
     * targetUrlの取得
     */
    if(location.search.replace('?', '').split('=')[0] == 'target') {
        targetUrl =  location.search.replace('?', '').split('=')[1];
    }

    /*
     * アノテーションのundo storage
     */
    var undoArray = new Array();
    if(sessionStorage.getItem('undo') != null) {
        undoArray = JSON.parse(sessionStorage.getItem('undo'));
    }

    /*
     * アノテーションのredo storage
     */
    var redoArray = new Array();
    if(sessionStorage.getItem('redo') != null) {
        redoArray = JSON.parse(sessionStorage.getItem('redo'));
    }

    /*
     * コネクションのundo storage
     */
    var undoConnArray = new Array();
    if(sessionStorage.getItem('undoConn') != null) {
        undoConnArray = JSON.parse(sessionStorage.getItem('undoConn'));
    }


    /*
     * コネクションのredo storage
     */
    var redoConnArray = new Array();
    if(sessionStorage.getItem('redoConn') != null) {
        redoConnArray = JSON.parse(sessionStorage.getItem('redoConn'));
    }


    /*
     * insannsのundo storage
     */
    var undoInsannsArray = new Array();
    if(sessionStorage.getItem('undoInsanns') != null) {
        undoInsannsArray = JSON.parse(sessionStorage.getItem('undoInsanns'));
    }


    /*
     * insannsのredo storage
     */
    var redoInsannsArray = new Array();
    if(sessionStorage.getItem('redoInsanns') != null) {
        redoInsannsArray = JSON.parse(sessionStorage.getItem('redoInsanns'));
    }


    /*
     * modannsのundo storage
     */
    var undoModannsArray = new Array();
    if(sessionStorage.getItem('undoModanns') != null) {
        undoModannsArray = JSON.parse(sessionStorage.getItem('undoModanns'));
    }


    /*
     * modannsのredo storage
     */
    var redoModannsArray = new Array();
    if(sessionStorage.getItem('redoModanns') != null) {
        redoModannsArray = JSON.parse(sessionStorage.getItem('redoModanns'));
    }


    //console.log('os:', $.os.name);

    /*
     * baseElemにdivの高さを揃える
     */
    function adjustDivHeight(targetElem, baseElem) {
        targetElem.height(baseElem.height());
    }

    /*
     * baseElemにアノテーションリストの高さを揃える
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
        initJsPumb();

        targetUrl = $('#load_url').val();

        //初期状態はアノテーション編集モード
        isRelationMode = false;
        $('#relation_btn').attr("src", 'images/relation_off_btn.png');

        $.ajax({
            type: "GET",
            url: targetUrl,
            dataType: "jsonp",
            jsonp : 'callback',
            success: function(data) {
                /* success */
                sessionStorage.clear();
                undoArray = new Array();
                redoArray = new Array();
                changeButtonState($('#undo_btn'), undoArray);
                changeButtonState($('#redo_btn'), redoArray);

                var doc = data.text;

                $("#src_area").html(doc);
                $("#doc_area").html(doc);

                annotationJson = data.catanns;

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
                setCurrentStorage(annotationJson);
                sessionStorage.setItem('document', doc);
                sessionStorage.setItem('targetUrl', targetUrl);


                // insannsのロード
                if(data.insanns != undefined) {
                    insanns = data.insanns;
                } else {
                    insanns = new Array();
                }

                makeInstanceTable();
                makeInstance(insanns);
                addInstypeColor(instypes);
                //addInstanceBorderColor(categories);

                setCurrentInsannsStorage(insanns);


                hideConnArray = new Array();
                tmpHidedConnArray = new Array();

                //いまのところ
                if(data.relanns != undefined) {
                    connArray = data.relanns;
                } else {
                    connArray = new Array();
                }


                connId = getMaxConnId();
                //console.log("MaxConnId:", connId);

                //console.log('connArray:', connArray);

                /*
                // 初期状態はspan編集モードなので
                // hideConnArrayに入れる
                for(var j=0; j < connArray.length; j++) {
                    var conn = connArray[j];

                    var connObj = new Object();
                    connObj["subject"] = conn['subject'];
                    connObj["object"] = conn['object'];
                    //connObj["paintStyle"] = paintStyle['strokeStyle'];
                    connObj["id"] = conn.id;
                    connObj["type"] = conn.type;

                    var color;
                    for(var k in relations) {
                        if(relations[k].split('|')[0] == conn['type']) {
                            color = relations[k].split('|')[2];
                        }
                    }

                    var rgba = colorTrans(color);
                    connObj["paintStyle"] = rgba;
                    hideConnArray.push(connObj);
                }

                //console.log('hideConnArray:', hideConnArray);
                */


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
                    makeConnection(sId, tId, type, rgba, connId);

                }


                makeRelationTable();
                addRelationColor(relations);

                setCurrentConnStorage(connArray);


                // modannsのロード
                if(data.modanns != undefined) {
                    modanns = data.modanns;
                } else {
                    modanns = new Array();
                }

                makeModificationTable();
                makeModification(modanns);
                addModtypeColor(modtypes);

                setCurrentModannsStorage(modanns);





                // urlの表示
                showMsg('load from: ' + targetUrl);
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
    if(targetUrl != '') {
        initJsPumb();

        var category;
        var relation;
        var instype;
        var modtype;

        showMsg('load from: ' + targetUrl);

        $.ajax({
            type: "GET",
            url: "conf.txt",
            dataType: "text",
            success:function(confdata) {

                var datas = confdata.split('\n');

                for(var i = 0; i < datas.length; i++) {

                    if (datas[i].match(/^category/)) {
                        eval(datas[i]);
                        categories.push(category);
                    } else if(datas[i].match(/^relation/)) {
                        eval(datas[i]);
                        relations.push(relation);
                    } else if(datas[i].match(/^instype/))  {
                        eval(datas[i]);
                        instypes.push(instype);
                    } else if(datas[i].match(/^modtype/)) {
                        eval(datas[i]);
                        modtypes.push(modtype);
                    } else {
                        eval(datas[i]);
                    }
                }

                makeCategory(categories);
                makeRelation(relations);
                makeInstype(instypes);
                makeModtype(modtypes);


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
                            var annoJsonStr = sessionStorage.getItem('current');
                            annotationJson = JSON.parse(annoJsonStr);

                            $("#annojson").text(JSON.stringify(annotationJson));

                            sortNumJson(annotationJson);

                            markAnnotation(annotationJson);
                            makeAnnoTable(annotationJson);
                            addCategoryColor(categories);

                            var connArrayStr = sessionStorage.getItem('currentConn');

                            if(connArrayStr == null) {
                                connArray = new Array();
                            } else {
                                connArray = JSON.parse(connArrayStr);
                            }

                            //connId = getCateMaxId();

                            connId = getMaxConnId();

                            /*
                             // リロードした場合
                             // hideConnArrayに入れる
                             for(var j=0; j < connArray.length; j++) {
                             var conn = connArray[j];

                             var connObj = new Object();
                             connObj["subject"] = conn['subject'];
                             connObj["object"] = conn['object'];
                             //connObj["paintStyle"] = paintStyle['strokeStyle'];
                             connObj["id"] = conn['id'];
                             connObj["type"] = conn.type;

                             ////console.log('relation:', conn["relation"]);

                             var color;
                             for(var k in relations) {
                             if(relations[k].split('|')[0] == conn['type']) {
                             //console.log('colorは:', relations[k].split('|')[2])
                             color = relations[k].split('|')[2];
                             }
                             }

                             var rgba = colorTrans(color);
                             connObj["paintStyle"] = rgba;
                             hideConnArray.push(connObj);
                             }
                             */



                            makeRelationTable();
                            addRelationColor(relations);


                            var insannsStr = sessionStorage.getItem('currentInsanns');

                            if(insannsStr == null) {
                                insanns = new Array();
                            } else {
                                insanns = JSON.parse(insannsStr);
                            }

                            makeInstanceTable();
                            makeInstance(insanns);
                            addInstypeColor(instypes);
                            //addInstanceBorderColor(categories);



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
                                makeConnection(sId, tId, type, rgba, connId);

                                // jsPlumb.deleteEndpoint(endpoints[0]);
                                //jsPlumb.deleteEndpoint(endpoints[1]);

                            }

                            var mode = sessionStorage.getItem('mode');

                            if(mode == "relation") {
                                // relationモード
                                //bindConnectionEvent();

                                if($('#relation_btn').attr('src') == 'images/relation_off_btn.png') {
                                    $('#relation_btn').attr("src", 'images/relation_on_btn.png');
                                }

                                isRelationMode = true;

                                $('table.annotation tr td, table.annotation tr td div').die('click', selectAnnotationTable);
                                $('.editable').die('focus', focusEditTable);
                                $('div.editable').addClass('non_edit').removeClass('editable').unbind('click.editable');

                                $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                                    'table.annotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, ' +
                                    'form, #load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div');
                                $('#doc_area').die('mouseup', doMouseup);

                                // 選択解除
                                $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                                    "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
                                    "img, form, #load_dialog, #load_btn, :button, :text, :input," +
                                    "table.relation, table.relation tr td, table.relation tr td div, table.instance, table.instance tr td, table.instance tr td div)").die("click", cancelSelect);

                                /*
                                 // relationモードならばconnectionを再描画する
                                 for(var j=0; j < hideConnArray.length; j++) {
                                 var conn = hideConnArray[j];
                                 var sourceElem = $('#' + conn['subject']);
                                 var targetElem = $('#' + conn['object']);
                                 var type  = conn.type;
                                 var rgba = conn.paintStyle;
                                 var connId = conn.id;

                                 makeConnection(sourceElem,targetElem, type, rgba, connId);
                                 }
                                 */
                            } else {
                                // span編集モード
                                $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

                                //unbindConnectionEvent();
                            }



                            var modannsStr = sessionStorage.getItem('currentModanns');

                            if(modannsStr == null) {
                                modanns = new Array();
                            } else {
                                modanns = JSON.parse(modannsStr);
                            }

                            makeModificationTable();
                            makeModification(modanns);
                            addModtypeColor(modtypes);

                        } else {
                            initJsPumb();

                            sessionStorage.clear();
                            undoArray = new Array();
                            redoArray = new Array();
                            changeButtonState($('#undo_btn'), undoArray);
                            changeButtonState($('#redo_btn'), redoArray);

                            var doc = data.text;

                            $("#src_area").html(doc);
                            $("#doc_area").html(doc);

                            annotationJson = data.catanns;

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
                            setCurrentStorage(annotationJson);
                            sessionStorage.setItem('document', doc);
                            sessionStorage.setItem('targetUrl', targetUrl);


                            // insannsのロード
                            if(data.insanns != undefined) {
                                insanns = data.insanns;
                            } else {
                                insanns = new Array();
                            }

                            makeInstanceTable();
                            makeInstance(insanns);
                            addInstypeColor(instypes);
                            //addInstanceBorderColor(categories);

                            setCurrentInsannsStorage(insanns);


                            hideConnArray = new Array();
                            tmpHidedConnArray = new Array();

                            //いまのところ
                            if(data.relanns != undefined) {
                                connArray = data.relanns;
                            } else {
                                connArray = new Array();
                            }


                            connId = getMaxConnId();
                            //console.log("MaxConnId:", connId);

                            //console.log('connArray:', connArray);

                            /*
                             // 初期状態はspan編集モードなので
                             // hideConnArrayに入れる
                             for(var j=0; j < connArray.length; j++) {
                             var conn = connArray[j];

                             var connObj = new Object();
                             connObj["subject"] = conn['subject'];
                             connObj["object"] = conn['object'];
                             //connObj["paintStyle"] = paintStyle['strokeStyle'];
                             connObj["id"] = conn.id;
                             connObj["type"] = conn.type;

                             var color;
                             for(var k in relations) {
                             if(relations[k].split('|')[0] == conn['type']) {
                             color = relations[k].split('|')[2];
                             }
                             }

                             var rgba = colorTrans(color);
                             connObj["paintStyle"] = rgba;
                             hideConnArray.push(connObj);
                             }

                             console.log('hideConnArray:', hideConnArray);
                             */


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
                                makeConnection(sId, tId, type, rgba, connId);

                            }


                            makeRelationTable();
                            addRelationColor(relations);

                            setCurrentConnStorage(connArray);


                            // modannsのロード
                            if(data.modanns != undefined) {
                                modanns = data.modanns;
                            } else {
                                modanns = new Array();
                            }

                            makeModificationTable();
                            makeModification(modanns);
                            addModtypeColor(modtypes);

                            setCurrentModannsStorage(modanns);





                            // urlの表示
                            showMsg('load from: ' + targetUrl);

                        }
                        sessionStorage.setItem('document', doc);
                    }
                });
            }
        });
    } else {
        // 通常のリロード
        //console.log('リロードされました');
        if(sessionStorage.getItem('document') != null) {

            initJsPumb();

            var category;
            var relation;
            var instype;
            var modtype;

            $.ajax({
                type: "GET",
                url: "conf.txt",
                dataType: "text",
                success:function(data) {

                    var datas = data.split('\n');

                    for(var i = 0; i < datas.length; i++) {

                        if (datas[i].match(/^category/)) {
                            eval(datas[i]);
                            categories.push(category);
                        } else if(datas[i].match(/^relation/)) {
                            eval(datas[i]);
                            relations.push(relation);
                        } else if(datas[i].match(/^instype/))  {
                            eval(datas[i]);
                            instypes.push(instype);
                        } else if(datas[i].match(/^modtype/)) {
                            eval(datas[i]);
                            modtypes.push(modtype);
                        } else {
                            eval(datas[i]);
                        }
                    }

                    makeCategory(categories);
                    makeRelation(relations);
                    makeInstype(instypes);
                    makeModtype(modtypes);


                    // documentがstorageのものと同じなので,storageからデータを取り出す
                    var doc = sessionStorage.getItem('document');
                    targetUrl = sessionStorage.getItem('targetUrl');

                    showMsg('load from: ' + targetUrl);

                    $("#src_area").html(doc);
                    $("#doc_area").html(doc);

                    //adjustDivHeight($('#anno_area'), $('#doc_area'));
                    //adjustDivHeight($('#category_area'), $('#doc_area'));
                    //adjustDivHeight($('#relcategory_area'), $('#doc_area'));
                    //adjustDivHeight($('#relation_area'), $('#doc_area'));
                    //adjustListHeight($('#anno_list_area'), $('#doc_area'));
                    // adjustListHeight($('#rel_list_area'), $('#doc_area'));

                    // catannsはstorageから
                    var annoJsonStr = sessionStorage.getItem('current');
                    annotationJson = JSON.parse(annoJsonStr);

                    $("#annojson").text(JSON.stringify(annotationJson));

                    sortNumJson(annotationJson);

                    markAnnotation(annotationJson);
                    makeAnnoTable(annotationJson);
                    addCategoryColor(categories);

                    var connArrayStr = sessionStorage.getItem('currentConn');

                    if(connArrayStr == null) {
                        connArray = new Array();
                    } else {
                        connArray = JSON.parse(connArrayStr);
                    }

                    //connId = getCateMaxId();

                    connId = getMaxConnId();

                    /*
                    // リロードした場合
                    // hideConnArrayに入れる
                    for(var j=0; j < connArray.length; j++) {
                        var conn = connArray[j];

                        var connObj = new Object();
                        connObj["subject"] = conn['subject'];
                        connObj["object"] = conn['object'];
                        //connObj["paintStyle"] = paintStyle['strokeStyle'];
                        connObj["id"] = conn['id'];
                        connObj["type"] = conn.type;

                        //console.log('relation:', conn["relation"]);

                        var color;
                        for(var k in relations) {
                            if(relations[k].split('|')[0] == conn['type']) {
                                //console.log('colorは:', relations[k].split('|')[2])
                                color = relations[k].split('|')[2];
                            }
                        }

                        var rgba = colorTrans(color);
                        connObj["paintStyle"] = rgba;
                        hideConnArray.push(connObj);
                    }
                    */



                    makeRelationTable();
                    addRelationColor(relations);


                    var insannsStr = sessionStorage.getItem('currentInsanns');

                    if(insannsStr == null) {
                        insanns = new Array();
                    } else {
                        insanns = JSON.parse(insannsStr);
                    }

                    makeInstanceTable();
                    makeInstance(insanns);
                    addInstypeColor(instypes);
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

                        //console.log('sElem:', sElem);


                        //makeConnection($('#' + sId), $('#' + tId), type, rgba, connId);
                        makeConnection(sId, tId, type, rgba, connId);

                        // jsPlumb.deleteEndpoint(endpoints[0]);
                        //jsPlumb.deleteEndpoint(endpoints[1]);

                    }

                    var mode = sessionStorage.getItem('mode');

                    if(mode == "relation") {
                        // relationモード
                        //bindConnectionEvent();

                        if($('#relation_btn').attr('src') == 'images/relation_off_btn.png') {
                            $('#relation_btn').attr("src", 'images/relation_on_btn.png');
                        }

                        isRelationMode = true;

                        $('table.annotation tr td, table.annotation tr td div').die('click', selectAnnotationTable);
                        $('.editable').die('focus', focusEditTable);
                        $('div.editable').addClass('non_edit').removeClass('editable').unbind('click.editable');

                        $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, ' +
                            'table.annotation tr td div, .editable,  #removeBtn, .category_apply_btn, .relation_apply_btn, img, ' +
                            'form, #load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div');
                        $('#doc_area').die('mouseup', doMouseup);

                        // 選択解除
                        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                            "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
                            "img, form, #load_dialog, #load_btn, :button, :text, :input," +
                            "table.relation, table.relation tr td, table.relation tr td div, table.instance, table.instance tr td, table.instance tr td div)").die("click", cancelSelect);

                        /*
                        // relationモードならばconnectionを再描画する
                        for(var j=0; j < hideConnArray.length; j++) {
                            var conn = hideConnArray[j];
                            var sourceElem = $('#' + conn['subject']);
                            var targetElem = $('#' + conn['object']);
                            var type  = conn.type;
                            var rgba = conn.paintStyle;
                            var connId = conn.id;

                            makeConnection(sourceElem,targetElem, type, rgba, connId);
                        }
                        */
                    } else {
                        // span編集モード
                        $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

                        //unbindConnectionEvent();
                    }



                    var modannsStr = sessionStorage.getItem('currentModanns');

                    if(modannsStr == null) {
                        modanns = new Array();
                    } else {
                        modanns = JSON.parse(modannsStr);
                    }

                    makeModificationTable();
                    makeModification(modanns);
                    addModtypeColor(modtypes);


                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "conf.txt",
                dataType: "text",
                success:function(data) {

                    var datas = data.split('\n');

                    for(var i = 0; i < datas.length; i++) {

                        if (datas[i].match(/^category/)) {
                            eval(datas[i]);
                            categories.push(category);
                        } else if(datas[i].match(/^relation/)) {
                            eval(datas[i]);
                            relations.push(relation);
                        } else if(datas[i].match(/^instype/))  {
                            eval(datas[i]);
                            instypes.push(instype);
                        } else if(datas[i].match(/^modtype/)) {
                            eval(datas[i]);
                            modtypes.push(modtype);
                        } else {
                            eval(datas[i]);
                        }
                    }

                    makeCategory(categories);
                    makeRelation(relations);
                    makeInstype(instypes);
                    makeModtype(modtypes);

                    $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);
                }
            });
        }
    }

    /*
     * リロード対策用に現状をcurrentに保存
     */
    function setCurrentStorage(annoJson) {

        if(annotationJson != undefined) {

            if(sessionStorage.getItem('current') != null) {
                //console.log('currentから取り出します')
                var prevJsonStr = sessionStorage.getItem('current');

                if(prevJsonStr != "undefined") {
                    setUndoStorage(JSON.parse(prevJsonStr));
                }
            }

            sessionStorage.setItem('current', JSON.stringify(annoJson));

            changeButtonState($('#undo_btn'), undoArray);
            changeButtonState($('#redo_btn'), redoArray);
        }
    }

    /*
     * Undo Storageに格納
     */
    function setUndoStorage(annoJson) {
        undoArray.push(annoJson);
        sessionStorage.setItem('undo',  JSON.stringify(undoArray));
    }

    /*
     * Redo Storageに格納
     */
    function setRedoStorage(annoJson) {
        redoArray.push(annoJson);
        sessionStorage.setItem('redo',  JSON.stringify(redoArray));
    }

    /*
     * リロード対策用に現状のコネクションをcurrent storageに格納
     */
    function setCurrentConnStorage(connArray) {

        if(connArray != undefined) {

            if(sessionStorage.getItem('currentConn') != null) {
                //console.log('currentから取り出します')
                var prevConnStr = sessionStorage.getItem('currentConn');

                if(prevConnStr != "undefined") {
                    setUndoConnStorage(JSON.parse(prevConnStr));
                }

            }

            sessionStorage.setItem('currentConn',  JSON.stringify(connArray));
            changeButtonState($('#undo_btn'), undoConnArray);
            changeButtonState($('#redo_btn'), redoConnArray);
        }
    }

    /*
     * コネクションをUndo Storageに格納
     */
    function setUndoConnStorage(connArray) {
        undoConnArray.push(connArray);
        sessionStorage.setItem('undoConn',  JSON.stringify(undoConnArray));
    }

    /*
     * コネクションをRedo Storageに格納
      */
    function setRedoConnStorage(connArray) {
        redoConnArray.push(connArray);
        sessionStorage.setItem('redoConn',  JSON.stringify(redoConnArray));
    }



    /*
     * リロード対策用に現状のinsannsをcurrent storageに格納
     */
    function setCurrentInsannsStorage(insanns) {

        if(insanns != undefined) {

            if(sessionStorage.getItem('currentInsanns') != null) {
                //console.log('currentから取り出します')
                var prevInsannsStr = sessionStorage.getItem('currentInsanns');

                if(prevInsannsStr != "undefined") {
                    setUndoInsannsStorage(JSON.parse(prevInsannsStr));
                }

            }

            sessionStorage.setItem('currentInsanns',  JSON.stringify(insanns));
            changeButtonState($('#undo_btn'), undoInsannsArray);
            changeButtonState($('#redo_btn'), redoInsannsArray);
        }
    }

    /*
     * insannsをUndo Storageに格納
     */
    function setUndoInsannsStorage(insanns) {
        undoInsannsArray.push(insanns);
        sessionStorage.setItem('undoInsanns',  JSON.stringify(undoInsannsArray));
    }

    /*
     * insannsをRedo Storageに格納
     */
    function setRedoInsannsStorage(insanns) {
        redoInsannsArray.push(insanns);
        sessionStorage.setItem('redoInsanns',  JSON.stringify(redoInsannsArray));
    }


    /*
     * リロード対策用に現状のmodannsをcurrent storageに格納
     */
    function setCurrentModannsStorage(modanns) {

        if(modanns != undefined) {

            if(sessionStorage.getItem('currentModanns') != null) {
                //console.log('currentから取り出します')
                var prevModannsStr = sessionStorage.getItem('currentModanns');

                if(prevModannsStr != "undefined") {
                    setUndoModannsStorage(JSON.parse(prevModannsStr));
                }

            }

            sessionStorage.setItem('currentModanns',  JSON.stringify(modanns));
            changeButtonState($('#undo_btn'), undoModannsArray);
            changeButtonState($('#redo_btn'), redoModannsArray);
        }
    }

    /*
     * modannsをUndo Storageに格納
     */
    function setUndoModannsStorage(modanns) {
        undoModannsArray.push(modanns);
        sessionStorage.setItem('undoModanns',  JSON.stringify(undoModannsArray));
    }

    /*
     * insannsをRedo Storageに格納
     */
    function setRedoModannsStorage(modanns) {
        redoModannsArray.push(modanns);
        sessionStorage.setItem('redoModanns',  JSON.stringify(redoModannsArray));
    }


    /*
     * click undo button
     */
    $('#undo_btn').click(function() {
        // 選択状態は解除
        selectedIds.splice(0, selectedIds.length);
        doUndo();
        return false;
    });

    /*
     * click redo button
     */
    $('#redo_btn').click(function(e) {
        // 選択状態は解除
        selectedIds.splice(0, selectedIds.length);
        doRedo();
        return false;
    });

    /*
     * Undo
     */
    function doUndo() {

        if(isRelationMode) {
            // relationモード
            // 現状をcurrentに格納
            var currentConnStr = sessionStorage.getItem('currentConn');
            var currentConn = JSON.parse(currentConnStr);

            setRedoConnStorage(currentConn);

            var undoConnArrayStr = sessionStorage.getItem('undoConn');

            undoConnArray = JSON.parse(undoConnArrayStr);

            // 現在の前の状態;
            connArray = undoConnArray.pop();

            // popした後のundoConnArrayを書き換える
            sessionStorage.setItem('undoConn', JSON.stringify(undoConnArray));

            // 現状をcurrentに保存
            sessionStorage.setItem('currentConn', JSON.stringify(connArray));

            //一旦全部消して、再描画
            var conns = getConnectionData();
            for(var i in conns) {
                var conn = conns[i];

                jsPlumb.removeAllEndpoints($('#' + conn.subject));
                jsPlumb.removeAllEndpoints($('#' + conn.object));
            }


            for(var j=0; j < connArray.length; j++) {
                var conn = connArray[j];

                //console.log('conn:', conn);

                var subject = conn.subject;
                var object = conn.object;

                //var sourceElem = $('#' + conn.subject);
                //var targetElem = $('#' + conn.object);
                var type  = conn.type;
                var connId = conn.id;

                var color;
                for(var k in relations) {
                    if(relations[k].split('|')[0] == conn['type']) {
                        //console.log('colorは:', relations[k].split('|')[2])
                        color = relations[k].split('|')[2];
                    }

                }

                var rgba = colorTrans(color);

                makeConnection(subject, object, type, rgba, connId);
            }

            makeRelationTable();

            changeButtonState($('#undo_btn'), undoConnArray);
            changeButtonState($('#redo_btn'), redoConnArray);

            addRelationColor(relations);

        } else {
            // span編集モード
            // 現状をcurrentに格納
            var currentJsonStr = sessionStorage.getItem('current');
            var currentJson = JSON.parse(currentJsonStr);

            setRedoStorage(currentJson);

            var undoArrayStr = sessionStorage.getItem('undo');

            undoArray = JSON.parse(undoArrayStr);

            // 現在の前の状態;
            annotationJson = undoArray.pop();

            // popした後のundoArrayを書き換える
            sessionStorage.setItem('undo', JSON.stringify(undoArray));

            // 現状をcurrentに保存
            sessionStorage.setItem('current', JSON.stringify(annotationJson));

            $("#annojson").text(JSON.stringify(annotationJson));

            markAnnotation(annotationJson);
            makeAnnoTable(annotationJson);

            changeButtonState($('#undo_btn'), undoArray);
            changeButtonState($('#redo_btn'), redoArray);
            addCategoryColor(categories);
        }
    }

    /*
     * Redo
     */
    function doRedo() {

        if(isRelationMode) {
            // relationモード
            var redoConnStr = sessionStorage.getItem('redoConn');

            redoConnArray = JSON.parse(redoConnStr);

            connArray = redoConnArray.pop();

            //console.log('取り出したconnArray:', connArray);
            // 取り出したredoをcurrentに保存
            setCurrentConnStorage(connArray);

            // popした後のredoArrayを書き換える
            sessionStorage.setItem('redoConn', JSON.stringify(redoConnArray));

            //一旦全部消して、再描画
            var conns = getConnectionData();
            for(var i in conns) {
                var conn = conns[i];

                jsPlumb.removeAllEndpoints($('#' + conn.subject));
                jsPlumb.removeAllEndpoints($('#' + conn.object));
            }


            for(var j=0; j < connArray.length; j++) {
                var conn = connArray[j];

                //console.log('conn:', conn);

                var subject = conn.subject;
                var object = conn.object;

                //var sourceElem = $('#' + conn.subject);
                //var targetElem = $('#' + conn.object);
                var type  = conn.type;
                var connId = conn.id;

                var color;
                for(var k in relations) {
                    if(relations[k].split('|')[0] == conn['type']) {
                        //console.log('colorは:', relations[k].split('|')[2])
                        color = relations[k].split('|')[2];
                    }

                }

                var rgba = colorTrans(color);

                makeConnection(subject, object, relation, rgba, connId);
            }

            makeRelationTable();

            changeButtonState($('#undo_btn'), undoConnArray);
            changeButtonState($('#redo_btn'), redoConnArray);

            addRelationColor(relations);

        } else {
            // span編集モード
            var redoJsonStr = sessionStorage.getItem('redo');

            redoArray = JSON.parse(redoJsonStr);

            annotationJson = redoArray.pop();

            // 取り出したredoをcurrentに保存
            setCurrentStorage(annotationJson);

            // popした後のredoArrayを書き換える
            sessionStorage.setItem('redo', JSON.stringify(redoArray));

            $("#annojson").text(JSON.stringify(annotationJson));

            markAnnotation(annotationJson);
            makeAnnoTable(annotationJson);

            changeButtonState($('#undo_btn'), undoArray);
            changeButtonState($('#redo_btn'), redoArray);

            addCategoryColor(categories);
        }
    }


    /*
     * undo, redoのボタン状態を変更
     */
    function changeButtonState(elem, array) {
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
            //console.log(categories[i].split("|")[3]);

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

        var html = '<form><table>';

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
                    + '<td><input type="checkbox" name="rel_hide" class="rel_hide" checked></td>'
                    + '<td><a href="' + relations[i].split("|")[1] + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + relations[i].split("|")[2]  + '">'
                    + '<td><input type="radio" name="relation" class="relation_radio"></td>'
                    + '<td title="' + url + '" class="relation_apply_btn">' + relation_name  + '</td>'
                    + '<td><input type="checkbox" name="rel_hide" class="rel_hide" checked></td>'
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

        var html = '<form><table>';

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
                    + '<td><input type="checkbox" name="instype_hide" class="instype_hide" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="instype" class="instype_radio"></td>'
                    + '<td title="' + url + '" class="instype_apply_btn">' + instype  + '</td>'
                    + '<td><input type="checkbox" name="instype_hide" class="instype_hide" checked></td>'
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

        var html = '<form><table>';

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
                    + '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" checked></td>'
                    + '<td><a href="' + url + '" target="_blank"><img src="images/link.png"></a></td></tr>';
            } else {
                html += '<tr style="background-color:' + color  + '">'
                    + '<td><input type="radio" name="modtype" class="modtype_radio"></td>'
                    + '<td title="' + url + '" class="modtype_apply_btn">' + modtype  + '</td>'
                    + '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" checked></td>'
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


        /*
        $('.editable').editable(function(value, settings) {
            // 要素と値を渡して、jsonを編集
            return editAnnotation($(this), value);
        });
        */



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


    function addEditableToTable() {
        var divs = $('table.annotation tr td div.edit_able');
        divs.addClass('editable');

        $('.editable').editable(function(value, settings) {
            // 要素と値を渡して、jsonを編集
            return editAnnotation($(this), value);
        });

    }


    function removeEditableFromTable() {
        var divs = $('table.annotation tr td div.edit_able');

        $('div.editable').addClass('non_edit').removeClass('editable').unbind('click.editable');

    }


    /*
     * relation listの作成
     */
    function makeRelationTable() {
        //console.log('--make relation table---');

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

        for(var i in selectedConns) {
            $('#relation_t_' + selectedConns[i].getParameter('connId')).addClass('t_selected');
            $('.relation.t_selected .removeBtn').show();
        }
    }


    /*
     * instance listの作成
     */
    function makeInstanceTable() {
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

        /*
        for(var i in selectedConns) {
            $('#relation_t_' + selectedConns[i].getParameter('connId')).addClass('t_selected');
            $('.relation.t_selected .removeBtn').show();
        }
        */

    }

    /*
     * modification listの作成
     */
    function makeModificationTable() {
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

            for(i in connectionList) {
                var sourceId = connectionList[i].sourceId;
                var targetId = connectionList[i].targetId;
                var paintStyle = connectionList[i].paintStyleInUse;
                var connId = connectionList[i].getParameter("connId");
                var type = connectionList[i].getParameter("type");
                var endpoints = connectionList[i].endpoints;

                // 詰め替え
                var connObj = new Object();
                connObj["subject"] = sourceId;
                connObj["object"] = targetId;
                connObj["paintStyle"] = paintStyle['strokeStyle'];
                connObj["id"] = connId;

                connObj["type"] = type;
                connObj["endpoints"] = endpoints;
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

        // jsonにx, yを設定
        for(i in annoJson) {
            var id = annoJson[i]['id'];

            var dummyElem = $('#dummy_' + id);
            //console.log('dummyElem:', dummyElem);

            if(dummyElem.get(0) != undefined) {
                var x = (dummyElem.get(0).offsetLeft + dummyElem.get(0).offsetWidth) - padding_left;
                var y = dummyElem.get(0).offsetTop - padding_top;

                annoJson[i]['x'] = x;
                annoJson[i]['y'] = y;
            }
        }

        $('#doc_area span.dummy_span').map(function() {
            // dummy_spanを削除
           // $(this).replaceWith($(this).text());
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

        $("#annojson").text(JSON.stringify(annoJson));
    }

    /*
     * textとannotation listにcategoryに対応する色をつけます
     */
    function addCategoryColor(categories) {
        for(var i = 0; i < categories.length; i++) {
            // docの中のspanに対して
            var spans = $('.' + categories[i].split('|')[0]);
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
                setCurrentStorage(annotationJson);

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

                setCurrentStorage(annotationJson);

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
        var relType = $(this).parent().prev().text();

        if($(this).attr('checked') == undefined) {

            //console.log("チェックはずれました")

            var conns = getConnectionData();

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
        } else if($(this).attr('checked') == "checked") {
            //console.log('チェックされました------');
            // 再描画
            showHideAllConnections('show', relType);

            // modificationも再描画
            makeModification(modanns);

        }
    });

    $('.instype_hide').live("change", function() {
        var insType = $(this).parent().prev().text();

        if($(this).attr('checked') == undefined) {
            $('.' + insType ).hide();
        } else {
            $('.' + insType ).show();
        }
    });


    $('.modtype_hide').live("change", function() {
        var modType = $(this).parent().prev().text();

        if($(this).attr('checked') == undefined) {
            // instanceに対して
            $('.mod_' + modType ).hide();

            // relationに対して
            jsPlumb.select().each(function(conn){
                var label = conn.getLabel();
                //console.log('label:', label);
                if(modType == "Negation") {
                    if(label == "X") {
                        conn.setLabel("");
                    }
                } else if(modType == "Speculation") {
                    if(label == "?") {
                        conn.setLabel(null);
                    }
                }
            });


        } else {
            // instanceに対して
            $('.mod_' + modType ).show();

            // relationに対して
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

        }
    })

    function clickSpan(e) {
        ////console.log('click span');

        // 下に重なってる要素のclickイベントを解除
        $('#doc_area span').unbind('click',arguments.callee);

        if(isRelationMode) {
            // relation mode
            //console.log('relation mode');

            if(sourceElem == null) {
                sourceElem = $(this);
                sourceElem.addClass('source_selected');
            } else {
                targetElem = $(this);

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
                connId++;
                connId = "R" + connId;

                var subject = sourceElem.attr('id');
                var object = targetElem.attr('id');

                ///var conn = makeConnection(sourceElem, targetElem, defaultRelation, rgba, connId);
                var conn = makeConnection(subject, object, defaultRelation, rgba, connId);

                var source_id = conn.sourceId;
                var target_id = conn.targetId;
                var rgba = conn.paintStyleInUse["strokeStyle"];
                var type = conn.getParameter("type");
                var id = conn.getParameter("connId");

                var obj = new Object();
                obj.subject = source_id;
                obj.object = target_id;
                obj.type = type;
                obj.id = id;

                sourceElem.removeClass('source_selected');
                sourceElem = null;

                // targetを次のソースにする
                sourceElem = targetElem;
                sourceElem.addClass('source_selected');

                connArray.push(obj);

                // テーブル書き換え
                makeRelationTable();
                addRelationColor(relations);
                setCurrentConnStorage(connArray);
            }

        } else {
            // span編集モード
            ////console.log('isShift:', isShift);

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
            setCurrentStorage(annotationJson);
        }
        return false;
    }

    /*
     * span要素をクリックで選択
     */
    //$('#doc_area span').live('click', function(e){
    //$('#doc_area span').live('click', clickSpan);
        /*
        //console.log('click span');

        // 下に重なってる要素のclickイベントを解除
        $('#doc_area span').unbind('click',arguments.callee);

        if(isRelationMode) {
            // relation mode
            //console.log('relation mode');

            if(sourceElem == null) {
                sourceElem = $(this);
                sourceElem.addClass('source_selected');
            } else {
                targetElem = $(this);

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
                connId++;
                connId = "R" + connId;

                var subject = sourceElem.attr('id');
                var object = targetElem.attr('id');

                ///var conn = makeConnection(sourceElem, targetElem, defaultRelation, rgba, connId);
                var conn = makeConnection(subject, object, defaultRelation, rgba, connId);

                var source_id = conn.sourceId;
                var target_id = conn.targetId;
                var rgba = conn.paintStyleInUse["strokeStyle"];
                var type = conn.getParameter("type");
                var id = conn.getParameter("connId");

                var obj = new Object();
                obj.subject = source_id;
                obj.object = target_id;
                obj.type = type;
                obj.id = id;

                sourceElem.removeClass('source_selected');
                sourceElem = null;

                // targetを次のソースにする
                sourceElem = targetElem;
                sourceElem.addClass('source_selected');

                connArray.push(obj);

                // テーブル書き換え
                makeRelationTable();
                addRelationColor(relations);
                setCurrentConnStorage(connArray);
             }

        } else {
            // span編集モード
            ////console.log('isShift:', isShift);

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
                ////console.log('shiftが押されています');
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
            setCurrentStorage(annotationJson);
        }
        return false;

        */
    //});



    /*
     * 右クリックで合体
     */
    $('#doc_area span').live('contextmenu', function(e){
        //console.log('右クリック');

        if(isRelationMode) {
           // relationモード
           if(sourceElem != null && sourceElem.attr('id') == $(this).attr('id')) {
               sourceElem.removeClass('source_selected');
               sourceElem = null;
           }

        } else {

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

                    if(firstJson['span']['end'] < secondJson['span']['end']) {
                        //console.log('最初の要素が前にある場合');
                        // 最初の要素が前にある場合
                        firstJson['span']['end'] = secondJson['span']['end'];

                        for(i in annotationJson){
                            // 2番目に選択された要素を削除
                            if(annotationJson[i]['id'] == secondSelected.attr('id')) {
                                annotationJson.splice(i, 1);
                                break;
                            }
                        }


                    } else {
                        //console.log('最初の要素が後ろにある場合');
                        // 最初の要素が後ろにある場合
                        //secondJson['end'] = firstJson['end'];

                        firstJson['span']['begin'] = secondJson['span']['begin'];

                        for(i in annotationJson){
                            // 2番目の要素を削除
                            if(annotationJson[i]['id'] == secondSelected.attr('id')) {
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

                    setCurrentStorage(annotationJson);

                    selectedIds.push(selectedId);

                    $('span#' + selectedId).addClass('selected');

                    $('#t_' + selectedId).addClass('t_selected');
                    // remove_btnを表示
                    $('.annotation.t_selected .removeBtn').show();


                    makeInstance(insanns);
                    //makeInstanceTable();
                    addInstypeColor(instypes);

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

        if(isRelationMode) {
            // connectionの削除
            var selectedId = $(this).parent().parent().parent().parent().attr('id').split('_')[2];

            for(var i in selectedConns) {

                var endpoints = selectedConns[i].endpoints;
                var id = selectedConns[i].getParameter("connId");

                if(id == selectedId) {
                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                    selectedConns.splice(i, 1);
                }

                for(var k in connArray) {
                    if(connArray[k]["id"] == selectedId) {
                        //console.log('削除するconnection id:', id);
                        connArray.splice(k, 1);
                    }
                }
            }

            // table再描画
            makeRelationTable();
            addRelationColor(relations);
            setCurrentConnStorage(connArray);


        } else {
            // spanの削除
            var selectedId = $(this).parent().parent().parent().parent().attr('id').split('_')[1];

            for(i in annotationJson) {
                if(annotationJson[i]['id'] == selectedId) {
                    annotationJson.splice(i, 1);
                }
            }

            for(var j in connArray) {
                var conn = connArray[j];
                if(conn["source_id"] == selectedId || conn["target_id"] == selectedId) {
                    //console.log('削除するconnection id:', selectedId);
                    connArray.splice(j, 1);
                }
            }

            for(var k in hideConnArray) {
                var conn = hideConnArray[k];
                if(conn["source_id"] == selectedId || conn["target_id"] == selectedId) {
                    //console.log('削除するconnection id:', selectedId);
                    hideConnArray.splice(k, 1);
                }
            }

            // 空にする
            selectedIds.splice(0, selectedIds.length);

            sortNumJson(annotationJson);
            $("#annojson").text(JSON.stringify(annotationJson));

            markAnnotation(annotationJson);
            makeAnnoTable(annotationJson);

            addCategoryColor(categories);

            setCurrentStorage(annotationJson);

            // table再描画
            makeRelationTable();
            addRelationColor(relations);
            setCurrentConnStorage(connArray);

        }
    });

    /*
     * 選択を解除
     */
    function cancelSelect(event) {
        // ctrlまたはshiftが押されていないければ
        if(!isCtrl || !isShift) {

            if(isRelationMode) {
                // relationモード

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

                    //var c = makeConnection(source, target, type, rgba, connId);
                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var c = makeConnection(subject, object, type, rgba, connId);

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                }

                // 空にする
                selectedConns.splice(0, selectedConns.length);

            } else {
                // span編集モード

                //console.log("span編集モード選択解除:", $(this));

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

                // TODO
                // instanceテーブルの選択を外す
                $('table.instance').removeClass('t_selected');
                $('table.instance .removeBtn').hide();


            }

            event.stopPropagation();
        }
    }


    /*
     * 選択解除
     */
    $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
        "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
        "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
        "table.relation, table.relation tr td, " +
        "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);


    /*
     * 選択解除用にこれらの要素をクリックした時は、その親にイベントが伝搬しないようにする
     */
    $("#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
        "table.annotation tr td div, .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, " +
        "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
        "table.relation, table.relation tr td, " +
        "table.relation tr td div, div.instance, table.instance, table.instance tr td, table.instance tr td div").live("click", function(event){
        // eventの伝搬を止める
        event.stopPropagation();
    });


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

                if(isRelationMode) {


                    // 一旦削除して、新たに太い線をかく
                    e.stopPropagation();

                    if(isCtrl) {
                        var source = conn.source;
                        var target = conn.target;
                        var rgba = conn.paintStyleInUse["strokeStyle"];
                        var endpoints = conn.endpoints;
                        var connId = conn.getParameter('connId');
                        var type = conn.getParameter('type');

                        //console.log('選択されたコネクションID:', connId);

                        var subject = source.attr('id');
                        var object = target.attr('id');

                        //var c = makeConnection(source, target, type, rgba, connId, "selected");
                        var c = makeConnection(subject, object, type, rgba, connId, "selected");

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
                            var c = makeConnection(subject, object, type, rgba, connId);

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

                        var subject = source.attr('id');
                        var object = target.attr('id');

                        //var c = makeConnection(source, target, type, rgba, connId, "selected");
                        var c = makeConnection(subject, object, type, rgba, connId, "selected");

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


    function doMouseup() {

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
                            console.log('新規?:', IsNodeAcross(selection));
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

                                ////console.log('selection.focusOffset:', selection.focusOffset);
                                var absoluteBeginPosition = len + selection.focusOffset;

                                //console.log('選択終了位置の絶対位置:', absoluteBeginPosition);

                                while(true) {
                                    if(element.id == "doc_area") {
                                        return true;
                                    }

                                    ////console.log('node id:', element.id);

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

                                ////console.log('selection.focusOffset:', selection.focusOffset);

                                var absoluteEndPosition = len + selection.focusOffset;

                                while(true) {
                                    if(element.id == "doc_area") {
                                        return true;
                                    }

                                    ////console.log('node id:', element.id);

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




    $('#edit_btn').click(function() {
        //console.log($(this).attr('src'));
        if($(this).attr('src') == 'images/edit_on_btn.png') {
            $(this).attr("src", 'images/edit_off_btn.png');

            isEditMode = false;

            $('#relation_btn').prop('disabled', true);
            $('#always_multiple_btn').prop('disabled', true);

            $('#doc_area span').die('click', clickSpan);

            $('div.instance').die('click', selectInstance);

            $('#doc_area').die('mouseup',  doMouseup);


            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);

            $('table.annotation tr td, table.annotation tr td div').die('click', selectAnnotationTable);
            removeEditableFromTable();
            $('.editable').die('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').die('click', selectInstanceTable);



        } else {
            //console.log('編集モード');

            $(this).attr("src", 'images/edit_on_btn.png');


            isEditMode = true;

            $('#relation_btn').prop('disabled', false);
            $('#always_multiple_btn').prop('disabled', false);

            $('#doc_area span').live('click', clickSpan);

            $('div.instance').live('click', selectInstance);

            //テキスト部分でドラッグ後マウスアップ
            $('#doc_area').live('mouseup',  doMouseup);

            //relation list部分をクリックで選択する
            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);


            $('table.annotation tr td, table.annotation tr td div').live('click', selectAnnotationTable);
            // annotation listのedit部分にfocusされた場合に選択状態にします。
            addEditableToTable();
            $('.editable').live('focus', focusEditTable);

            $('table.instance tr td, table.instance tr td div').live('click', selectInstanceTable);
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
      * マーク新規作成
      */
    function createElement(annoJson, selection) {

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
                        //isAcross = true;
                        ary[i]['span']['begin'] = validateStartDelimiter(annoJson[j]['span']['end']);
                        partialElem.push(ary[i]);
                        break;
                    } else if(ary[i]['span']['begin'] < annoJson[j]['span']['begin'] && ary[i]['span']['end'] > annoJson[j]['span']['begin'] && ary[i]['span']['end'] < annoJson[j]['span']['end']) {
                        // 終了位置がまたがっているので、不完全要素
                        ary[i]['span']['end'] = validateEndDelimiter(annoJson[j]['span']['begin']);
                        partialElem.push(ary[i]);
                        //isAcross = true;
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

        annoJson.push(obj);

        newElem.push(obj);

        // 一旦数字でソート
        sortNumJson(annoJson);

        // 一旦空にする
        selectedIds.splice(0, selectedIds.length);

        for(var i in annoJson) {

            if(annoJson[i]['new']) {
                // 選択状態にする
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
        setCurrentStorage(annoJson);

    }


    /*
     * マークを伸ばす
     */
    function extendElement(annoJson, selection, selectedId) {

        sortNumJson(annoJson);
;
        selectedIds.push(selectedId);

        var range = selection.getRangeAt(0);

        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        ////console.log('range:', range);

        ////console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, anchorRange));
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
                setCurrentStorage(annotationJson, selectedIds);

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
                setCurrentStorage(annotationJson, selectedIds);



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

        ////console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, focusRange));
        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。

        if(range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
            //console.log('後ろを縮める');
            //console.log('縮める位置は', selection.focusOffset);

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var len = getFocusPosBySpan(focusChilds, selection);

            // 位置修正
            var endPosition = validateEndDelimiter2(findJson(selection.focusNode.parentNode.id)['span']['begin'] + len + selection.focusOffset);

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
                setCurrentStorage(annoJson, selectedIds);
            } else {
                // 結果的に削除
                //console.log('結果的に削除');

                for(i in annotationJson) {
                    if(annotationJson[i]['id'] == selectedId) {
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
                setCurrentStorage(annotationJson, selectedIds);
            }

        } else {
            //console.log('前を縮める');
            //console.log('縮める位置は', selection.focusOffset);

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var len = getFocusPosBySpan(focusChilds, selection);

            // 修正
            var startPosition = validateStartDelimiter2(findJson(selection.focusNode.parentNode.id)['span']['begin'] + len +  selection.focusOffset);

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
                setCurrentStorage(annotationJson, selectedIds);
            } else {
                // 結果的に削除
                //console.log('結果的に削除');

                for(i in annotationJson) {
                    if(annotationJson[i]['id'] == selectedId) {
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
                setCurrentStorage(annotationJsons);
            }
        }

        // instancenの再描画
        makeInstance(insanns);
        makeInstanceTable();
        addInstypeColor(instypes);


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
        setCurrentStorage(annotationJson);

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
            ////console.log('削除:', num);

            for(i in annotationJson) {
                if(annotationJson[i]['id'] == selectedId) {
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
            setCurrentStorage(annotationJson, selectedIds);

            // 削除された場合は、それに接続するconnectionも削除
            for(var i in connArray) {
                var conn = connArray[i];
                if(conn.source_id == selectedId || conn.target_id == selectedId) {
                    conole.log('接続を削除します source_id:', conn.source_id);
                    connArray.splice(1, i);
                }

            }

            for(var k in hideConnArray) {
                var conn = hideConnArray[k];
                if(conn.source_id == selectedId || conn.target_id == selectedId) {
                    hideConnArray.splice(k, 1);
                }
            }

            setCurrentConnStorage(connArray);

            makeRelationTable();
            addRelationColor(relations);


            // instancenの再描画
            makeInstance(insanns);
            makeInstanceTable();
            addInstypeColor(instypes);

            reMakeConnection();
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
     * 数字順番でjsonのソート
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
        }
        json.sort(compare);
    }

    /*
     * カテゴリ順でソート
     */
    function sortCateJson(json) {
        var ary = new Array();
        for(i in categories) {
            ary.push(categories[i].split("|")[0]);
        }
        ary.sort();

        function compare(a, b) {
            //console.log('順番:', (a['category'] > b['category']) || (a['begin'] - b['begin']) || (b['end'] - a['end']));
            // console.log('比較:', (a['category']-0), (b['category']-0));
            for(i in ary) {
                if(ary[i] == a['category']) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
        json.sort(compare);
    }

    /*
     * 作成順でrelationソート
     */
    function sortNewConn(connArray) {
        function compare(a, b) {
            return(b['id'] - a['id']);
        }
        connArray.sort(compare);
    }

    /*
     * Relation順でrelationソート
     */
    function sortRelConn(connArray) {
        var ary = new Array();
        for(var i in relations) {
            ary.push(relations[i].split("|")[0]);
        }
        ary.sort();

        function compare(a, b) {
            for(var i in ary) {
                if(ary[i] == a['relation']) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
        connArray.sort(compare);
    }


    /*
     * 作成順でinsannsソート
     */
    function sortNewInsanns(insanns) {
        function compare(a, b) {
            return(b['id'] - a['id']);
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
            return(b['id'] - a['id']);
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

        if(isRelationMode) {
            // relation mode
            // win delete
            // mac fn + delete
            if(e.keyCode == 46) {
                for(i in selectedConns) {
                    var endpoints = selectedConns[i].endpoints;
                    var id = selectedConns[i].getParameter("connId");

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);

                    for(k in connArray) {
                        if(connArray[k]["id"] == id) {
                            //console.log('削除するconnection id:', id);
                            connArray.splice(k, 1);
                        }
                    }

                }

                // table再描画
                makeRelationTable();
                addRelationColor(relations);
                selectedConns.splice(0, selectedConns.length);
                setCurrentConnStorage(connArray);

            } else if(e.keyCode == 81) {
                /*

                // Qキー,一時隠蔽
                var num = selectedConns.length;
                if(num == 1) {
                    $('#notice_area').html(num + " relation is hided. ");
                } else if(num > 1) {
                    $('#notice_area').html(num + " relations are hided. ");
                }

                // tmpHideConnArrayに移動
                for(var i in selectedConns) {
                    var conn = selectedConns[i];

                    var source = conn.source;
                    var target = conn.target;

                    var source_id = conn.sourceId;
                    var target_id = conn.targetId;

                    var endpoints = conn.endpoints;
                    var paintStyle = conn.paintStyleInUse['strokeStyle'];

                    var connId = conn.getParameter("connId");

                    var connObj = new Object();
                    connObj["source_id"] = source_id;
                    connObj["target_id"] = target_id;
                    connObj["paintStyle"] = paintStyle;
                    connObj["id"] = connId;
                    tmpHidedConnArray.push(connObj);

                    // テーブルの背景を薄くする
                    $('#relation_t_' + connId).addClass('tmp_hide');
                    $('#relation_t_' + connId).removeClass('t_selected');
                    $('#relation_t_' + connId + ' .removeBtn').hide();

                    jsPlumb.deleteEndpoint(endpoints[0]);
                    jsPlumb.deleteEndpoint(endpoints[1]);
                }

                selectedConns.splice(0, selectedConns.length);
                */

            } else if(e.keyCode == 17) {
                // Ctrlキー
                isCtrl = true;
            } else if(e.keyCode == 16) {
                isShift = true;
            }

        } else {

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
                //削除
                if(selectedIds.length > 0) {
                    for(var i in selectedIds) {
                        var selectedId = selectedIds[i];

                        for(j in annotationJson) {
                            if(annotationJson[j]['id'] == selectedId) {
                                annotationJson.splice(j, 1);
                            }
                        }

                        for(var j in connArray) {
                            var conn = connArray[j];
                            if(conn.source_id == selectedId || conn.target_id == selectedId) {
                                connArray.splice(j, 1);
                            }
                        }

                        for(var k in hideConnArray) {
                            var conn = hideConnArray[k];
                            if(conn.source_id == selectedId || conn.target_id == selectedId) {
                                hideConnArray.splice(k, 1);
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
                    setCurrentStorage(annotationJson, selectedIds);

                    makeRelationTable();
                    addRelationColor(relations);

                }

                // TODO
                if(selectedInstanceIds.length > 0) {
                    for(var i in selectedInstanceIds) {
                        var selectedId = selectedInstanceIds[i];
                        //console.log('削除されるインスタンス:', selectedId);

                    }
                }

            } else if(e.keyCode == 73) {
                // Iキー
                // インスタンスを作る
                //console.log('Iキー');

                var annset = insanns[0]["annset"];
                var type = insanns[0]["type"];

                if(selectedIds.length > 0) {

                    var maxId = getMaxInsannsId();
                    //console.log('instance max id;', maxId);
                    for(var i in selectedIds) {
                        //console.log('選択されたspan:', selectedIds[i]);

                        var instance = new Object();
                        instance["id"] = "E" + maxId++;
                        instance["annset"] = annset;
                        instance["object"] = selectedIds[i];
                        instance["type"] = type;

                        insanns.push(instance);
                    }

                }
                makeInstance(insanns);
                makeInstanceTable();
                addInstypeColor(instypes);
            }

            // z(90)で選択要素を前に
            // x(88)で選択要素を次に
            ////console.log('isCtrl:', isCtrl);
            ////console.log('isCtrlAlt:', isCtrlAlt);

            if(e.keyCode == 90 && !isCtrl && selectedIds.length == 1) {

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

            } else if(e.keyCode == 88 && !isCtrl && selectedIds.length == 1) {

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

            if(isCtrl) {
                if(e.keyCode == 90 && undoArray.length > 0) {
                    // undo
                    doUndo();
                } else if(e.keyCode == 88 && redoArray.length > 0) {
                    // redo
                    doRedo();
                }
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


    /*
     *
     */
     function selectInstance() {
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

    /*
     * カテゴリー適用ボタン
     */
    $('.category_apply_btn').live('click', function() {

        // 選択されているannotationテーブルのcategoryに適用
        for(i in selectedIds) {

            for(j in annotationJson){
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
        setCurrentStorage(annotationJson);
    });

    /*
     * 関係適用ボタン
     */
    $('.relation_apply_btn').live('click', function() {

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
            var conn = makeConnection(subject, object, type, rgba, connId);

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
        setCurrentConnStorage(connArray);
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

            if(isCtrl) {

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

                var source = $('#' + conn.source_id);
                var target = $('#' + conn.target_id);
                var rgba = conn.paintStyle;
                var type = conn.type;
                var endpoints = conn.endpoints;

                //var c = makeConnection(source, target, type, rgba, selectedId, "selected");
                var c = makeConnection(conn.source_id, conn.target_id, type, rgba, selectedId, "selected");

                selectedConns.push(c);

                jsPlumb.deleteEndpoint(endpoints[0]);
                jsPlumb.deleteEndpoint(endpoints[1]);

            } else if(isShift && selectedConns.length == 1) {

                // ただし、一時非表示がある場合は、何もしない
                if(tmpHidedConnArray == 0) {
                    e.preventDefault();

                    //console.log("shiftキーが押されています");

                    // 一度選択をはずす
                    for(i in selectedConns) {
                        var sConn = selectedConns[i];
                        var source = sConn.source;
                        var target = sConn.target;
                        var rgba = sConn.paintStyleInUse["strokeStyle"];
                        var endpoints = sConn.endpoints;
                        var connId = sConn.getParameter('connId');
                        var type = sConn.getParameter('type');

                        var c = makeConnection(source, target, type, rgba, connId);

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
                        var source = $('#' + conn.source_id);
                        var target = $('#' + conn.target_id);
                        var rgba = conn.paintStyle;
                        var type = conn.type;
                        var endpoints = conn.endpoints;
                        var id = conn.id

                            //var c = makeConnection(source, target, type, rgba, id, "selected");
                        var c = makeConnection(conn.source_id, conn.target_id, type, rgba, id, "selected");

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

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    //var c = makeConnection(source, target, type, rgba, connId);
                    var c = makeConnection(subject, object, type, rgba, connId);

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

                var c = makeConnection(conn.source_id, conn.target_id, type, rgba, selectedId, "selected");

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
    function selectInstanceTable(e) {

        var  selectedId;
        var tagName = $(this).get(0).tagName;

        if(tagName == 'TD') {
            selectedId =  $(this).parent().parent().parent().attr('id').split('_')[2].valueOf();
        } else if(tagName == 'DIV') {
            selectedId =  $(this).parent().parent().parent().parent().attr('id').split('_')[2].valueOf();
        }

        //console.log('selectedId:', selectedId);

        if(isCtrl) {
            ////console.log('複数選択');

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

    /*
     * save submitボタンクリックでサーバーにデータをPOST
     */
    $('#save_submit').click(function() {
        var postJson = JSON.parse($("#annojson").text());
        var doc = $('#src_area').text();

        for(i in postJson) {
            delete postJson[i]["x"];
            delete postJson[i]["y"];
        }

        var postData = {"text":doc, "catanns": postJson, "relations":connArray }

        $.ajax({
            type: "post",
            url: $('#save_url').val(),
            data: postData,
            //dataType: "jsonp",
            //crossDomain: true,
            //processData: false,
            //contentType: "application/json",
            success: function(res){
                ////console.log( "Data Saved: " + res );
                $('#save_dialog').hide();
                var result = JSON.parse(res);
                if(result.result) {
                    $('#msg_area').html("Data saved!").fadeIn().fadeOut(5000, function() {
                        $(this).html('').removeAttr('style');
                        $(this).html(targetUrl);
                    });
                }else {
                    alert("Data save failed!");
                };
            },
            error: function(res, textStatus, errorThrown){
                ////console.log("エラー:", res);
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
           var startPos = annotationJson[id]["begin"];
           var endPos = annotationJson[id]["end"];
           var category = annotationJson[id]["category"];

           var origElem = annotationJson[id];

           // 新規作成された要素
           var newElem = new Array();
           // 不完全要素
           var partialElem = new Array();

           var now = (new Date()).getTime();


           var ary = findSameString(startPos, endPos, category, annotationJson);

           for(var i = 0; i < ary.length; i++) {

               var isAcross = false;

               // ここでjsonのbeginとendが他のjsonにまたがっていないかチェックする
               for(j in annotationJson) {
                   if(ary[i]['begin'] > annotationJson[j]['begin'] && ary[i]['begin'] < annotationJson[j]['end'] && ary[i]['end'] > annotationJson[j]['end'] ) {
                       // 開始位置がまたがっているので、不完全要素
                       //isAcross = true;
                       ary[i]['begin'] = validateStartDelimiter(annotationJson[j]['end']);
                       partialElem.push(ary[i]);
                       break;
                   } else if(ary[i]['begin'] < annotationJson[j]['begin'] && ary[i]['end'] > annotationJson[j]['begin'] && ary[i]['end'] < annotationJson[j]['end']) {
                       // 終了位置がまたがっているので、不完全要素
                       ary[i]['end'] = validateEndDelimiter(annotationJson[j]['begin']);
                       partialElem.push(ary[i]);
                       //isAcross = true;
                       break;
                   }

               }

               if(!isAcross) {
                   //console.log("ary[i]['begin']:", ary[i]["begin"]);
                   //console.log("ary[i]['end']:", ary[i]["end"]);
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
                   if(annotationJson[i]['new'] && annotationJson[i].begin == partialElem[j].begin && annotationJson[i].end == partialElem[j].end && annotationJson[i].category == partialElem[j].category) {
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
           setCurrentStorage(annotationJson, selectedIds);
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

                ////console.log('s_id:', s_id);
                if(type == "all") {
                    //makeConnection($('#' + s_id), $('#' + t_id), type, rgba, connId);

                    makeConnection(s_id, t_id, type, rgba, connId);
                    tmpHidedConnArray.splice(i, 1);
                    $('.tmp_hide').removeClass('tmp_hide');

                } else if(type == relType) {

                    //makeConnection($('#' + s_id), $('#' + t_id), type, rgba, connId);

                    makeConnection(s_id, t_id, type, rgba, connId);
                    tmpHidedConnArray.splice(i, 1);
                    $('.tmp_hide.t_' + type).removeClass('tmp_hide');
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
            $(this).attr("src", 'images/relation_on_btn.png');

            // relationモード
            isRelationMode = true;
            // connectionにclickイベントをバインド
            // bindConnectionEvent();


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

            // relation テーブル編集
            $('table.relation tr td, table.relation tr td div').live('click', selectRelationTable);

            /*
            // connection 再描画
            for(j in hideConnArray) {
                var connObj = hideConnArray[j];
                var sElem = connObj['subject'];
                var tElem = connObj['object'];
                var rgba = connObj['paintStyle'];
                var connId = connObj['id'];
                var type = connObj['type'];

                //console.log('sElem:', sElem);



                makeConnection($('#' + sElem), $('#' + tElem), type, rgba, connId);

            }
            */

        } else {
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



                makeConnection(source, target, type, rgba, connId);
            }



            $(this).attr("src", 'images/relation_off_btn.png');

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

            /*
            hideConnArray = getConnectionData();
            jsPlumb.removeEveryEndpoint();
            jsPlumb.reset();
            */

            $(document).live('click','*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, table.annotation tr td div, ' +
                ' .editable,  ' +
                '#removeBtn, .category_apply_btn, .relation_apply_btn,img, form, ' +
                '#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div', cancelSelect);
            $('#doc_area').live('mouseup',  doMouseup);

            // 選択解除
            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, table.annotation, table.annotation tr td, " +
                "table.annotation tr td div, " +
                " .editable,  #removeBtn, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, table.instance, table.instance tr td, table.instance tr td div)").live("click", cancelSelect);

            $('table.relation tr td, table.relation tr td div').die('click', selectRelationTable);
        }

    });





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
     * コネクションの再描画
     */
    function reMakeConnection() {
        var conns = getConnectionData();

        for(var j in conns) {
            var conn = conns[j];
            var source = $('#' + conn.subject);
            var target = $('#' + conn.object);
            var rgba = conn.paintStyle;
            var type = conn.type;
            var endpoints = conn.endpoints;
            var id = conn.id;
            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);

            //makeConnection(source, target, type, rgba, id);

            makeConnection(conn.subject, conn.object, type, rgba, id);

            //selectedConns.push(c);

        }
    }


    /*
     * コネクションの作成
     * source, target, relation, rgba, connId, flag
     */
    function makeConnection(sourceId, targetId, type, rgba, connId, flag) {

        //console.log('make connection');
        //console.log('rgba:', rgba);
        //console.log('sourceId:', sourceId);
        //console.log('targetId:', targetId);


        var sourceElem;
        var targetElem;
        // sourceElem と targetElemの取得
        // sourceIdがTから始まっている場合はspan要素
        // それ以外はインスタンス
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

        //console.log('targetElem:',targetElem);

        if(sourceElem == undefined && targetElem == undefined) {
            // 両方がインスタンス

        } else if(sourceElem == undefined) {
            // sourceがインスタンス

        } else if(targetElem == undefined) {
            // targetがインスタンス

        } else {
            // 両方がspan

        }

        // TODO
        // インスタンスがないので
        // とりあえず
        //if(sourceElem != undefined && targetElem != undefined) {




        var padding_left = parseInt($('#doc_area').css('padding-left'));
        var padding_top = parseInt($('#doc_area').css('padding-top'));

        //var source_id = sourceElem.attr('id');
        //var target_id = targetElem.attr('id');


        var sourceX = sourceElem.get(0).offsetLeft - padding_left;
        var sourceY = sourceElem.get(0).offsetTop - padding_top;

        var targetX = targetElem.get(0).offsetLeft - padding_left;
        var targetY = targetElem.get(0).offsetTop - padding_top;


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


        ////console.log('位置:', sourceX, ":", sourceY, ":", sourceWidth, ":", sourceHeight);

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

        //console.log('コネクションrgba:', rgba);


            //console.log('type:', type);

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            connector:[ "Bezier", { curviness:curviness }],
            detachable:false,
           // paintStyle:{ lineWidth:10, strokeStyle:'rgba(0, 0, 200, 0.5)'},
            paintStyle:{ lineWidth:lineWidth, strokeStyle:rgba },
            hoverPaintStyle:{lineWidth:5 },
            overlays:[["Arrow", { width:12, length:12, location:0.85, id:"arrow",  direction:1 }]],
            parameters:{connId:connId, type:type}
        });

        jsPlumb.unmakeSource(conn.sourceId).unmakeTarget(conn.targetId);


        // 選択
        conn.bind("click", function(conn, e) {
            //console.log('リレーションモード:', isRelationMode);

            if(isRelationMode) {


                // 一旦削除して、新たに太い線をかく
                e.stopPropagation();

                if(isCtrl) {
                    var source = conn.source;
                    var target = conn.target;
                    var rgba = conn.paintStyleInUse["strokeStyle"];
                    var endpoints = conn.endpoints;
                    var connId = conn.getParameter('connId');
                    var type = conn.getParameter('type');

                    //console.log('選択されたコネクションID:', connId);

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var c = makeConnection(subject, object, type, rgba, connId, "selected");

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

                        var c = makeConnection(subject, object, type, rgba, connId);

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

                    var subject = source.attr('id');
                    var object = target.attr('id');

                    var c = makeConnection(subject, object, type, rgba, connId, "selected");

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

    //}

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
            var top = elem.get(0).offsetTop  + ins_area_offset_top - padding_top - h;
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
                                offset = -( margin + w) * (uniqueNum - 1);
                            } else {
                                offset = ( margin + w) * uniqueNum;
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
                                offset = -( margin + w) * (uniqueNum - 1);
                            } else {
                                offset = ( margin + w) * uniqueNum;
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


            // todo
            // ここでspanの上部にdivを描く?
            var div = '<div id="' + ins["id"] +'" class="instance ' + ins["type"] + ' ' + cate + '" style="position:absolute;left:' + posX + 'px; top:' + posY + 'px; width:' + w +'px; height:' + h + 'px; border-color:' + borderColor +'" ></div>';


            //var div = '<div id="' + ins["id"] +'" class="instance ' + ins["type"] + ' ' + cate + '" style="position:absolute;left:' + posX + 'px; top:' + posY + 'px; width:' + w +'px; height:' + h + 'px;" ></div>';
            $('#ins_area').append(div);


        }


    }

    function makeModification(modanns) {


        for(var i in modanns) {
            var mod = modanns[i];
            var type = mod["type"];
            var object = mod["object"];
            var id = mod["id"];

            if(object.substr(0,1) == "R") {
                // relationがmodificationされている
                jsPlumb.select().each(function(conn){
                    if(conn.getParameter("connId") == object){
                        if(type == "Negation") {
                            conn.setLabel("X");
                        } else if(type == "Speculation") {
                            conn.setLabel("?");
                        }
                    }
                });

            } else {
                // instanceがmodificationされている
                for(var j in insanns) {
                    var ins = insanns[j];
                    if(ins["id"] == object) {
                        if(type == "Negation") {
                            $('#' + object).html('<span class="mod_' + type + '">X</span>');
                        } else if(type == "Speculation") {
                            $('#' + object).html('<span class="mod_' + type + '">?</span>');
                        }

                    }
                }

            }

        }






    }




});

