$(document).ready(function() {

    /**
     * デバッグ用
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
     * 表示モード、初期値はviewモード
     */
    var mode = 'view';

    /*
     * annotationデータ
     */
    var spans;
    var spanIdx;

    var idxInstancesPerSpan;
    var idxPosition;

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
     * 選択されたコネクションオブジェクトの配列
     * connection objectが入ります
     */
    var selectedConns;

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
     * 接続用span要素
     */
    var sourceElem = null;
    var targetElem = null;

    /*
     * テーブル描画、及びデータ送信用
     * コネクションデータの配列
     * 新規作成で追加,　削除で削除
     */
    var relations;
    var relationIdx;
    var connectors;
    var connectorTypes;

    /*
     * 一時的に隠すコネクションデータ保存用
     */
    var tmpHidedRelations = new Array();

    /*
     * 線の透明度
     */
    var connOpacity = 0.5;

    // curvinessの掛け率
    var xrate = 0.6;
    var yrate = 0.05;

    // curvinessのオフセット
    var c_offset = 20;

    /*
     * instancesのデータ
     */
    var instances;
    var instanceIdx;

    var insWidth = 6; // 幅
    var insHeight = 6;  // 高さ
    var insBorder = 3;
    var insMargin = 2;


    /*
     * modannsのデータ
     */
    var modanns;

    /*
     * conf.txtより読み取る設定値
     */
    var delimiterCharacters;
    var nonEdgeCharacters;
    var spanTypes = new Object();
    var relationTypes = new Object();
    var instanceTypes = new Object();
    var modTypes = new Object();
    var spanTypeDefault = "";
    var relationTypeDefault = "";
    var instanceTypeDefault = "";
    var modTypeDefault = "";

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
     * doc_area
     */
    var doc_area = document.getElementById('doc_area').getBoundingClientRect();
    var doc_area_left = doc_area.left;
    var doc_area_top  = doc_area.top;

    /*
     * Notice
     */
    function showSource() {
        $('#notice').html("(source: " + targetUrl + ")");
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

        // read default configuration
        $.ajax({
            type: "GET",
            url: "conf.json",
            dataType: "json",
            async: false,
            success: function(data) {
                setConfig(data);
            },
            error: function() {
                alert("Could not read default configuration. Consult the administrator.");
            }
        });

        if(configUrl != "") {

            //console.log("config が指定されています");
            $.ajax({
                type: "GET",
                url: configUrl,
                dataType: "json",
                crossDomain: true,
                success: function(data) {
                    setConfig(data);
                    renderFrame();
                    getAnnotation();
                },
                error: function() {
                    alert('could not read the configuration from the location you specified.');
                }
            });
        } else {
            renderFrame();
            getAnnotation();
        }
    }


    // boundaryであるかどうか
    function searchBoundaryChar(char){
        return $.inArray(char, nonEdgeCharacters);
    }


    // delimiterであるかどうか
    function searchDelimitChar(char){
        return $.inArray(char, delimiterCharacters);
    }


    function renderFrame() {
        tableSpanTypes(spanTypes);
        tableRelationTypes(relationTypes);
        tableInstanceTypes(instanceTypes);
        tableModTypes(modTypes);
        initSlider();
    }


    /*
     * config
     */
    function setConfig(config){
        if (config['delimiter characters'] != undefined) {
            delimiterCharacters = config['delimiter characters'];
        }

        if (config['non-edge characters'] != undefined) {
            nonEdgeCharacters = config['non-edge characters'];
        }

        if (config['span types'] != undefined) {
            var span_types = config['span types'];
            for (var i in span_types) {
                spanTypes[span_types[i]["name"]] = span_types[i];
                if (span_types[i]["default"] == true) {spanTypeDefault = span_types[i]["name"];}
            }
            if (!spanTypeDefault) {spanTypeDefault = span_types[0]["name"];}
        }

        if (config['instance types'] != undefined) {
            var instance_types = config['instance types'];
            for (var i in instance_types) {
                instanceTypes[instance_types[i]["name"]] = instance_types[i];
                if (instance_types[i]["default"] == true) {instanceTypeDefault = instance_types[i]["name"];}
            }
            if (!instanceTypeDefault) {instanceTypeDefault = instance_types[0]["name"];}
        }

        if (config['relation types'] != undefined) {
            var relation_types = config['relation types'];
            for (var i in relation_types) {
                relationTypes[relation_types[i]["name"]] = relation_types[i];
                if (relation_types[i]["default"] == true) {relationTypeDefault = relation_types[i]["name"];}
            }
            if (!relationTypeDefault) {relationTypeDefault = relation_types[0]["name"];}
        }

        if (config['modification types'] != undefined) {
            var mod_types = config['modification types'];
            for (var i in mod_types) {
                modTypes[mod_types[i]["name"]] = mod_types[i];
                if (mod_types[i]["default"] == true) {modTypeDefault = mod_types[i]["name"];}
            }
            if (!modTypeDefault) {modTypeDefault = mod_types[0]["name"];}
        }

        if (config["css"] = undefined) {
            $('#css_area').html('<link rel="stylesheet" href="' + config["css"] + '"/>');
        }
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
     * jsPlumbの初期化
     */
    function initJsPlumb() {
        jsPlumb.reset();

        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.Defaults.Container = $("#rel_area");

        setConnectorTypes();
        console.log(jsPlumb);
    }


    function setConnectorTypes() {
        for (var name in relationTypes) {
            var color = relationTypes[name]["color"];
            var rgba0 = colorTrans(color, connOpacity);
            var rgba1 = colorTrans(color, 1);

            connectorTypes[name] = {paintStyle:{strokeStyle:rgba0, lineWidth:1}, hoverPaintStyle:{strokeStyle:rgba1, lineWidth:2}};
            connectorTypes[name+'_selected'] = {paintStyle:{strokeStyle:rgba1, lineWidth:2}, hoverPaintStyle:{ strokeStyle:rgba1, lineWidth:2}};
        }

        // jsPlumb.registerConnectionTypes(connectorTypes);
    }


    function getAnnotation() {
        if (!targetUrl) {
            if(sessionStorage.getItem('document') != null) {
                targetUrl = sessionStorage.getItem('targetUrl');
            }
        }

        if (targetUrl) {
            $.ajax({
                type: "GET",
                url: targetUrl,
                dataType: "json",
                crossDomain: true,
                success: function(annotation) {
                    if (annotation.text != undefined) {
                        loadAnnotation(annotation);
                        initIndexAnnotation();
                        initialize();
                        initJsPlumb();
                        renderAnnotation();
                        showSource();
                        changeMode("view");
                    } else {
                        alert("read failed.");
                    }
                },
                error: function(res, textStatus, errorThrown){
                    alert("connection failed.");
                }
            });
        }
    }


    function initialize() {
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

        selectedConns = new Array();
        connectorTypes = new Object();

        changeButtonState($('#undo_btn'), undoNameArray);
        changeButtonState($('#redo_btn'), redoNameArray);

        tmpHidedRelations = new Array();
    }


    /*
     * prepare annotation
     */
    function loadAnnotation(data) {
        // load annotation
        var doc = data.text;
        $("#src_area").html(doc);

        if(data.catanns != undefined) {
            spans = data.catanns;
        } else {
            spans = new Array();
        }

        if(data.insanns != undefined) {
            instances = data.insanns;
        } else {
            instances = new Array();
        }

        if(data.relanns != undefined) {
            relations = data.relanns;
        } else {
            relations = new Array();
        }

        if(data.modanns != undefined) {
            modanns = data.modanns;
        } else {
            modanns = new Array();
        }

        // storageに格納
        sessionStorage.clear();
        sessionStorage.setItem('document', doc);
        sessionStorage.setItem('targetUrl', targetUrl);
        saveCurrent("catanns_insanns_relanns_modanns");
    }


    function initIndexAnnotation () {
        spanIdx = new Object();
        instanceIdx = new Object();
        relationIdx = new Object();

        indexSpans(spans);
        indexInstances(instances);
        indexRelations(relations);

        idxInstancesPerSpan = new Object();
        indexInstancesPerSpan(instances);

        connectors = new Object();
    }

    function initIndexPositions() {
        idxPosition = new Object();
        indexSpanPositions(spans);
        indexInstancePositions(spans); // note that this function takes spans not instances.
    }

    function indexSpans (spans) {
        for (var i = 0; i < spans.length; i++) {spanIdx[spans[i]['id']] = spans[i];}
    }

    function indexInstances (instances) {
        for (var i = 0; i < instances.length; i++) {instanceIdx[instances[i]['id']] = instances[i];}
    }


    function indexRelations (relations) {
        for (var i = 0; i < relations.length; i++) {relationIdx[relations[i]['id']] = relations[i];}
    }

    function indexInstancesPerSpan (instances) {
        for (var i in spanIdx) {idxInstancesPerSpan[i] = new Array();}
        for (var i = 0; i < instances.length; i++) {
            idxInstancesPerSpan[instances[i]["object"]].push(instances[i]["id"]);
        }
    }

    function indexSpanPositions(spans) {
        for (var i = 0; i < spans.length; i++) {
            var id = spans[i]["id"];
            var span = $('#' + id);
            // console.log(spanId);

            var spanTop = span.get(0).offsetTop;
            var spanLeft = span.get(0).offsetLeft;
            var spanWidth = span.outerWidth();
            var spanHeight = span.outerHeight();
            idxPosition[id] = {};
            idxPosition[id]["top"] = spanTop;
            idxPosition[id]["bottom"] = spanTop + spanHeight;
            idxPosition[id]["center"] = spanLeft + spanWidth/2;
        }
    }

    function indexInstancePositions(spans) {
        for(var k = 0; k < spans.length; k++) {
            var s = spans[k]["id"]; // span (id)
            if (idxInstancesPerSpan[s] == undefined) {idxInstancesPerSpan[s] = new Array()}
            var is = idxInstancesPerSpan[s]; // instances
            var num = is.length;

            for (var j = 0; j < num; j++) {
                var i = is[j]; // instance (id)
                var offset;
                var p = j + 1;
                if(p % 2 == 0) {
                    offset = -(insMargin + insWidth + insBorder) * Math.floor(p/2);
                } else {
                    offset = +(insMargin + insWidth + insBorder) * Math.floor(p/2);
                }
                if (num % 2 == 0) {offset += (insWidth / 2 + insBorder);}

                idxPosition[i] = {};
                idxPosition[i]["top"]    = idxPosition[s]["top"] - insHeight - insBorder * 2;
                idxPosition[i]["center"] = idxPosition[s]["center"] - insWidth/2 - insBorder + offset;
            }
        }
    }

    function renderAnnotation() {
        renderSpans(spans);
        initIndexPositions();
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);

        // for(var i = 0; i < relations.length; i++) {
        //     addDistanceToRelation(relations[i]);
        // }
        // sortConnByDistance(relations);
        // sortRelationsBySize(relations);

        // render relations
        // for(var j in relations) {
        //     var rel = relations[j];
            // if (relationTypes[rel['type']] == undefined) {
            //     relationTypes[rel['type']] = {};
            //     relationTypes[rel['type']]['name'] = rel['type'];
            //     relationTypes[rel['type']]['color'] = '#FF0000';
            //     alert("unknown relation, " + rel['type'] + ", will be rendered in red.");
            // } 
        //     var color = relationTypes[rel['type']]['color'];
        //     var rgba = colorTrans(color);
        //     makeConnection(rel['subject'], rel['object'], rel['type'], rgba, rel['id'], "unselected");
        // }

        // addModtypeColor(modTypes);
    }


    function addDistanceToRelation(conn) {
        var sId = conn['subject'];
        var tId = conn['object'];

        sourceElem = $('#' + sId);
        targetElem = $('#' + tId);

        var sourceX = sourceElem.get(0).offsetLeft + sourceElem.outerWidth()/2;
        var targetX = targetElem.get(0).offsetLeft + targetElem.outerWidth()/2;

        // var sourceY = sourceElem.get(0).offsetTop;
        // var targetY = targetElem.get(0).offsetTop;

        var distance = sourceX - targetX;
        conn['distance'] = distance;
    }

    function sortConnByDistance(relations) {
        function compare(a, b) {
            return(b['distance'] - a['distance']);
        }
        relations.sort(compare);
    }

    function indexRelationSize(relations) {
        for (var i = 0; i < relations.length; i++) {
            var sourceX = idxPosition[relations[i]['subject']]["center"];
            var targetX = idxPosition[relations[i]['object']]["center"];
            relations[i]["size"] = Math.abs(sourceX - targetX);
        }
    }

    function sortRelationsBySize(relations) {
        function compare(a, b) {
            return (b['size'] - a['size']);
        }
        relations.sort(compare);
    }


    /*
     * spanの表示順番でjsonのソート
     */
    function sortSpans(spans) {
        function compare(a, b) {
            return((a['span']['begin'] - b['span']['begin']) || (b['span']['end'] - a['span']['end']));
        }
        spans.sort(compare);
    }


    /*
     * 現状の保存
     */
    function saveCurrent(name) {
        saveUndoNameStorage(name);

        var names = name.split('_');

        // redoNameを空にする
        redoNameArray.length = 0;

        for(var i = 0; i < names.length; i++) {
            if(names[i] == "catanns") {
                redoCatannsArray.length = 0;

                if(spans != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentCatanns') != null && sessionStorage.getItem('currentCatanns') != "undefined") {
                        //console.log('以前のcatannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }

                    sessionStorage.setItem('currentCatanns', JSON.stringify(spans));
                }
            } else if(names[i] == "insanns") {
                redoInsannsArray.length = 0;

                if(instances != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentInsanns') != null && sessionStorage.getItem('currentInsanns') != "undefined") {
                        //console.log('以前のinsannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }
                    sessionStorage.setItem('currentInsanns', JSON.stringify(instances));
                }

            } else if(names[i] == "relanns") {
                redoRelannsArray.length = 0;

                if(relations != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentRelanns') != null && sessionStorage.getItem('currentRelanns') != "undefined") {
                        //console.log('以前のrelannsを取り出します');
                        var prev = loadCurrent(names[i]);
                        saveUndoStorage(prev, names[i]);
                    }
                    sessionStorage.setItem('currentRelanns', JSON.stringify(relations));
                }

            } else if(names[i] == "modanns") {
                redoModannsArray.length = 0;

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
        selectedIds.length = 0;
        selectedInstanceIds.length = 0;
        selectedModificationIds.length = 0;

        doUndo();
        return false;
    });

    /*
     * click redo button
     */
    $('#redo_btn').click(function(e) {
        // 選択状態は解除
        selectedIds.length = 0;
        selectedInstanceIds.length = 0;
        selectedModificationIds.length = 0;

        doRedo();
        return false;
    });

    /*
     * Undo
     */
    function doUndo() {
        undoNameArray = JSON.parse(sessionStorage.getItem('undoName'));
        var undoName = undoNameArray.pop();

        // popしたものを戻す
        sessionStorage.setItem('undoName', JSON.stringify(undoNameArray));

        // redoに操作名を保存
        saveRedoNameStorage(undoName);

        var names = undoName.split('_');

        for(var i in names) {
            var name = names[i];

            if(name == "catanns") {

                saveRedoStorage(spans, name);

                undoCatannsArray = JSON.parse(sessionStorage.getItem('undoCatanns'));

                spans  = undoCatannsArray.pop();
                indexSpans(spans);

                sessionStorage.setItem('currentCatanns', JSON.stringify(spans));
                // popしたものを戻す
                sessionStorage.setItem('undoCatanns', JSON.stringify(undoCatannsArray));

            } else if(name == "relanns") {

                saveRedoStorage(relations, name);

                undoRelannsArray = JSON.parse(sessionStorage.getItem('undoRelanns'));

                relations = undoRelannsArray.pop();
                indexRelations(relations);

                sessionStorage.setItem('currentRelanns', JSON.stringify(relations));
                // popしたものを戻す
                sessionStorage.setItem('undoRelanns', JSON.stringify(undoRelannsArray));

            } else if(name == "insanns") {

                saveRedoStorage(instances, name);

                undoInsannsArray = JSON.parse(sessionStorage.getItem('undoInsanns'));

                instances = undoInsannsArray.pop();
                indexInstances(instances);
                indexInstancesPerSpan(instances);

                sessionStorage.setItem('currentInsanns', JSON.stringify(instances));
                // popしたものを戻す
                sessionStorage.setItem('undoInsanns', JSON.stringify(undoInsannsArray));

            } else if(name == "modanns") {

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


        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
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
                spans  = redoCatannsArray.pop();

                //console.log('--もどしたspans:', spans);

                if(spans != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentCatanns') != null && sessionStorage.getItem('currentCatanns') != "undefined") {
                        //console.log('以前のcatannsを取り出します');
                        var prev = loadCurrent("catanns");
                        saveUndoStorage(prev, name);
                    }

                    sessionStorage.setItem('currentCatanns', JSON.stringify(spans));

                    // popしたものを戻す
                    sessionStorage.setItem('redoCatanns', JSON.stringify(redoCatannsArray));
                }

            } else if(name == "relanns") {
                //console.log(name,'を操作しました');
                redoRelannsArray = JSON.parse(sessionStorage.getItem('redoRelanns'));
                relations = redoRelannsArray.pop();

                if(relations != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentRelanns') != null && sessionStorage.getItem('currentRelanns') != "undefined") {
                        //console.log('以前のrelannsを取り出します');
                        var prev = loadCurrent("relanns");
                        saveUndoStorage(prev, name);
                    }
                    sessionStorage.setItem('currentRelanns', JSON.stringify(relations));

                    // popしたものを戻す
                    sessionStorage.setItem('redoRelanns', JSON.stringify(redoRelannsArray));
                }

            } else if(name == "insanns") {
                //console.log(name,'を操作しました');
                redoInsannsArray = JSON.parse(sessionStorage.getItem('redoInsanns'));
                instances = redoInsannsArray.pop();

                if(instances != undefined) {
                    //前の状態を取り出して、それをundoStorageに保存する
                    if(sessionStorage.getItem('currentInsanns') != null && sessionStorage.getItem('currentInsanns') != "undefined") {
                        //console.log('以前のinsannsを取り出します');
                        var prev = loadCurrent("insanns");
                        saveUndoStorage(prev, name);
                    }
                    sessionStorage.setItem('currentInsanns', JSON.stringify(instances));

                    // popしたものを戻す
                    sessionStorage.setItem('redoInsanns', JSON.stringify(redoInsannsArray));
                }

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
            }
        }

        //sessionStorage.setItem('redo', JSON.stringify(redoArray));

        if(undoNameArray.length == 0) {
            $('#redo_btn').prop("disabled", true);
            $('#redo_btn').css('opacity', 0.3);
        }

        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
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
     * Category リストの作成
     */
    function tableSpanTypes(spanTypes) {
        var html = '<form><table>';
        html += '<tr><th colspan="2">Span Types</th>';

        for(var s in spanTypes) {
            var uri = spanTypes[s]["uri"];

            html += '<tr style="background-color:' + spanTypes[s]["color"]  + '">';

            if (s == spanTypeDefault) {
                html += '<td><input type="radio" name="category" class="category_radio" checked title="default type"></td>';
            } else {
                html += '<td><input type="radio" name="category" class="category_radio"></td>';
            }

            html += '<td class="category_apply_btn">' + s  + '</td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';
        }

        html += '</table></form>';
        $('#span_types').html(html);
    }


    /*
     * Relation Categoryリストの作成
     */
    function tableRelationTypes (relationTypes) {
        var html = '<form><table>';
        html += '<tr class="hide_all_checkbox">' +
            '<th colspan="2">Relation Types</th>' +
            '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="all" checked></td>' +
            '</tr>';

        for (var r in relationTypes) {
            var uri = relationTypes[r]["uri"];
            var color = relationTypes[r]["color"];

            html += '<tr style="background-color:' + color  + '">';

            if(r == relationTypeDefault) {
                html += '<td><input type="radio" name="relation" class="relation_radio" checked title="default type"></td>';
            } else {
                html += '<td><input type="radio" name="relation" class="relation_radio"></td>';
            }

            html += '<td class="relation_apply_btn">' + r  + '</td>';
            html += '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="show/hide" checked></td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';

            var obj = new Object();
            obj[r] = {paintStyle:{strokeStyle:color, lineWidth:2}};
            jsPlumb.registerConnectionTypes(obj);
        }

        html += '</table></form>';

        $('#relation_types').html(html);
    }


    /*
     * Instance Typeリストの作成
     */
    function tableInstanceTypes(instanceTypes) {
        var html = '<form><table><tr class="hide_all_checkbox">' +
            '<th colspan="2">Instance Types</th>' +
            '<td><input type="checkbox" name="instype_hide" class="instype_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var i in instanceTypes) {
            var uri = instanceTypes[i]["uri"];

            html += '<tr style="background-color:' + instanceTypes[i]["color"]  + '">';

            if (i == instanceTypeDefault) {
                html += '<td><input type="radio" name="instype" class="instype_radio" checked title="default type"></td>';
            } else {
                html += '<td><input type="radio" name="instype" class="instype_radio"></td>';
            }

            html += '<td class="instype_apply_btn">' + i  + '</td>';
            html += '<td><input type="checkbox" name="instype_hide" class="instype_hide" title="show/hide" checked></td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';
        }

        html += '</table></form>';

        $('#instype_list').html(html);
    }


    /*
     * Modification Typeリストの作成
     */
    function tableModTypes(modTypes) {
        var html = '<form><table><tr class="hide_all_checkbox">' +
            '<th colspan="2">Modification Types</th>' +
            '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var m in modTypes) {
            var uri = modTypes[m]["uri"];

            html += '<tr style="background-color:' + modTypes[m]["color"] + '">'

            if (m == modTypeDefault) {
                html += '<td><input type="radio" name="modtype" class="modtype_radio" checked title="default type"></td>';
            } else {
                html += '<td><input type="radio" name="modtype" class="modtype_radio"></td>';

            }

            html += '<td class="modtype_apply_btn">' + m  + '</td>';
            html += '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="show/hide" checked></td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';
        }

        html += '</table></form>';

        $('#modtype_list').html(html);
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
    function renderSpans(spans) {
        // かならず数字順
        sortSpans(spans);

        $("#doc_area").html($("#src_area").html());

        var origNode = document.getElementById("doc_area").childNodes[0];

        // 各アノテーションに対して、範囲とアノテーションを取得し、
        // それを<span>タグに直して表示する
        // annJson: アノテーションJson
        // beforeNode: spanタグで分割するノード
        // splitPos: ノードの中で文字列を分割する位置
        function makeSpan(spans, beforeNode, maxEndPos) {
            var lastStartPos = 0;
            var lastEndPos = 0;

            $.each(spans, function(i, ann) {

                // ここがプラスの場合
                // 一番上の親の連続したマークになる
                if(ann['span']['begin'] - maxEndPos >= 0) {

                    var afterNode = beforeNode.splitText(ann['span']['begin'] - maxEndPos);
                    //console.log("afterNode:", afterNode); // 分割点より後のテキスト
                    //console.log("beforeNode:", beforeNode);  // 分割点より前のテキスト

                    // range文字列の長さ
                    var len = ann['span']['end'] - ann['span']['begin'];
                    // console.log('len:', ann['end'], '-', ann['begin'], '=',len)

                    var range = document.createRange();
                    range.setStart(afterNode, 0);
                    range.setEnd(afterNode, len);

                    var label = ann['category'];
                    var id = ann['id'];

                    // spanタグで囲んだ部分を分割
                    var newNode = afterNode.splitText(len);

                    var span = document.createElement("span");
                    span.setAttribute('class', label);
                    span.setAttribute('id', id);
                    span.setAttribute('title', '[' + id + '] ' + label);
                    if (spanTypes[label]["region"] != true) {
                        span.setAttribute('style', 'white-space:pre');
                    }

                    range.surroundContents(span);

                    // 切り取った長さ
                    maxEndPos = ann['span']['end'];

                    beforeNode = newNode;

                    // 最後に追加したspan要素
                    lastStartPos = ann['span']['begin'];
                    lastEndPos = ann['span']['end'];

                } else {
                    //console.log("****************直前のjsonノードの中に子供spanとして存在する*********");
                    // マイナスの場合は
                    // 直前のjsonノードの中に子供spanとして存在する
                    var baseNode = document.getElementById("doc_area");

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

        makeSpan(spans, origNode, 0);


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
            $('#notice').html(notice);
        }

        // 不完全要素を空にする
        partialIds.splice(0, partialIds.length);

        /*
         * textにcategoryに対応する色をつけます
         * function addCategoryColor(spanTypes)
         */
        for(var s in spanTypes) {
            $('span.' + s).css('background-color', spanTypes[s]["color"]);
        }
    }


    /*
     * instanceの枠にcategoryに対応する色をつけます
     */
    function addInstanceBorderColor(elem, spanTypes) {
        for (var s in spanTypes) {
            if (elem.hasClass(s)) {
                elem.css('border-color', spanTypes[s]["color"]);
                break;
            }
        }
    }


    /*
     * modification listにmodtypeに対応する色をつけます
     */
    function addModtypeColor(modTypes) {
        for(var m in modTypes) {
            $('.mod_' + m).css('color', modTypes[m]['color']);
        }
    }


    /*
     * Categoryのデフォルト値の変更
     */
    $('.category_radio').live('change', function() {
        spanTypeDefault = $(this).parent().next().text();
    });

    /*
     * Relation Categoryのデフォルト値の変更
     */
    $('.relation_radio').live('change', function() {
        relationTypeDefault = $(this).parent().next().text();
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

                // tmpHidedrelationsに移動
                for(var i in conns) {

                    //console.log('rel_type:', conns[i].type);
                    if(conns[i]["type"] == relType) {

                        var connId = conns[i]["id"];
                        var endpoints = conns[i]["endpoints"];

                        tmpHidedRelations.push(conns[i]);

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

                    tmpHidedRelations.push(conns[i]);

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
            renderModifications(modanns);

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
        }
    })

    /*
     * spanをクリック
     */
    function clickSpan(e) {
        e.preventDefault();
        //console.log('click span');
        //console.log('shiftキーが押されている:', e.shiftKey);

        // 下に重なってる要素のclickイベントを解除
        $('#doc_area span').unbind('click',arguments.callee);

        if(mode == "relation") {
            // relation mode
            var id = $(this).attr('id').split('_')[1];

            if(sourceElem == null) {
                // source element is chosen
                sourceElem = $('#' + id);
                sourceElem.addClass('source_selected');
            } else {
                // target element is chosen
                targetElem = $('#' + id);

                // 選択されているものは、選択をはずす
                deselectConnection();

                // connection作成
                var newrel = new Object();

                newrel.id = "R" + (getMaxConnId() + 1);
                newrel.subject = sourceElem.attr('id');
                newrel.object = targetElem.attr('id');
                newrel.type = relationTypeDefault;
                relations.push(newrel);
                indexRelations([newrel]);

                // focus control
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

                        addInstanceBorderColor($('#id'), spanTypes);
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
                            addInstanceBorderColor($(this), spanTypes);
                        }
                    });

                    sourceElem = null;
                    targetElem = null;
                }

                saveCurrent("relanns");
                renderRelations(relations);
            }

        } else if(mode == "edit") {
            // span編集モード

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
                }
            } else if(isShift && selectedIds.length == 1) {
                //console.log('shiftが押されています');
                // shiftが押されている
                var firstId = selectedIds.pop();
                var secondId = $(this).attr('id');

                // 一旦、元に戻す
                $('#doc_area span').removeClass('selected').removeClass('partialSelected');

                // selectedを削除して、class指定が空になった要素はclass="noCategoy"にする
                //$('#doc_area span[class=""]').addClass('noCategory');
                // 一旦空にする
                selectedIds.splice(0, selectedIds.length);

                sortSpans(spans);

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

                deselect();

            } else {

                // ctrl, shiftが押されていない場合
                $('#doc_area span').removeClass('selected').removeClass('partialSelected');

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

                // 選択された用素のdoc_area内での順番
                sortSpans(spans);
                for(var i = 0; i <spans.length; i++) {
                    if(spans[i]['id'] == selectedId) {
                        selectedIdOrder = i;
                    }
                }
            }
            //setCurrentStorage(spans);
        }
        return false;
    }


    function deselectConnection() {
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

            makeConnection(subject, object, relationTypeDefault, rgba, connId, "unselected");

        }

        selectedConns.length = 0;
    }


    /*
     * 右クリックで合体
     */
    $('#doc_area span').live('contextmenu', function(e){
        //console.log('右クリック');

        if (mode == "relation") {
           // relationモード

        } else if (mode == "edit") {

            if (selectedIds.length == 1) {
                var firstSpanId = selectedIds.shift();
                var secondSpanId = $(this).attr('id');
                var firstParentId = $('span#' + firstSpanId).parent().attr('id');
                var secondParentId = $(this).parent().attr('id');

                if (firstParentId == secondParentId && firstSpanId != secondSpanId) {
                    //console.log('合体');

                    // 選択されたspanのidを保存
                    var firstSpan  = spanIdx[firstSpanId];    // 最初に選択された要素
                    var secondSpan = spanIdx[secondSpanId];   // 右クリックで選択された要素

                    var i;
                    var len = spans.length - 1 ;

                    if (firstSpan['span']['end'] < secondSpan['span']['end']) {
                        // 最初の要素が前にある場合
                        firstSpan['span']['end'] = secondSpan['span']['end'];
                    } else {
                        // 最初の要素が後ろにある場合
                        firstSpan['span']['begin'] = secondSpan['span']['begin'];
                    }

                    for (i = len; i >= 0; i--) {
                        // 2番目に選択された要素を削除
                        if (spans[i]['id'] == secondSpanId) {

                            // このspan要素に関するinsatnceのobjectを1番目の要素に変更する
                            for (var j in instances) {
                                var ins = instances[j];
                                if (ins["object"] == spans[i]['id']) {
                                    ins["object"] = firstSpanId;
                                    spanIdx[firstSpanId]['numInstances']++;
                                }
                            }

                            // このspan要素に関するrelationのobjectまたはsubjectを1番目の要素に変更する
                            for (var j in relations) {
                                var conn = relations[j];
                                if (conn["subject"] == spans[i]['id']) {
                                    conn["subject"] = firstSpanId;
                                }
                                if (conn["object"] == spans[i]['id']) {
                                    conn["object"] = firstSpanId;
                                }
                            }

                            delete spanIdx[spans[i]['id']];
                            spans.splice(i, 1);
                            break;
                        }
                    }

                    saveCurrent("catanns_insanns_relanns")

                    renderSpans(spans);
                    indexSpanPositions(spans);
                    indexInstancePositions(spans);
                    renderInstances(instances);
                    renderRelations(relations);
                    renderModifications(modanns);

                    selectedIds.push(firstSpanId);
                    $('span#' + firstSpanId).addClass('selected');

                } else {
                    alert("Cannot merge spans when there are more than one spans selected.");
                }
            }
        }
        return false;
    });


    /*
     * 選択を解除
     */
    function cancelSelect(event) {
        // ctrlまたはshiftが押されていないければ
        //console.log(event.target);
        //console.log('createCount:', createCount);
        // console.log('cancel Select');

        if(!isCtrl || !isShift) {

            if(mode == "relation") {

                //console.log('cancel Select in relation');
                // relationモード
                sourceElem = null;
                targetElem = null;

                $('#doc_area span').removeClass('source_selected');

                // instanceの枠の色を元に戻す
                $('div.instance').map(function() {
                    if($(this).hasClass('ins_selected')){
                        $(this).removeClass('ins_selected');
                        addInstanceBorderColor($(this), spanTypes);
                    }
                });

                // modificationの非選択
                if(selectedModificationIds.length > 0) {
                    selectedModificationIds.splice(0, selectedModificationIds.length);
                    unselectModification();
                    addModtypeColor(modTypes);
                }

                // 空にする
                selectedConns.length = 0;
                renderRelations(relations);
            } else if(mode == "edit") {
                // span編集モード

                //console.log("span編集モード選択解除:", $(this));
                //console.log('selectedModificationIds.length:', selectedModificationIds.length);

                //selectedModificationIds.splice(0, selectedModificationIds.length);
                if(selectedModificationIds.length > 0) {
                    unselectModification();
                    addModtypeColor(modTypes);
                }

                // 空にする
                selectedIds.splice(0, selectedIds.length);
                selectedInstanceIds.splice(0, selectedInstanceIds.length);

                $('#doc_area span').removeClass('selected').removeClass('partialSelected');

                // instanceの枠の色を元に戻す
                $('div.instance').map(function() {
                    if($(this).hasClass('ins_selected')){
                        $(this).removeClass('ins_selected');
                        addInstanceBorderColor($(this), spanTypes);
                    }
                });
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
                    addInstanceBorderColor($(this), spanTypes);
                }
            });

        }
    }


    /*
     * マウスドラッグ時の開始位置の調整
     */
    function validateStartDelimiter(startPosition) {
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

            if(spans != undefined) {

                // 位置取得
                var selection = window.getSelection();

                // 文字列が選択されていると、isCollapsed == false
                if(!selection.isCollapsed) {

                    var range = selection.getRangeAt(0);
                    var anchorRange = document.createRange();
                    anchorRange.selectNode(selection.anchorNode);

                    // 選択されたテキストが属するノード
                    // 選択されたテキストより前にHTMLタグがある場合は、それ以降になる。
                    var nodeTxt = selection.anchorNode.textContent;

                    var parentNode = selection.anchorNode.parentNode;
                    //console.log('親ノード:', parentNode);

                    var r = document.createRange();

                    var range = selection.getRangeAt(0);

                    // anchorNodeの親ノードとfocusNodeの親ノードが同じidなら
                    // 新たにマークするか、あるいはマーク内にさらにマークである
                    if( selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {

                        if(!isCtrlAlt) {
                            // 新規マーク作成
                            //console.log('新規マーク');
                            createElement(spans, selection);
                        } else {

                            //if(selected != null) {
                            if(selectedIds.length == 1) {
                                // 選択があり、さらにCtrl + Alt キーが押された状態で、anchorNodeまたはfocusNodeがselect上にある場合は
                                // 切り離すまたは削除

                                var selectedId = selectedIds.pop();
                                if(selectedId == selection.anchorNode.parentElement.id || selectedId == selection.focusNode.parentElement.id) {
                                    // anchorNodeまたはfocusNodeが選択された要素上にあるので
                                    //console.log('切り離し');
                                    separateElement(spans, selection, selectedId);
                                    //selected = null;
                                } else {
                                    // selectionに選択要素のNodeが完全に入っているか
                                    if(selection.containsNode($('span#' + selectedId).get(0).childNodes[0], true)) {
                                        // ドラッグした領域が選択された要素の範囲を越えているので削除
                                        //console.log('削除');
                                        removeElement(spans, selection, selectedId);
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
                                    createElement(spans,selection);
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
                                    createElement(spans,selection);
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
                                    //var anchorEndPosition = spans[selection.anchorNode.parentElement.id]['end'];

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
                                    createElement(spans, selection);
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
                                    createElement(spans,selection);
                                }

                            }


                            if(selectedIds.length == 1) {
                                var selectedId = selectedIds.pop();
                                if(selectedId == selection.focusNode.parentElement.id) {

                                    // 縮める、伸ばす
                                    //console.log('縮める');
                                    shortenElement(spans, selection, selectedId);
                                    //} else if(selected.attr('id') == selection.anchorNode.parentElement.id) {
                                } else if(selectedId == getSelectedIdByAnchorNode($('span#' + selectedId), selection.anchorNode)) {
                                    //console.log('伸ばします');
                                    extendElement(spans, selection, selectedId);
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
                            separateElement(spans, selection, selectedId);
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
            mode = "view";

            $('#always_multiple_btn').prop('disabled', false);

            $('#doc_area span').die('click', clickSpan);

            $('div.instance').die('click', selectInstance);

            $('#doc_area').die('mouseup',  doMouseup);

            unsetCancelSelect();

            changeMode(mode);
        } else {
            mode = "edit";

            // relationボタンをオフ
            if($('#relation_btn').attr('src') == 'images/relation_on_btn.png') {
                $('#relation_btn').attr('src', 'images/relation_off_btn.png');
            }
            $('#always_multiple_btn').prop('disabled', false);

            setCancelSelect();

            changeMode(mode);
        }
        return false;
    })


    /*
     * span idの最大値を求める
     * spn idの形は T+数字
     */
    function getSpanMaxId() {
        var numId = 0;
        for(i in spans){
            if(parseInt(spans[i]["id"].slice(1)) > numId){
                numId = parseInt(spans[i]["id"].slice(1));
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
        for(var i in relations){
            if(parseInt(relations[i]["id"].slice(1)) > numId){
                numId = parseInt(relations[i]["id"].slice(1));
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
        for(var i in instances){
            if(parseInt(instances[i]["id"].slice(1)) > numId){
                numId = parseInt(instances[i]["id"].slice(1));
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
    function createElement(spans, selection) {
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

        if (absoluteAnchorPosition > absoluteFocusPosition) {
            tmpPos = absoluteAnchorPosition;
            absoluteAnchorPosition = absoluteFocusPosition;
            absoluteFocusPosition = tmpPos;
        }

        var startPosition = validateStartDelimiter(absoluteAnchorPosition);
        var endPosition = validateEndDelimiter(absoluteFocusPosition);

        // 不完全要素
        var partialElem = new Array();

        // idの最大値
        var maxId = getSpanMaxId();

        // spansに追加
        if (isMultiple) {
            // 選択された要素以外で、新たに作られた要素はaryになる
            var ary = findSameString(startPosition, endPosition, spanTypeDefault, spans);

            for(var i = 0; i < ary.length; i++) {

                var isAcross = false;

                // ここでjsonのbeginとendが他のjsonにまたがっていないかチェックする
                for(j in spans) {
                    if(ary[i]['span']['begin'] > spans[j]['span']['begin'] && ary[i]['span']['begin'] < spans[j]['span']['end'] && ary[i]['span']['end'] > spans[j]['span']['end'] ) {
                        // 開始位置がまたがっているので、不完全要素
                        isAcross = true;
                        ary[i]['span']['begin'] = validateStartDelimiter(spans[j]['span']['end']);
                        partialElem.push(ary[i]);
                        break;
                    } else if(ary[i]['span']['begin'] < spans[j]['span']['begin'] && ary[i]['span']['end'] > spans[j]['span']['begin'] && ary[i]['span']['end'] < spans[j]['span']['end']) {
                        // 終了位置がまたがっているので、不完全要素
                        ary[i]['span']['end'] = validateEndDelimiter(spans[j]['span']['begin']);
                        partialElem.push(ary[i]);
                        isAcross = true;
                        break;
                    }
                }

                if(!isAcross) {
                    maxId = maxId + 1;
                    ary[i]['id'] = "T" + maxId;
                    spans.push(ary[i]);
                }
            }
        }

        var obj = new Object();
        obj['span'] = {"begin": startPosition, "end": endPosition};
        //obj['begin'] = startPosition;
        //obj['end'] = endPosition;
        obj['category'] = spanTypeDefault;
        obj['new'] = true;

        maxId = maxId + 1;
        obj['id'] = "T" + maxId;

        spans.push(obj);

        // 一旦数字でソート
        sortSpans(spans);

        // 一旦空にする
        selectedIds.splice(0, selectedIds.length);

        for (var i in spans) {

            if (spans[i]['new']) {
                // 選択状態にする
                //console.log('選択されたのは:', spans[i]['id']);
                selectedIds.push(spans[i]['id']);
                //selectedElements.push(spans[i]);
            }

            for (var j in partialElem) {
                if (spans[i]['new'] && spans[i]['span']['begin'] == partialElem[j]['span']['begin'] && spans[i]['span']['end'] == partialElem[j]['span']['end'] && spans[i].category == partialElem[j].category) {
                    //console.log("不完全要素は：", i);
                    // 選択状態にする
                    partialIds.push(i);
                }
            }

            // new プロパティを削除
            delete spans[i]['new']
        }

        saveCurrent("catanns");

        indexSpans(spans);
        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
    }

    function unsetCancelSelect() {
        //console.log('unsetCancelSelect ');
        $("#joint_area, #notice_ok_btn,  #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification").die("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        // 選択解除
        $("*:not(#joint_area, #notice_ok_btn, #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification)").die("click", cancelSelect);
    }


    function setCancelSelect() {
        //console.log('setCancelSelect ');
        $("#joint_area, #notice_ok_btn,  #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification").die("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        $("#joint_area, #notice_ok_btn,  #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification, table.modification, table.modification tr td, table.modification tr td div").live("click", function(event){
                // eventの伝搬を止める
                event.stopPropagation();
            });

        // 選択解除
        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification)").die("click", cancelSelect);



        $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, .editable, td.category_apply_btn, td.relation_apply_btn, " +
            "img, form, #load_dialog, #load_btn, :button, :text, :input, " +
            "div.instance, " +
            "#ins_area div span.modification)").live("click", cancelSelect);
    }


    /*
     * マークを伸ばす
     */
    function extendElement(spans, selection, selectedId) {
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

                sortSpans(spans);
            }
        }

        saveCurrent("catanns");

        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
    }

    /*
     * マークを縮める
     */
    function shortenElement(spans, selection, selectedId) {

        sortSpans(spans);

        selectedIds.push(selectedId);

        var range = selection.getRangeAt(0);

        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        //console.log('selection.compareBoundaryPoints', range.compareBoundaryPoints(Range.START_TO_START, focusRange));
        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。

        var i;
        var len = spans.length - 1;

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
                saveCurrent("catanns");
            } else {
                // 結果的に削除
                //console.log('結果的に削除');

                for(i = len; i >= 0; i--) {
                    if(spans[i]['id'] == selectedId) {

                        // このspanに関連するinstance, relation, modificationを削除
                        deleteInstanceAndRelationAndModificationFromSpan(spans[i]['id']);

                        delete spanIdx[spans[i]['id']];
                        spans.splice(i, 1);
                        selectedIds.pop();
                        break;
                    }
                }

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
                findJson(selection.focusNode.parentNode.id)['span']['begin'] = startPosition;
                saveCurrent("catanns");
            } else {
                // 結果的に削除
                for(i = len; i >= 0; i--) {
                    if(spans[i]['id'] == selectedId) {

                        // このspanに関連するinstance, relation, modificationを削除
                        deleteInstanceAndRelationAndModificationFromSpan(spans[i]['id']);

                        delete spanIdx[spans[i]['id']];
                        spans.splice(i, 1);
                        selectedIds.pop();
                        break;
                    }
                }
                saveCurrent("catanns_insanns_relanns_modanns");
            }
        }

        indexSpans(spans);
        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
    }

    /*
     * マークを分割する
     */
    function separateElement(spans, selection, selectedId) {
        sortSpans(spans);

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

        //if(absoluteAnchorPosition == spans[selectedId]['begin'] ||  absoluteFocusPosition == spans[selectedId]['end']) {
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
                    //spans[selection.anchorNode.parentElement.id]['begin'] = startPosition;
                    selectedJson['span']['begin'] = startPosition;
                }

            } else if(absoluteFocusPosition == selectedJson['span']['end']) {

                //var newEnd = spans[selection.anchorNode.parentElement.id]['begin'] + startPos;
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
                //spans[selection.anchorNode.parentElement.id]['end'] = separatedEndPos;
                selectedJson['span']['end'] = separatedEndPos;

                var maxId = getSpanMaxId();
                maxId = maxId + 1;
                // 新しいjsonを追加
                var obj = new Object();
                obj['span'] = {"begin": newStartPosition, "end": newEndPosition};
                //obj['begin'] = newStartPosition;
                //obj['end'] = newEndPosition;
                obj['category'] = newLabel;
                obj['created_at'] = selectedJson['created_at'];
                obj['id'] = "T" + maxId;
                spans.push(obj);
            }
        }

        sortSpans(spans);
        saveCurrent("catanns");

        selectedIds.length = 0;
        selectedIds.push(selectedId);

        indexSpans(spans);
        renderSpans(spans);
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);
    }


    // マークの削除
    function removeElement(spans, selection, selectedId) {
        sortSpans(spans);

        var range = selection.getRangeAt(0);

        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        if((range.compareBoundaryPoints(Range.START_TO_END, focusRange) == 1) && (range.compareBoundaryPoints(Range.END_TO_END, focusRange) == -1)) {
            var i;
            var len = spans.length - 1;
            for(i = len; i >= 0; i--) {
                if(spans[i]['id'] == selectedId) {

                    deleteInstanceAndRelationAndModificationFromSpan(spans[i]["id"]);

                    delete spanIdx[spans[i]['id']];
                    spans.splice(i, 1);
                    selectedIds.pop();
                    break;
                }
            }

            saveCurrent("catanns_insanns_relanns_modanns");

            indexSpans(spans);
            renderSpans(spans);
            indexSpanPositions(spans);
            indexInstancePositions(spans);
            renderInstances(instances);
            renderRelations(relations);
            renderModifications(modanns);
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
        var i;

        // 削除されるインスタンスのid
        var deleteInsIds = new Array();

        // 削除されるrelationのid
        var deleteRelIds = new Array();

        // このspan要素に関するinsatnceを削除
        var len = instances.length - 1;
        for(i = len; i >= 0; i--) {
            var ins = instances[i];
            if(ins["object"] == id) {
                deleteInsIds.push(ins["id"]);
                instances.splice(i, 1);
            }
        }

        // このspan要素に関するrelationを削除する
        var len = relations.length - 1;
        for(i = len; i >= 0; i--) {
            var conn = relations[i];
            if(conn["subject"] == id || conn["object"] == id)  {
                deleteRelIds.push(conn["id"]);
                relations.splice(i, 1);
            }
        }

        // 削除されるinstanceに関するrelationを削除する
        var len = relations.length - 1;
        for(i = len; i >= 0; i--) {
            var conn = relations[i];
            for(var j in deleteInsIds) {
                if(conn["subject"] == deleteInsIds[j] || conn["object"] == deleteInsIds[j] ) {
                    relations.splice(i, 1);
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
     * 同じ文字列を探す
     * ただし、両外側はdelimiterであること
     */
    function findSameString(startPos, endPos, spanTypeDefault, spans) {
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
                obj['category'] = spanTypeDefault;
                obj['new'] = true; // 新しくつくられた

                var isExist = false;

                for(var i = 0; i < spans.length; i++) {
                    if(spans[i]['span']['begin'] == obj['span']['begin'] && spans[i]['span']['end'] == obj['span']['end'] && spans[i].category == obj.category) {
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
        for(i in spans) {
            if(spans[i]['id'] == id) {
                return spans[i];
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

        if (mode == "relation") {
            // relation mode
            // win delete
            // mac fn + delete
            if (e.keyCode == 46) {
                for (var i = 0; i < selectedConns.length; i++) {
                    var rid = selectedConns[i];
                    jsPlumb.detach(connectors[rid]);

                    var len = relations.length - 1;
                    for (var j = 0; j < relations.length; j++) {
                        if(relations[j]["id"] == rid) {
                            relations.splice(j, 1);
                            delete relationIdx[rid];
                        }
                    }
                }

                selectedConns.length = 0;

                if(selectedModificationIds.length > 0) {
                    deleteModification();
                }

                saveCurrent("catanns_insanns_relanns_modanns");

            } else if((!e.ctrlKey  && e.keyCode == 191) || (!e.ctrlKey && e.keyCode == 83)) {
                // ?キー
                // sキー
                // modificatinを作る
                createModification("Speculation");
            } else if((!e.ctrlKey && e.keyCode == 78) || (!e.ctrlKey && e.keyCode == 88)) {
                //console.log('create modification');
                // xキー
                // nキー
                createModification("Negation");
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

                        var len = spans.length - 1;
                        var j;

                        for(j = len; j >= 0; j--){
                            if(spans[j]['id'] == selectedId) {
                                // span要素が削除される場合、そのインスタンスも削除される
                                for(var n in instances) {
                                    if(instances[n]["object"] == selectedId) {
                                        selectedInstanceIds.push(instances[n]["id"]);
                                        //isDeleteIns = true;
                                    }

                                }
                                delete spanIdx[spans[i]['id']];
                                spans.splice(j, 1);
                            }
                        }

                        len = relations.length - 1;
                        for(j = len; j >= 0; j--){
                            var conn = relations[j];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                deleteConns.push(conn);
                                relations.splice(j, 1);
                               // isDeleteRel = true;
                            }
                        }

                        len = tmpHidedRelations.length - 1;
                        for(j = len; j >= 0; j--){
                            var conn = tmpHidedRelations[j];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                deleteConns.push(conn);
                                tmpHidedRelations.splice(j, 1);
                                //isDeleteRel = true;
                            }
                        }
                    }

                    // 空にする
                    selectedIds.splice(0, selectedIds.length);

                    renderSpans(spans);
                    //setCurrentStorage(spans);

                   // renderInstances(instances);
                }

                //
                if(selectedInstanceIds.length > 0) {


                    for(var i in selectedInstanceIds) {
                        var selectedId = selectedInstanceIds[i];
                        //console.log('削除されるインスタンス:', selectedId);
                        //isDeleteIns = true;

                        var len = instances.length - 1;
                        var k;

                        for(k = len; k >= 0; k--){
                            if(instances[k]['id'] == selectedId) {
                                instances.splice(k, 1);
                            }
                        }

                        len = relations.length - 1;
                        for(k = len; k >= 0; k--){
                            var conn = relations[k];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                // 削除されるrelationのidを確保
                                deleteConns.push(conn);

                                relations.splice(k, 1);
                                //isDeleteRel = true;
                            }
                        }

                        len = tmpHidedRelations.length - 1;
                        for(k = len; k >= 0; k--){
                            var conn = tmpHidedRelations[k];
                            if(conn.subject == selectedId || conn.object == selectedId) {
                                // 削除されるrelationのidを確保
                                deleteConns.push(conn["id"]);

                                tmpHidedRelations.splice(k, 1);
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

                    renderInstances(instances);
                }

                // さらに、relationsからtmpHiderelationsで削除されたconnを削除する
                len = relations.length - 1;
                for(i = len; i >= 0; i--){
                    var conn = relations[i];
                    for(var j in deleteConns) {
                        if(conn == deleteConns[j]) {
                            relations.splice(i, 1);
                        }
                    }
                }

                // relationを書き直し
                reMakeConnectionOnDelete();

                deleteModification();

                saveCurrent("catanns_insanns_relanns_modanns");

            } else if(e.keyCode == 73) {
                // Iキー
                // インスタンスを作る
                //console.log('Iキー');
                createInstance();
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
                sortSpans(spans);

                if(selectedIdOrder > 0) {
                    selectedIdOrder--;
                } else {
                    selectedIdOrder = spans.length - 1;

                }

                selectedId = spans[selectedIdOrder]['id'];
                selectedIds.push(selectedId);

                renderSpans(spans);

            } else if(e.keyCode == 88 && !e.ctrlKey && selectedIds.length == 1) {

                selectedIds.splice(0, selectedIds.length);
                sortSpans(spans);

                if(selectedIdOrder < spans.length -1) {
                    selectedIdOrder++;
                } else {
                    selectedIdOrder = 0;

                }
                selectedId = spans[selectedIdOrder]['id'];
                selectedIds.push(selectedId);

                renderSpans(spans);
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
                // 選択状態は解除
                selectedIds.length = 0;
                selectedInstanceIds.length = 0;
                selectedConns.length = 0;
                selectedModificationIds.length = 0;

                doUndo();
            } else if(e.keyCode == 88 && redoNameArray.length > 0) {
                // 選択状態は解除
                selectedIds.length = 0;
                selectedInstanceIds.length = 0;
                selectedConns.length = 0;
                selectedModificationIds.length = 0;

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
        var type = instanceTypeDefault;
        selectedInstanceIds.length = 0;

        for(var i in selectedIds) {
            var instance = new Object();
            var id = "E" + (getMaxInsannsId() + 1);
            instance["id"] = id;
            instance["object"] = selectedIds[i];
            instance["type"] = type;

            instances.push(instance);
            indexInstances(instance);
            // selectedInstanceIds.push(id);
        }

        saveCurrent("insanns");

        indexInstancesPerSpan(instances);
        indexInstancePositions(spans);
        renderInstances(instances);
        renderRelations(relations);
        renderModifications(modanns);

        // 選択されたspan要素は選択をはずす
        // span編集モードの選択を削除
        // selectedIds.length = 0;
        // $('#doc_area span').removeClass('selected').removeClass('partialSelected');
    }

    /*
     * instanceの選択
     */
    function selectInstance(e) {
        e.preventDefault();
        //console.log('click span');
        //console.log('shiftキーが押されている:', e.shiftKey);

        // 下に重なってる要素のclickイベントを解除
        $('#doc_area span').unbind('click',arguments.callee);

        if(mode == "relation") {
            var id = $(this).attr('id').split('_')[1];

            if(sourceElem == null) {
                //console.log('here');
                sourceElem = $('#' + id);
                sourceElem.css('border-color', '#000000').addClass('ins_selected').attr('id');
            } else {
                targetElem = $('#' + id);

                // 選択されているものは選択をはずす
                deselectConnection();

                var newrel = new Object();

                newrel.id = "R" + (getMaxConnId() + 1);
                newrel.subject = sourceElem.attr('id');
                newrel.object = targetElem.attr('id');
                newrel.type = relationTypeDefault;
                relations.push(newrel);
                indexRelations([newrel]);

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
                        $('#' + id).removeClass('ins_selected');

                        addInstanceBorderColor($('#' + id), spanTypes);
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
                            addInstanceBorderColor($(this), spanTypes);
                        }
                    });

                    sourceElem = null;
                    targetElem = null;

                }

                renderRelations(relations);
                saveCurrent("relanns");
            }

            //console.log('sourceElem2:', sourceElem);

        } else {
            // editモード
            //console.log('select instance');

            if(isCtrl) {
                //console.log('ctrlキーが押されています');
                var id = $(this).css('border-color', '#000000').addClass('ins_selected').attr('id');
                selectedInstanceIds.push(id);
            } else {
                // 一旦選択を解除
                var elem = $('.ins_selected').removeClass('ins_selected');
                addInstanceBorderColor(elem, spanTypes);
                selectedInstanceIds.splice(0, selectedInstanceIds.length);

                var id = $(this).css('border-color', '#000000').addClass('ins_selected').attr('id');
                selectedInstanceIds.push(id);
            }
        }
    }


    function createModification(type) {
        var i;

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

            selectedConns.length = 0;

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
                    addInstanceBorderColor($(this), spanTypes);
                }
            });

            selectedInstanceIds.splice(0, selectedInstanceIds.length);
        }

        renderModifications(modanns);
        addModtypeColor(modTypes);

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
            selectedModificationIds.push(id);
        } else {
            // 一旦選択を解除
            unselectModification();

            $(this).addClass('mod_selected');

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
        }

        renderModifications(modanns);
        addModtypeColor(modTypes);

        //saveCurrentModanns();
        selectedModificationIds.length = 0;
    }


    /*
     * カテゴリー適用ボタン
     */
    $('.category_apply_btn').live('click', function() {
        // 選択されているannotationテーブルのcategoryに適用
        for (var i in selectedIds) {

            for (var j in spans){
                //console.log('json.id:', parseInt(spans[j]['id']));

                var applyJson = spans[j];

                if (applyJson['id'] == selectedIds[i]) {
                    applyJson['category'] = $(this).text();

                    renderSpans(spans);
                }
            }
        }
        //setCurrentStorage(spans);
        //saveCurrentCatanns();
        if (selectedIds.length > 0) {
            saveCurrent("catanns");
        }
    });


    /*
     * 関係適用ボタン
     */
    $('.relation_apply_btn').live('click', function() {
        for(var i = 0; i < selectedConns.length; i++) {
            var rid = selectedConns[i];
            var type = $(this).text();

            // update the model
            relationIdx[rid]["type"] = type;

            // update the rendering
            var conn = connectors[rid];
            conn.setPaintStyle(connectorTypes[type+"_selected"]["paintStyle"]);
        }

        saveCurrent("relanns");
    });


    /*
     * modification適用ボタン
     */
    $('.modtype_apply_btn').live('click', function() {
        for(var i in selectedModificationIds) {
            var modId = selectedModificationIds[i];

            for(var j in modanns) {
                var mod = modanns[j];

                if(modId == mod["id"]) {
                    mod['type'] = $(this).text();
                }
            }
        }

        renderModifications(modanns);
        addModtypeColor(modTypes);

        saveCurrent("modanns");
    });


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
        targetUrl = $('#load_url').val();
        $('#load_dialog').hide();
        getAnnotation(targetUrl);
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
        var doc = $('#src_area').text();

        var post_catanns = spans

        var postData = {
            "text":doc,
            "catanns": post_catanns,
            "relanns": relations,
            "insanns": instances,
            "modanns": modanns
        }

        $.ajax({
            type: "post",
            url: $('#save_url').val(),
            data: {annotations:JSON.stringify(postData)},
            crossDomain: true,
            xhrFields: {withCredentials: true},
            success: function(res){
                //console.log( "Data Saved: " + res );
                $('#loading').hide();
                $('#notice').html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showSource();
                });
            },
            error: function(res, textStatus, errorThrown){
                //console.log("エラー:", res, ":", textStatus);
                $('#loading').hide();
                $('#save_dialog').hide();
                $('#notice').html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showSource();
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

            var selectedAnno;
            for(var k in spans) {
                if(spans[k]['id'] == id) {
                    selectedAnno = spans[k];
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
            var maxId = getSpanMaxId();

            var ary = findSameString(startPos, endPos, category, spans);

            for(var i = 0; i < ary.length; i++) {

               var isAcross = false;

               // ここでjsonのbeginとendが他のjsonにまたがっていないかチェックする
               for(j in spans) {
                   if(ary[i]['span']['begin'] > spans[j]['span']['begin'] && ary[i]['span']['begin'] < spans[j]['span']['end'] && ary[i]['span']['end'] > spans[j]['span']['end'] ) {
                       // 開始位置がまたがっているので、不完全要素
                       isAcross = true;
                       ary[i]['span']['begin'] = validateStartDelimiter(spans[j]['span']['end']);
                       partialElem.push(ary[i]);
                       break;
                   } else if(ary[i]['span']['begin'] < spans[j]['span']['begin'] && ary[i]['span']['end'] > spans[j]['span']['begin'] && ary[i]['span']['end'] < spans[j]['span']['end']) {
                       // 終了位置がまたがっているので、不完全要素
                       ary[i]['span']['end'] = validateEndDelimiter(spans[j]['span']['begin']);
                       partialElem.push(ary[i]);
                       isAcross = true;
                       break;
                   }

               }

                if(!isAcross) {
                    maxId = maxId + 1;
                    ary[i]['id'] = "T" + maxId;

                    ary[i]['created_at'] = now;
                    spans.push(ary[i]);
                    spanIdx[spans[spans.length - 1]['id']] = spans[spans.length - 1];

                    newElem.push(ary[i]);
                }

            }

           sortSpans(spans);

           for(var i in spans) {

               if(spans[i]['new']) {
                   // 選択状態にする
                   selectedIds.push(spans[i]['id']);
                   //selectedElements.push(spans[i]);
               }

               for(var j in partialElem) {
                   if(spans[i]['new'] && spans[i]['span'].begin == partialElem[j]['span'].begin && spans[i]['span'].end == partialElem[j]['span'].end && spans[i].category == partialElem[j].category) {
                       //console.log("不完全要素は：", i);
                       // 選択状態にする
                       partialIds.push(i);
                   }
               }

               // new プロパティを削除
               delete spans[i]['new']
           }

           renderSpans(spans);
           //setCurrentStorage(spans);

           saveCurrent("catanns");
        }
        return false;
    });


    /*
     * notice_ok_btnをクリック
     */
    $('#notice_ok_btn').live('click', function() {
        $('#notice').empty();
        showSource();

        if($('.partial').hasClass('partialSelected')) {
            $('.partial').addClass('selected');
        }

        $('.partial').removeClass('partialSelected').removeClass('partial');
    });


    /*
     * 一時的に非表示状態にしたコネクションの再表示
     */
    function showHideAllConnections(flag, relType) {

        if(flag == "show") {
            // hidden connection draw
            var start = tmpHidedRelations.length - 1;
            for(var i = start;  i >= 0;  i--) {
                var connObj = tmpHidedRelations[i];
                var s_id = connObj['subject'];
                var t_id = connObj['object'];
                var rgba = connObj['paintStyle'];
                var connId = connObj['id'];
                var type = connObj['type'];

                //console.log('s_id:', s_id);
                if(relType == "all") {
                    $('.rel_hide').attr('checked','checked');
                    makeConnection(s_id, t_id, type, rgba, connId, "unselected");
                    tmpHidedRelations.splice(i, 1);
                    $('.tmp_hide').removeClass('tmp_hide');

                } else {
                    if(type == relType) {
                        makeConnection(s_id, t_id, type, rgba, connId, "unselected");
                        tmpHidedRelations.splice(i, 1);
                        $('.tmp_hide.t_' + type).removeClass('tmp_hide');
                    }
                }
            }

            selectedConns.length = 0;
            jsPlumb.repaintEverything();

        } else {

        }
    }

    /*
     * relationモードボタンクリック
     */
    $('#relation_btn').click(function() {

        if(sourceElem != null) {
            //console.log('sourceElemがあります');
            sourceElem = null;
            $('.source_selected').removeClass('source_selected');

            // 空にする
            selectedConns.length = 0;
            console.log("relation mode");
        }

        if($(this).attr('src') == 'images/relation_off_btn.png') {
            $('#always_multiple_btn').prop('disabled', true);

            // relationモード
            mode = "relation";
            // connectionにclickイベントをバインド
            // bindConnectionEvent();

            changeMode(mode);
        } else {
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

                makeConnection(source, target, type, rgba, connId, "unselected");
            }

            changeMode(mode);
        }

    });


    function unselectRelation() {
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

            //var c = makeConnection(subject, object, type, rgba, connId, "unselected", labelText, modId, "");

            var c = makeConnection(subject, object, type, rgba, connId, "unselected");

            jsPlumb.deleteEndpoint(endpoints[0]);
            jsPlumb.deleteEndpoint(endpoints[1]);
        }
        // 空にする
        selectedConns.length = 0;
    }


    function changeMode(mode) {
        sourceElem = null;
        targetElem = null;

        if(mode == 'view') {

            $('#doc_area').removeAttr('style');
            $('#ins_area').removeAttr('style');
            $('#rel_base_area').removeAttr('style');

            var bg_color = $('#doc_area').css('backgroundColor');

            if(bg_color.substr(0,4) == 'rgba') {
                var rgba = bg_color.replace('rgba', '').replace('(', '').replace(')', '');
                var rgbas = rgba.split(',');
                var rgb = 'rgb(' + rgbas[0] + ',' + rgbas[1] + ',' + rgbas[2] + ')' ;
                $('#doc_area').css('backgroundColor', rgb);
            }


            $('#edit_btn').attr("src", 'images/edit_off_btn.png');
            $('#relation_btn').attr("src", 'images/relation_off_btn.png');

            // span編集モードの選択を削除
            selectedIds.splice(0, selectedIds.length);
            $('#doc_area span').removeClass('selected').removeClass('partialSelected');

            // マウスアップで、spanの操作をアンバインド
            $(document).die('click', '*:not(#notice_ok_btn, #doc_area span, ' +
                '.editable,  .category_apply_btn, .relation_apply_btn, img, form, ' +
                '#load_dialog, #load_btn, :button, :text, :input');
            $('#doc_area').die('mouseup', doMouseup);

            // 選択解除イベントをアンバインド
            $("*:not(#joint_area, #notice_ok_btn,  #doc_area span, " +
                ".editable, td.category_apply_btn, td.relation_apply_btn, img, form, " +
                "#load_dialog, #load_btn, :button, :text, :input, " +
                "#ins_area div span.modification)").die("click", cancelSelect);

            // sourceElem とtargetElemの選択解除をアンバインド
            $("*:not(#doc_area span, #ins_area div)").die("click", cancelSelectSourceAndTargetElement);

            $('#doc_area span').die('click', clickSpan);

            $('div.instance').die('click', selectInstance);

            if(selectedModificationIds.length > 0) {
                selectedModificationIds.splice(0, selectedModificationIds.length);
                unselectModification();
                addModtypeColor(modTypes);
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
            $('#rel_base_area').css('z-index', -1);


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
            $('#clone_area div').remove();

            setCancelSelect();

            //console.log(mode);

            // relationの選択を解除
            unselectRelation();

            // modificationの選択を削除
            if(selectedModificationIds.length > 0) {
                selectedModificationIds.splice(0, selectedModificationIds.length);
                unselectModification();
                addModtypeColor(modTypes);
            }

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
            $('#rel_base_area').removeAttr('style');


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

            // マウスアップで、spanの操作を解除
            $(document).die('click', '*:not(#notice_ok_btn,  #doc_area span, ' +
                '.editable, .category_apply_btn, .relation_apply_btn, img, form, #load_dialog, #load_btn, :button, :text, :input')
            $('#doc_area').die('mouseup', doMouseup);

            setCancelSelect();

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
        $('#clone_area .clone_div').remove();

        var cloneArray = new Array();

        for(var i in spans) {
            var anno = spans[i];
            var span = $('#' + anno['id']);

            obj = new Object();
            obj["id"] = "clone_" + anno["id"];
            obj["left"] = span.get(0).offsetLeft;
            obj["top"] = span.get(0).offsetTop;
            obj["width"] = span.outerWidth();
            obj["height"] = span.outerHeight();
            obj["title"] = '[' + anno["id"] + '] ' + anno["category"];
            cloneArray.push(obj);
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

        var insdivs = $('#ins_area div');
        insdivs.map(function() {
            //console.log($(this));
            var clone_id = 'clone_' + $(this).attr('id');
            var clone_ins = $(this).clone(true).attr('id', clone_id).css('backgroundColor', 'blue').css('opacity', "0").empty();
            $('#clone_area').append(clone_ins);

        })

        $('.clone_div').click(clickSpan);
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
    function colorTrans(color, opacity) {
        var c = color.slice(1);
        var r = c.substr(0,2);
        var g = c.substr(2,2);
        var b = c.substr(4,2);
         //console.log("color:", r,":", g, ":", b);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);

        return 'rgba(' + r + ', ' +  g + ', ' + b + ', ' + opacity + ')';
    }


    /*
     * subject, objectが削除された場合の
     * コネクションの再描画
     */
    // function reMakeConnectionOnDelete() {
    //     jsPlumb.reset();

    //     for(var i in relations) {
    //         var conn = relations[i];
    //         var sId = conn['subject'];
    //         var tId = conn['object'];
    //         var connId = conn['id'];
    //         var type = conn['type'];

    //         var color = relationTypes[conn['type']]["color"];
    //         var rgba = colorTrans(color, connOpacity);

    //         makeConnection(sId, tId, type, rgba, connId, "unselected");
    //     }

    //     var conns = getConnectionData();

    //     for(var i in conns) {
    //         var conn = conns[i];
    //         var endpoints = conn.endpoints;

    //         for(var j in tmpHidedRelations) {
    //             var hideConn = tmpHidedRelations[j];

    //             if(id == hideConn['id']) {
    //                 jsPlumb.deleteEndpoint(endpoints[0]);
    //                 jsPlumb.deleteEndpoint(endpoints[1]);
    //             }
    //         }
    //     }
    // }


    function renderRelations(relations) {
        indexRelationSize(relations);
        sortRelationsBySize(relations);
        jsPlumb.reset();

        // render relations
        for(var i = 0; i < relations.length; i++) {
            var rid = relations[i]["id"];
            connectors[rid] = makeConnection(rid);
        }
    }


    function makeConnection (rid) {
        var sourceId = relationIdx[rid]['subject'];
        var targetId = relationIdx[rid]['object'];

        /*
         * Determination of curviness
         */
        var sourceX = idxPosition[sourceId]["center"];
        var targetX = idxPosition[targetId]["center"];

        var sourceY, targetY;
        if ((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T") ) {
            sourceY = idxPosition[sourceId]["bottom"];
            targetY = idxPosition[targetId]["bottom"];
        } else {
            sourceY = idxPosition[sourceId]["top"];
            targetY = idxPosition[targetId]["top"];
        }

        var xdiff = Math.abs(sourceX - targetX);
        var ydiff = Math.abs(sourceY - targetY);
        var curviness = xdiff * xrate + ydiff * yrate + c_offset;
        curviness /= 2.4;

        /*
         *  Determination of anchor points
         */
        var sourceAnchor;
        var targetAnchor;
        if ((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T") ) {
            sourceAnchor = "BottomCenter";
            targetAnchor = "BottomCenter";
        } else {
            sourceAnchor = "TopCenter";
            targetAnchor = "TopCenter";
        }

        /*
         * In case of self-reference
         */
        if (sourceId == targetId) {
            if (sourceId.substr(0,1) == "T") {
                sourceAnchor = [0.5, 1, -1, 1, -5, 0];
                targetAnchor = [0.5, 1, 1, 1, 5, 0];
            } else {
                sourceAnchor = [0.5, 0, -1, -1];
                targetAnchor = [0.5, 0, 1, -1];
            }
            curviness = 30;
        }

        /*
         * make connector
         */
        var type = relationIdx[rid]['type'];
        var rgba = colorTrans(relationTypes[type]['color'], connOpacity);
        var sourceElem = $('#' + sourceId);
        var targetElem = $('#' + targetId);


        jsPlumb.makeSource(sourceElem, {
            anchor:sourceAnchor,
            paintStyle:{ fillStyle:rgba, radius:2 }
        });

        jsPlumb.makeTarget(targetElem, {
            anchor:targetAnchor,
            paintStyle:{ fillStyle:rgba, radius:2 }
        });

        // var label = '[' + rid + '] ' + type;
        // var labelClass = "label " + type;

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            connector:[ "Bezier", {curviness:curviness}],
            detachable:false,
            paintStyle: connectorTypes[type]["paintStyle"],
            hoverPaintStyle: connectorTypes[type]["hoverPaintStyle"],

            overlays:[
                        ["Arrow", { width:10, length:12, location:1 }],
                        // ["Label", { label:label, location:0.5, cssClass:"label" }]
                    ],

            tooltip:'[' + rid + '] ' + type,
            parameters:{"id":rid, "type":type}
        });

        jsPlumb.unmakeSource(conn.sourceId).unmakeTarget(conn.targetId);
        // conn.setPaintStyle(connectorTypes[type]["paintStyle"]);
        // conn.setPaintStyle(connectorTypes[type]["paintStyle"]);
        conn.bind("click", connectorClicked);

        return conn;       
    }


    function connectorClicked (conn, e) {
        if(mode == "relation") {
            selectedModificationIds.length = 0;
            var id   = conn.getParameter("id");
            var type = conn.getParameter("type");

            if(e.ctrlKey) {
            }

            else {
                for (var i = 0; i < selectedConns.length; i++) {
                    connectors[selectedConns[i]].setPaintStyle(connectorTypes[type]["paintStyle"]);
                }
                selectedConns.length = 0;
            }

            selectedConns.push(id);
            conn.setPaintStyle(connectorTypes[type+"_selected"]["paintStyle"]);

            e.stopPropagation();
        }
        return false;
    }


    function renewConnections (relations) {
        indexRelationSize(relations);
        sortRelationsBySize(relations);

        for (var i = 0; i < relations.length; i++) {
            /*
             * Determination of curviness
             */
            var sourceId = relations[i]['subject'];
            var targetId = relations[i]['object'];

            var sourceX = idxPosition[sourceId]["center"];
            var targetX = idxPosition[targetId]["center"];

            var sourceY, targetY;
            if ((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T")) {
                sourceY = idxPosition[sourceId]["bottom"];
                targetY = idxPosition[targetId]["bottom"];
            } else {
                sourceY = idxPosition[sourceId]["top"];
                targetY = idxPosition[targetId]["top"];
            }

            var xdiff = Math.abs(sourceX - targetX);
            var ydiff = Math.abs(sourceY - targetY);
            var curviness = xdiff * xrate + ydiff * yrate + c_offset;
            curviness /= 2.4;

            if (sourceId == targetId) {
                curviness = 30;
            }

            var conn = connectors[relations[i]['id']];
            conn.setConnector(["Bezier", {curviness:curviness}]);
            conn.addOverlay(["Arrow", { width:10, length:12, location:1 }]);
        }

        jsPlumb.repaintEverything();
    }




    function renderInstances(instances) {
        $('#ins_area').empty();

        for(var i = 0; i < instances.length; i++) {
            var instance = instances[i];
            var objectId = instance["object"];

            // divを書く位置
            var posX = idxPosition[instance["id"]]["center"];
            var posY = idxPosition[instance["id"]]["top"];

            // 元のcategory annotationのcategory
            var cate = spanIdx[objectId]["category"];

            // 枠の色、インスタンスの元のcategory annotationの色
            var color = instanceTypes[instance["type"]]["color"];
            var borderColor = spanTypes[cate]["color"];

            var div = '<div id="' + instance["id"] +'" class="instance ' + instance["type"] + ' ' + cate + '" title="[' + instance["id"] + '] ' + instance["type"] + '" style="position:absolute;left:' + posX + 'px; top:' + posY + 'px; width:' + insWidth +'px; height:' + insHeight + 'px; border:' + insBorder + 'px solid ' + borderColor + '; background-color:' + color + '" ></div>';
            $('#ins_area').append(div);

            // 選択マークをつける
            for(var m in selectedInstanceIds) {
                $('#ins_area div#' + selectedInstanceIds[m]).css('border-color', '#000000').addClass('ins_selected');
            }
        }
    }


    function repositionInstances(instances) {
        for(var i = 0; i < instances.length; i++) {
            var instanceId = instances[i]["id"];

            // divを書く位置
            var posX = idxPosition[instanceId]["center"];
            var posY = idxPosition[instanceId]["top"];

            $('#' + instanceId).css("left", posX);
            $('#' + instanceId).css("top", posY);
        }
    }


    function renderModifications(modanns) {
        $('div.instance span.modification').remove();

        for(var i = 0; i < modanns.length; i++) {
            var mod = modanns[i];
            var modId = mod["id"];
            var modType = mod["type"];
            var object = mod["object"];
            var symbol;
            if(modType == "Negation") {
                symbol = 'X';
            } else if(modType == "Speculation") {
                symbol = '?';
            }
            $('#' + object).append('<span class="modification mod_' + modType + ' instance_modification" id="' + modId + '">' + symbol + '</span>');
        }
    }


    function unselectModification() {
        $('span.mod_selected').removeClass('mod_selected');
        selectedModificationIds.length = 0;
    }


    function changeConnectionOpacity(opacity) {
        connOpacity = opacity;
        setConnectorTypes();

        for (var i = 0; i < relations.length; i++) {
            var id = relations[i]["id"];
            var type = relationIdx[id]["type"];
            connectors[id].setPaintStyle(connectorTypes[type]["paintStyle"]);
        }

        for (var i = 0; i < selectedConns; i++) {
            var id = selectedConns[i];
            var type = relationIdx[id]["type"];
            connectors[id].setPaintStyle(connectorTypes[type+"_selected"]["paintStyle"]);
        }
    }


    $(window).resize(function(){
      redraw();
    });

    function redraw() {
        indexSpanPositions(spans);
        indexInstancePositions(spans);
        repositionInstances(instances);
         // renderRelations(relations);
        renewConnections(relations);

        mode = sessionStorage.getItem('mode');
        changeMode(mode);
    }

    $(window).bind('beforeunload', function(){
        return "Before You leave, please be sure you've saved all the changes.\nOtherwise, you may lose your changes.";
    });

});
