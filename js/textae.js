$(document).ready(function() {
    var OSname;
    var browserNameVersion;

    var mode = 'view';  // screen mode: view(default) | span | relation
    var replicateAuto = false;

    var sourceDoc;

    // selected slements
    var spanIdsSelected;
    var instanceIdsSelected;
    var modificationIdsSelected;
    var relationIdsSelected;

    // state of control keys
    var isCtrl = false;
    var isCtrlAlt = false;
    var isShift = false;

    // opacity of connectors
    var connOpacity = 0.6;

    // curviness parameters
    var xrate = 0.6;
    var yrate = 0.05;

    // curviness offset
    var c_offset = 20;

    // shape of instance
    var insWidth = 6;
    var insHeight = 6;
    var insBorder = 3;
    var insMargin = 2;

    // configuration data
    var delimiterCharacters;
    var nonEdgeCharacters;

    var spanTypes;
    var relationTypes;
    var instanceTypes;
    var modificationTypes;

    var spanTypeDefault;
    var relationTypeDefault;
    var instanceTypeDefault;
    var modificationTypeDefault;

    // annotation data (Objects)
    var spans;
    var instances;
    var relations;
    var modifications;

    var connectors;
    var connectorTypes;

    // index
    var instancesPerSpan;
    var relationsPerSpanInstance;

    // target URL
    var targetUrl = '';

    var editHistory;
    var lastEditPtr;
    var editHistoryLastSavePtr;

    var isJustDragged = false;

    getUrlParameters();

    /*
     * get the url parameters: beginning of the program
     */
    function getUrlParameters() {
        var params = location.search.slice(1).split('&');

        var targetUrl = "";
        var configUrl = "";

        for (var i =0; i < params.length; i++) {
            var param = params[i];
            if (param.split('=')[0] == 'target') {targetUrl = param.split('=')[1]}
            if (param.split('=')[0] == 'config') {configUrl = param.split('=')[1]}
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

        if (configUrl != "") {
            $.ajax({
                type: "GET",
                url: configUrl,
                dataType: "json",
                crossDomain: true,
                success: function(data) {
                    setConfig(data);
                    renderFrame();
                    getAnnotationFrom(targetUrl);
                },
                error: function() {
                    alert('could not read the configuration from the location you specified.');
                }
            });
        } else {
            renderFrame();
            getAnnotationFrom(targetUrl);
        }
    }


    function showSource() {
        $('#notice').html("(source: " + targetUrl + ")");
    }


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


    function isNonEdgeCharacter(char){
        return ($.inArray(char, nonEdgeCharacters) >= 0);
    }


    function isDelimiter(char){
        return ($.inArray(char, delimiterCharacters) >= 0);
    }


    function renderFrame() {
        tableSpanTypes(spanTypes);
        tableRelationTypes(relationTypes);
        tableInstanceTypes(instanceTypes);
        tableModificationTypes(modificationTypes);
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

        spanTypes = new Object();
        spanTypeDefault = null;
        if (config['span types'] != undefined) {
            var span_types = config['span types'];
            for (var i in span_types) {
                spanTypes[span_types[i]["name"]] = span_types[i];
                if (span_types[i]["default"] == true) {spanTypeDefault = span_types[i]["name"];}
            }
            if (!spanTypeDefault) {spanTypeDefault = span_types[0]["name"];}
        }

        instanceTypes = new Object();
        instanceTypeDefault = null;
        if (config['instance types'] != undefined) {
            var instance_types = config['instance types'];
            for (var i in instance_types) {
                instanceTypes[instance_types[i]["name"]] = instance_types[i];
                if (instance_types[i]["default"] == true) {instanceTypeDefault = instance_types[i]["name"];}
            }
            if (!instanceTypeDefault) {instanceTypeDefault = instance_types[0]["name"];}
        }

        relationTypes = new Object();
        relationTypeDefault = null;
        if (config['relation types'] != undefined) {
            var relation_types = config['relation types'];
            for (var i in relation_types) {
                relationTypes[relation_types[i]["name"]] = relation_types[i];
                if (relation_types[i]["default"] == true) {relationTypeDefault = relation_types[i]["name"];}
            }
            if (!relationTypeDefault) {relationTypeDefault = relation_types[0]["name"];}
        }

        connectorTypes = new Object();

        modificationTypes = new Object();
        modificationTypeDefault = null;
        if (config['modification types'] != undefined) {
            var mod_types = config['modification types'];
            for (var i in mod_types) {
                modificationTypes[mod_types[i]["name"]] = mod_types[i];
                if (mod_types[i]["default"] == true) {modificationTypeDefault = mod_types[i]["name"];}
            }
            if (!modificationTypeDefault) {modificationTypeDefault = mod_types[0]["name"];}
        }

        if (config["css"] != undefined) {
            $('#css_area').html('<link rel="stylesheet" href="' + config["css"] + '"/>');
        }
    }


    function initJsPlumb() {
        jsPlumb.reset();
        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.Defaults.Container = $("#rel_area");
        jsPlumb.importDefaults({
            ConnectionsDetachable:false,
            Endpoint:[ "Dot", { radius:1 } ]
        });
        setConnectorTypes();
    }


    function setConnectorTypes() {
        for (var name in relationTypes) {
            var color = relationTypes[name]["color"];
            var rgba0 = colorTrans(color, connOpacity);
            var rgba1 = colorTrans(color, 1);

            connectorTypes[name] = {paintStyle:{strokeStyle:rgba0, lineWidth:1}, hoverPaintStyle:{strokeStyle:rgba1, lineWidth:3}};
            connectorTypes[name + '_selected'] = {paintStyle:{strokeStyle:rgba1, lineWidth:3}, hoverPaintStyle:{ strokeStyle:rgba1, lineWidth:3}};
        }
        // jsPlumb.registerConnectionTypes(connectorTypes);
    }


    function getAnnotationFrom(url) {
        if (url) {targetUrl = url}
        if (targetUrl) {
            $.ajax({
                type: "GET",
                url: targetUrl,
                dataType: "json",
                crossDomain: true,
                xhrFields: {withCredentials: true},
                success: function(annotation) {
                    if (annotation.text != undefined) {
                        initialize();
                        loadAnnotation(annotation);
                        initJsPlumb();
                        renderAnnotation();
                        showSource();
                        pushButtonView();
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
        detectOS();
        browserNameVersion = navigator.sayswho

        $('#doc_area').on('mouseup', doMouseup);
        $('#doc_area').on('click', cancelSelect);

        spanIdsSelected = new Array();
        instanceIdsSelected = new Array();
        relationIdsSelected = new Array();
        modificationIdsSelected = new Array();

        editHistory = new Array();
        lastEditPtr = -1;
        lastSavePtr = -1;

        enableButtonLoad();

        changeButtonStateUndoRedo();
        changeButtonStateSave();
    }


    /*
     * prepare annotation
     */
    function loadAnnotation(data) {
        // load annotation
        sourceDoc = data.text;

        spans = new Object();
        if(data.catanns != undefined) {
            for (var i = 0; i < data.catanns.length ; i++) {spans[data.catanns[i]["id"]] = data.catanns[i];}
            for (var sid in spans) {spans[sid]['type'] = spans[sid]['category']} // use 'type' instead of 'category'
        }
        spanIds = Object.keys(spans); // maintained sorted.
        sortSpanIds(spanIds);

        instances = new Object();
        if(data.insanns != undefined) {
            for (var i = 0; i < data.insanns.length ; i++) {instances[data.insanns[i]["id"]] = data.insanns[i];}
        }
        instanceIds = Object.keys(instances);

        relations = new Object();
        if(data.relanns != undefined) {
            for (var i = 0; i < data.relanns.length ; i++) {relations[data.relanns[i]["id"]] = data.relanns[i];}
        }
        relationIds = Object.keys(relations);

        modifications = new Object();
        if(data.modanns != undefined) {
            for (var i = 0; i < data.modanns.length ; i++) {modifications[data.modanns[i]["id"]] = data.modanns[i];}
        }
        modificationIds = Object.keys(modifications);

        // index instances per array
        instancesPerSpan = new Object();
        for (var sid in spans) {instancesPerSpan[sid] = new Array()}
        for (var iid in instances) {
            instancesPerSpan[instances[iid]['object']].push(iid);
        }

        // index relations per array or instance
        relationsPerSpanInstance = new Object();
        for (var sid in spans)     {relationsPerSpanInstance[sid] = new Array()}
        for (var iid in instances) {relationsPerSpanInstance[iid] = new Array()}
        for (var rid in relations) {
            relationsPerSpanInstance[relations[rid]['subject']].push(rid);
            relationsPerSpanInstance[relations[rid]['object']].push(rid);
        }

        positions = new Object();
        connectors = new Object();
    }


    function indexPositions(spanIds) {
        indexSpanPositions(spanIds);
        indexInstancePositions(spanIds); // note that this function takes spans not instances.
    }


    function indexSpanPositions(spanIds) {
        for (var i = 0; i < spanIds.length; i++) {
            var sid = spanIds[i];
            var span = $('#' + sid);

            var spanTop = span.get(0).offsetTop;
            var spanLeft = span.get(0).offsetLeft;
            var spanWidth = span.outerWidth();
            var spanHeight = span.outerHeight();
            positions[sid] = {};
            positions[sid]["top"] = spanTop;
            positions[sid]["bottom"] = spanTop + spanHeight;
            positions[sid]["center"] = spanLeft + spanWidth/2;
        }
    }


    function indexInstancePositions(spanIds) {
        for (var s = 0; s < spanIds.length; s++) {
            var sid = spanIds[s];
            var iids = instancesPerSpan[sid];
            var num = iids.length;

            for (var i = 0; i < num; i++) {
                var iid = iids[i];
                var offset;
                var p = i + 1;
                if(p % 2 == 0) {
                    offset = -(insMargin + insWidth + insBorder) * Math.floor(p/2);
                } else {
                    offset = +(insMargin + insWidth + insBorder) * Math.floor(p/2);
                }
                if (num % 2 == 0) {offset += (insWidth / 2 + insBorder);}

                positions[iid] = {};
                positions[iid]["top"]    = positions[sid]["top"] - insHeight - insBorder * 2;
                positions[iid]["center"] = positions[sid]["center"] - insWidth/2 - insBorder + offset;
            }
        }
    }


    function renderAnnotation() {
        $("#doc_area").html(sourceDoc);
        $('#ins_area').empty();

        renderSpans(spanIds);
        indexPositions(spanIds);
        renderInstances(instanceIds);
        renderRelations(relationIds);
        renderModifications(modificationIds);
    }


    function indexRelationSize(rids) {
        for (var i = 0; i < rids.length; i++) {
            rid = rids[i];
            var sourceX = positions[relations[rid]['subject']]["center"];
            var targetX = positions[relations[rid]['object']]["center"];
            relations[rid]["size"] = Math.abs(sourceX - targetX);
        }
    }


    function sortRelationIds(rids) {
        function compare(a, b) {
            return (relations[b]['size'] - relations[a]['size']);
        }
        rids.sort(compare);
    }


    /*
     * sort the span IDs by the position
     */
    function sortSpanIds(sids) {
        function compare(a, b) {
            return((spans[a]['span']['begin'] - spans[b]['span']['begin']) || (spans[b]['span']['end'] - spans[a]['span']['end']));
        }
        sids.sort(compare);
    }


    // 'Undo' button control
    function enableButtonUndo() {
        $("#btn_undo").off('click', doUndo).on('click', doUndo);
        renderButtonEnable($("#btn_undo"))
    }

    function disableButtonUndo() {
        $("#btn_undo").off('click', doUndo);
        renderButtonDisable($("#btn_undo"))
    }

    // 'Redo' button control
    function enableButtonRedo() {
        $("#btn_redo").off('click', doRedo).on('click', doRedo);
        renderButtonEnable($("#btn_redo"))
    }

    function disableButtonRedo() {
        $("#btn_redo").off('click', doRedo);
        renderButtonDisable($("#btn_redo"))
    }


    /*
     * Undo
     */
    function doUndo() {
        clearSpanSelection();
        clearInstanceSelection();
        clearRelationSelection();
        clearModificationSelection();

        revertEdits(editHistory[lastEditPtr--]);
        changeButtonStateUndoRedo();
        changeButtonStateSave();
    }


    /*
     * Redo
     */
    function doRedo() {
        clearSpanSelection();
        clearInstanceSelection();
        clearRelationSelection();
        clearModificationSelection();

        makeEdits(editHistory[++lastEditPtr], 'redo');
        changeButtonStateUndoRedo();
        changeButtonStateSave();

        return false;
    }


    function changeButtonStateUndoRedo() {
        if (lastEditPtr > -1) {
            enableButtonUndo();
            $('#btn_undo').html(lastEditPtr + 1);
        } else {
            disableButtonUndo();
            $('#btn_undo').html('');
        }

        if (lastEditPtr < editHistory.length - 1) {
            enableButtonRedo();
            $('#btn_redo').html(editHistory.length - lastEditPtr - 1);
        } else {
            disableButtonRedo();
            $('#btn_redo').html('');
        }
    }


    function changeButtonStateSave() {
        if (lastEditPtr == lastSavePtr) {
            disableButtonSave();
        } else {
            enableButtonSave();
        }
    }


    function renderButtonDisable(button) {
        button.addClass('disabled');
    }

    function renderButtonEnable(button) {
        button.removeClass('disabled');
    }

    function isButtonDisabled(button) {
        return button.hasClass('disabled');
    }

    function renderButtonPush(button) {
        button.addClass('pushed');
    }

    function renderButtonUnpush(button) {
        button.removeClass('pushed');
    }


    /*
     * List of categories 
     */
    function tableSpanTypes(spanTypes) {
        var html = '<table>';
        html += '<tr><th colspan="2">Span Types</th>';

        for(var s in spanTypes) {
            var uri = spanTypes[s]["uri"];

            html += '<tr style="background-color:' + spanTypes[s]["color"]  + '">';

            if (s == spanTypeDefault) {
                html += '<td><input type="radio" name="category" class="category_radio" checked title="default type"></td>';
            } else {
                html += '<td><input type="radio" name="category" class="category_radio"></td>';
            }

            html += '<td><div class="span_type_label">' + s  + '</div></td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';
        }

        html += '</table>';
        $('#span_types').html(html);
    }


    /*
     * List of relation types
     */
    function tableRelationTypes (relationTypes) {
        var html = '<table>';
        html += '<tr class="hide_all_checkbox">' +
            '<th colspan="2">Relation Types</th>' +
            // '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="all" checked></td>' +
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

            html += '<td><div class="relation_type_label">' + r  + '</div></td>';
            // html += '<td><input type="checkbox" name="rel_hide" class="rel_hide" title="show/hide" checked></td>';

            if (uri) {
                html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';
            }

            html += '</tr>';

            var obj = new Object();
            obj[r] = {paintStyle:{strokeStyle:color, lineWidth:2}};
            jsPlumb.registerConnectionTypes(obj);
        }

        html += '</table>';

        $('#relation_types').html(html);
    }


    /*
     * List of instance types
     */
    function tableInstanceTypes(instanceTypes) {
        var html = '<table><tr class="hide_all_checkbox">' +
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

        html += '</table>';

        $('#instype_list').html(html);
    }


    /*
     * List of modification types
     */
    function tableModificationTypes(modificationTypes) {
        var html = '<table><tr class="hide_all_checkbox">' +
            '<th colspan="2">Modification Types</th>' +
            '<td><input type="checkbox" name="modtype_hide" class="modtype_hide" title="all" checked></td>' +
            '<td></td>' +
            '</tr>';

        for(var m in modificationTypes) {
            var uri = modificationTypes[m]["uri"];

            html += '<tr style="background-color:' + modificationTypes[m]["color"] + '">'

            if (m == modificationTypeDefault) {
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

        html += '</table>';

        $('#modtype_list').html(html);
    }


    function renderSpans(sids) {
        for (var i = 0; i < sids.length; i++) {
            renderSpan(sids[i], sids.slice(0, i));
        }
    }


    function renderSpan(sid, spanIds) {
        var element = document.createElement("span");
        element.setAttribute('id', sid);
        element.setAttribute('class', spans[sid]["type"]);
        element.setAttribute('title', '[' + sid + '] ' + spans[sid]["type"]);
        if (spanTypes[spans[sid]["type"]]["region"] != true) {
            element.style.whiteSpace = "pre";
            element.style.backgroundColor = spanTypes[spans[sid]["type"]]["color"];
        }

        var beg = spans[sid].span.begin;
        var end = spans[sid].span.end;
        var len = end - beg;

        var c; // index of current span
        for (c = 0; c < spanIds.length; c++) {
            if (spanIds[c] == sid) break;
        }

        var begnode, begoff;
        var endnode, endoff;

        begnode = document.getElementById("doc_area").childNodes[0];
        begoff = beg;

        // adjust the begin node and offset
        if (c > 0) {
            var p = c - 1; // index of preceding span

            // when the previous span includes the region
            if (spans[spanIds[p]].span.end > beg) {
                begnode = document.getElementById(spans[spanIds[p]].id).childNodes[0];
                begoff  = beg - spans[spanIds[p]].span.begin;
            } else {
                // find the outmost preceding span
                var pnode = document.getElementById(spans[spanIds[p]].id);
                while (pnode.parentElement &&
                        spans[pnode.parentElement.id] &&
                        spans[pnode.parentElement.id].span.end > spans[pnode.id].span.begin &&
                        spans[pnode.parentElement.id].span.end < end) {pnode = pnode.parentElement}

                begnode = pnode.nextSibling;
                begoff = beg - spans[pnode.id].span.end;
            }
        }

        endnode = begnode;
        endoff = begoff + len;

        // when there is an intervening span, adjust the end node and offset
        if ((c < spanIds.length - 1) && (end > spans[spanIds[c+1]].span.begin)) {
            var f = c + 1; // index of following span
            // find the leftmost span inside the target span
            while ((f < spanIds.length - 2) && (end > spans[spanIds[f+1]].span.begin)) {f++}
            endnode = document.getElementById(spans[spanIds[f]].id).nextSibling;
            endoff = end - spans[spanIds[f]].span.end;
        }

        var range = document.createRange();
        range.setStart(begnode, begoff);
        range.setEnd(endnode, endoff);
        range.surroundContents(element);

        $('#' + sid).live('click', spanClicked);
    }


    function destroySpan(sid) {
        var span = document.getElementById(sid);
        var parent = span.parentNode;
        while(span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
    }

    function isSpanSelected(sid) {
        return (spanIdsSelected.indexOf(sid) > -1);
    }

    function selectSpan(sid) {
        if (!isSpanSelected(sid)) {
            $('span#' + sid).addClass('selected');
            spanIdsSelected.push(sid);
        }
    }

    function deselectSpan(sid) {
        var i = spanIdsSelected.indexOf(sid);
        if (i > -1) {
            $('span#' + sid).removeClass('selected');
            spanIdsSelected.splice(i, 1);
        }
    }

    function clearSpanSelection() {
        $('span.selected').removeClass('selected');
        spanIdsSelected.length = 0;
    }


    /*
     * set the default category
     */
    $('.category_radio').live('change', function() {
        spanTypeDefault = $(this).parent().next().text();
    });


    /*
     * set the default relation type
     */
    $('.relation_radio').live('change', function() {
        relationTypeDefault = $(this).parent().next().text();
    });


    function spanClicked(e) {
        cancelBubble(e);

        if (isJustDragged) {
            isJustDragged = false;
            return false;
        }

        if (mode == "span") {
            var id = $(this).attr('id');

            if (isCtrl) {
                if (isSpanSelected(id)) {deselectSpan(id)}
                else {selectSpan(id)}
            }

            else if (isShift && spanIdsSelected.length == 1) {
                var firstId = spanIdsSelected.pop();
                var secondId = $(this).attr('id');

                dismissBrowserSelection();
                clearSpanSelection();

                var firstIndex = spanIds.indexOf(firstId);
                var secondIndex = spanIds.indexOf(secondId);

                if (secondIndex < firstIndex) {
                    var tmpIndex = firstIndex;
                    firstIndex = secondIndex;
                    secondIndex = tmpIndex;
                }

                for (var i = firstIndex; i <= secondIndex; i++) {
                    selectSpan(spanIds[i]);
                }
            }

            else {
                clearSpanSelection();
                clearInstanceSelection();
                selectSpan(id);
            }
        }

        else if (mode == "relation") {
            var id = $(this).attr('id').split('_')[1];  // in clone area, clone_id

            clearRelationSelection();

            if (spanIdsSelected.length == 0 && instanceIdsSelected.length == 0) {
                selectSpan(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (spanIdsSelected.length > 0) {sid = spanIdsSelected[0]}
                else {sid = instanceIdsSelected[0]}

                makeEdits([{action:'new_relation', id:rid, type:relationTypeDefault, subject:sid, object:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSpanSelection();
                    clearInstanceSelection();

                    // continuous chaining
                    if (e.shiftKey) {selectSpan(oid)}
                }
            }
        }

        return false;
    }


    /*
     * merge spans by mouse right click
     */
    $('#doc_area span').live('contextmenu', function(e){

        if (mode == "relation") {
           // relationモード

        } else if (mode == "span") {

            if (spanIdsSelected.length == 1) {
                var firstSpanId = spanIdsSelected.shift();
                var secondSpanId = $(this).attr('id');
                var firstParentId = $('span#' + firstSpanId).parent().attr('id');
                var secondParentId = $(this).parent().attr('id');

                // merge spans
                if (firstParentId == secondParentId && firstSpanId != secondSpanId) {
                    var edits = new Array();

                    // 選択されたspanのidを保存
                    var firstSpan  = spans[firstSpanId];    // 最初に選択された要素
                    var secondSpan = spans[secondSpanId];   // 右クリックで選択された要素

                    // move instances
                    for (var i = 0; i < instancesPerSpan[secondSpanId].length; i++) {
                        edits.push({action:'change_instance_object', id:instancesPerSpan[secondSpanId][i], old_object:secondSpanId, new_object:firstSpanId});
                    }

                    // move relations
                    for (var i = 0; i < relationsPerSpanInstance[secondSpanId].length; i++) {
                        var rid = relationsPerSpanInstance[secondSpanId][i];
                        if (relations[rid].subject == secondSpanId) {
                            edits.push({action:'change_relation_subject', id:rid, old_subject:secondSpanId, new_subject:firstSpanId});
                        }
                        if (relations[rid].object == secondSpanId) {
                            edits.push({action:'change_relation_object', id:rid, old_object:secondSpanId, new_object:firstSpanId});
                        }
                    }

                    // merge to the former span
                    if (firstSpan['span']['end'] < secondSpan['span']['end']) {
                        edits.push({action:'change_span_end', id:firstSpanId, old_end:firstSpan['span']['end'], new_end:secondSpan['span']['end']});
                    }

                    // merge to the latter span
                    else {
                        edits.push({action:'change_span_begin', id:firstSpanId, old_begin:firstSpan['span']['begin'], new_begin:secondSpan['span']['begin']});
                    }

                    // remove the second span
                    edits.push({action:'remove_span', id:secondSpanId, begin:spans[secondSpanId].span.begin, end:spans[secondSpanId].span.end, type:spans[secondSpanId].type});

                    makeEdits(edits);
                } 
            }

            else {
                    alert("Cannot merge spans when there are more than one spans selected.");
                }
        }

        cancelBubble(e);
        return false;
    });


    /*
     * マウスドラッグ時の開始位置の調整
     */
    function adjustSpanStart(startPosition) {
        // 開始位置
        var pos = startPosition;

        // はじめにstart位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで後ろにずらす
        while (isNonEdgeCharacter(sourceDoc.charAt(pos))){
            pos = pos + 1;
            startChar = sourceDoc.charAt(pos);
        }

        // 次に、その位置がdelimitであれば、そのまま
        // delimjitでなければ、delimitCharcterが現れるまでstart位置を前にさかのぼる
        while (pos > 0 && !isDelimiter(sourceDoc.charAt(pos-1))) {pos--}
        return pos;
    }


    /*
     * マウスドラッグ時の開始位置の調整2
     * ドラッグした位置以上に縮める
     */
    function adjustSpanStart2(startPosition) {
        // 開始位置はドラッグした最後の文字
        startPosition = startPosition -1;

        // 開始文字
        var startChar = sourceDoc.charAt(startPosition);

        // 開始位置
        var pos = startPosition;

        // はじめにstart位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで後ろにずらす
        if(!isNonEdgeCharacter(startChar)) {
            if(isDelimiter(startChar)) {
                pos = pos + 1;
             } else {
                while(!isDelimiter(startChar)) {
                    pos = pos + 1;
                    startChar = sourceDoc.charAt(pos);
                }
            }
        }

        while(isNonEdgeCharacter(startChar)) {
            pos = pos + 1;
            startChar = sourceDoc.charAt(pos);
        }
        return pos;
    }


    /*
     * マウスドラッグ時の終了位置の調整
     */
    function adjustSpanEnd(endPosition) {
        // original document
        var str = sourceDoc;

        var endChar = str.charAt(endPosition - 1);

        var pos = endPosition - 1;

        // はじめにend位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで前にずらす
        while(isNonEdgeCharacter(endChar)){
            pos = pos - 1;
            endChar = str.charAt(pos);
        }
        // つぎに、delimitCharacterが現れるまでend位置を後ろにずらす
        endChar = str.charAt(pos);

        // 次に、その位置がdelimitであれば、そのまま
        // delimjitでなければ、delimitCharcterが現れるまでend位置を後ろにずらす
        if(isDelimiter(endChar)) {
            return pos + 1;
        } else {
            while(!isDelimiter(endChar)) {
                pos = pos + 1;
                endChar = str.charAt(pos);
            }
            return pos;
        }
    }


    /*
     * マウスドラッグ時の終了位置の調整
     * ドラッグした位置以上に縮める
     */
    function adjustSpanEnd2(endPosition) {
        // original document
        var str = sourceDoc;

        var endChar = str.charAt(endPosition);

        var pos = endPosition;

        // はじめにend位置の文字ががboundaryCharであれば、
        // boundaryCharがなくなる位置まで前ににずらす
        if(!isNonEdgeCharacter(endChar)) {

            if(isDelimiter(endChar)) {
                pos = pos - 1;
            } else {

                while(!isDelimiter(endChar)) {
                    pos = pos - 1;
                    endChar = str.charAt(pos);
                }

            }
        }

        while(isNonEdgeCharacter(endChar)) {
            pos = pos - 1;
            endChar = str.charAt(pos);
        }

        return pos + 1;
    }


    function doMouseup(e) {
        if (mode == 'span') {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);

            // do nothing when the whole div is selected by triple click
            if (range.startContainer == $('div#doc_area').get(0)) return false;

            // do nothing when Shift is pressed
            if (isShift) return false;

            // do nothing with no selection
            if (selection.isCollapsed) return false;

            // no boundary crossing: normal -> create a span
            if (selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {
                while (spanIdsSelected.length > 0) {
                    $('#'+spanIdsSelected.pop()).removeClass('selected');
                }

                var anchorChilds = selection.anchorNode.parentNode.childNodes;
                var focusChilds = selection.focusNode.parentNode.childNodes;

                var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
                var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

                dismissBrowserSelection();

                // 後ろから選択された場合は、
                // 位置を逆転させる
                if (absoluteAnchorPosition > absoluteFocusPosition) {
                    var tmpPos = absoluteAnchorPosition;
                    absoluteAnchorPosition = absoluteFocusPosition;
                    absoluteFocusPosition = tmpPos;
                }

                var sid = getSpanNewId();
                var startPosition = adjustSpanStart(absoluteAnchorPosition);
                var endPosition = adjustSpanEnd(absoluteFocusPosition);

                clearSpanSelection();

                var edits = [{action:'new_span', id:sid, begin:startPosition, end:endPosition, type:spanTypeDefault}];

                if (replicateAuto) {
                    var replicates = getSpanReplicates({id:sid, span:{begin:startPosition, end:endPosition}, type:spanTypeDefault});
                    edits = edits.concat(replicates);
                }

                if (edits.length > 0) makeEdits(edits);
            }

            // boundary crossing: exception
            else {
                if (spanIdsSelected.length == 1) {
                    var selectedId = spanIdsSelected[0];
                    if (selectedId == selection.focusNode.parentElement.id) {
                        shortenElement(selectedId, selection);
                    } else if (selectedId == getSelectedIdByAnchorNode($('span#' + selectedId), selection.anchorNode)) {
                        expandElement(selectedId, selection);
                    }
                }
                else {
                    alert('cannot change the boundary when more than one spans are selected.');
                }

            }

            dismissBrowserSelection();

            cancelBubble(e);
            isJustDragged = true;
        }

        return false;
    }


    function instanceMouseHover(e) {
        if (mode == 'view') {
            var iid = $(this).attr('id');
            var rids = relationsPerSpanInstance[iid];

            if (event.type == 'mouseover') {
                $(this).addClass('mouseHover');
                for (var i = 0; i < rids.length; i++) {
                    connectors[rids[i]].setHover(true);
                    connectorHoverBegin(connectors[rids[i]]);
                }
            } else {
                $(this).removeClass('mouseHover');
                for (var i = 0; i < rids.length; i++) {
                    connectors[rids[i]].setHover(false);
                    connectorHoverEnd(connectors[rids[i]]);
                }
            }
        }
    }


    function cancelBubble(e) {
        var evt = e ? e:window.event;
        if (evt.stopPropagation)    evt.stopPropagation();
        if (evt.cancelBubble!=null) evt.cancelBubble = true;
    }


    /*
     * span idの最大値を求める
     * spn idの形は T+数字
     */
    function getSpanMaxIdNum() {
        var numId = 0;
        for (sid in spans) {
            var sidnum = parseInt(sid.slice(1));
            if (sidnum > numId) {
                numId = sidnum;
            }
        }
        return numId;
    }


    function getSpanNewId() {
        var i = 1;
        while (spans['T'+i]) i++;
        return 'T' + i;
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
        return numId;
    }


    /*
     * modannsのidの数字部分の最大値を求める
     */
    function getMaxModannsId() {
        var numId = 0;
        for(var i in modifications){
            if(parseInt(modifications[i]["id"].slice(1)) > numId){
                numId = parseInt(modifications[i]["id"].slice(1));
            }
        }
        return numId;
    }


    function newSpan(id, begin, end, type) {
        var span = new Object();
        span['id'] = id;
        span['span'] = {"begin": begin, "end":end};
        span['type'] = type;
        spans[id] = span;
        return id;
    }


    function cancelSelect(e) {
        if (isJustDragged) {
            isJustDragged = false;
            return false;
        }

        clearSpanSelection();
        clearInstanceSelection();
        clearRelationSelection();
        clearModificationSelection();
        cancelBubble();
    }


    function expandElement(sid, selection) {
        var range = selection.getRangeAt(0);

        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。
        if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) > 0) {

            // 選択された用素のの親の親と、selection.focusNodeの親が同じでないといけない
            //if(selected.get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){
            if ($('span#' + sid).get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){

                // focusNodeの親ノードの位置を求めます
                var offset = 0;

                // focusノードを起点にしたchild node
                var focusChilds = selection.focusNode.parentElement.childNodes;

                // そのspanの文字数を計算
                var len = getFocusPosBySpan(focusChilds, selection);

                if(selection.focusNode.parentNode.id == 'doc_area') {

                } else {
                    offset = spans[selection.focusNode.parentNode.id]['span']['begin'];
                }

                // 修正
                var oldEnd = spans[sid]['span']['end']
                var newEnd = adjustSpanEnd(offset + len + selection.focusOffset);

                dismissBrowserSelection();

                makeEdits([{action:'change_span_end', id:sid, old_end:oldEnd, new_end:newEnd}]);
            }

        } else {

            if ($('span#' + sid).get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){
                // focusNodeの親ノードの位置を求めます
                var offset = 0;

                // focusノードを起点にしたchild node
                var focusChilds = selection.focusNode.parentElement.childNodes;

                // そのspanの文字数を計算
                var len = getFocusPosBySpan(focusChilds, selection);

                if(selection.focusNode.parentNode.id == 'doc_area') {

                } else {
                    offset = spans[selection.focusNode.parentNode.id]['span']['begin'];
                }

                // 修正
                var oldBegin = spans[sid]['span']['begin'];
                var newBegin = adjustSpanStart(offset + len + selection.focusOffset);

                dismissBrowserSelection();

                makeEdits([{action:'change_span_begin', id:sid, old_begin:oldBegin, new_begin:newBegin}]);
            }
        }
    }


    function shortenElement(sid, selection) {
        var range = selection.getRangeAt(0);

        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        // focusRange の開始点よりも、range の開始点が前なら -1、等しければ 0、後なら 1 を返します。

        var i;
        var len = spans.length - 1;

        if(range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var spanLen = getFocusPosBySpan(focusChilds, selection);

            // 位置修正
            var endPosition = adjustSpanEnd2(spans[selection.focusNode.parentNode.id]['span']['begin'] + spanLen + selection.focusOffset);

            dismissBrowserSelection();

            // 選択範囲がマークの最初と同じであれば、
            // endPositionがマークのbeginよりも大きくなるので、
            // その場合は何もしない
            if(endPosition > spans[sid]['span']['begin']) {
                var oldEnd = spans[sid]['span']['end'];
                var newEnd = endPosition;
                makeEdits([{action:'change_span_end', id:sid, old_end:oldEnd, new_end:newEnd}]);
            } else {
                // 結果的に削除
                makeEdits([{action:'remove_span', id:sid, begin:spans[sid].span.begin, end:spans[sid].span.end, type:spans[sid].type}]);
            }

        } else {

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var spanLen = getFocusPosBySpan(focusChilds, selection);

            // 修正
            var startPosition = adjustSpanStart2(spans[selection.focusNode.parentNode.id]['span']['begin'] + spanLen +  selection.focusOffset);

            dismissBrowserSelection();

            // 選択範囲がメークの最後と同じであれば、
            // startPositionがマークのendよりも大きくなるので、
            // その場合は何もしない
            if(startPosition < spans[sid]['span']['end']) {
                var oldBegin = spans[sid]['span']['begin']
                var newBegin = startPosition;
                makeEdits([{action:'change_span_begin', id:sid, old_begin:oldBegin, new_begin:newBegin}]);
            } else {
                // 結果的に削除
                makeEdits([{action:'remove_span', id:sid, begin:spans[sid].span.begin, end:spans[sid].span.end, type:spans[sid].type}]);
            }
        }
    }


    function separateElement(spans, selection, selectedId) {
        sortSpans(spans);

        var anchorChilds = selection.anchorNode.parentNode.childNodes;
        var focusChilds = selection.focusNode.parentNode.childNodes;

        var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
        var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

        if(absoluteAnchorPosition > absoluteFocusPosition) {
            var tmpPos = absoluteAnchorPosition;
            absoluteAnchorPosition = absoluteFocusPosition;
            absoluteFocusPosition = tmpPos;
        }


        // nodeの始点または終点を選択した場合
        var selectedJson = spans[selectedId];

        //if(absoluteAnchorPosition == spans[selectedId]['begin'] ||  absoluteFocusPosition == spans[selectedId]['end']) {
        if(absoluteAnchorPosition == selectedJson['span']['begin'] ||  absoluteFocusPosition == selectedJson['span']['end']) {
            //if(startPos == 0) {
            if(absoluteAnchorPosition == selectedJson['span']['begin']) {
                newStart = absoluteFocusPosition;

                // 修正
                var startPosition = adjustSpanStart(newStart);

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
                var endPosition = adjustSpanEnd(newEnd);
                //jsonを書き換え
                selectedJson['span']['end'] = endPosition;

            }

        } else {
            var newStart = absoluteFocusPosition;
            var newEnd = selectedJson['span']['end'];
            var newLabel = selectedJson['category'];

            var newStartPosition = adjustSpanStart(newStart);
            var newEndPosition = adjustSpanEnd(newEnd);

            // 分離した前方の終了位置
            // var separatedEndPos = adjustSpanEnd(offset + startPos);
            var separatedEndPos = adjustSpanEnd(absoluteAnchorPosition);

            // 分離した前方の終了位置と分離した後方の終了位置が異なる場合のみ
            if(separatedEndPos != newEndPosition && selectedJson['span']['begin'] != newStartPosition) {
                //jsonを書き換え
                //spans[selection.anchorNode.parentElement.id]['end'] = separatedEndPos;
                selectedJson['span']['end'] = separatedEndPos;

                // 新しいjsonを追加
                var obj = new Object();
                obj['span'] = {"begin": newStartPosition, "end": newEndPosition};
                //obj['begin'] = newStartPosition;
                //obj['end'] = newEndPosition;
                obj['category'] = newLabel;
                obj['created_at'] = selectedJson['created_at'];
                obj['id'] = getSpanNewId();
                spans.push(obj);
            }
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

        if(anchorRange.compareBoundaryPoints(Range.START_TO_START, selectedRange) > 0 && anchorRange.compareBoundaryPoints( Range.END_TO_END, selectedRange ) > 0) {
            // anchorNodeのspan選択用素の中にあれば、選択用素のIDを返す
            return selected.attr('id');
        }

        // anchorNodeが選択用素の中に無い場合は、anchoreNodeのidを返す
        return anchorNode.parentElement.id;
    }


    /*
     * 同じ文字列を探す
     * ただし、両外側はdelimiterであること
     */
    function findSameString(startPos, endPos, spanType) {
        var ospan = sourceDoc.substring(startPos, endPos);
        var strLen = endPos - startPos;

        var ary = new Array();
        var from = 0;
        while (true) {
            var sameStrPos = sourceDoc.indexOf(ospan, from);
            if (sameStrPos == -1) break;

            if (!isOutsideDelimiter(sourceDoc, sameStrPos, sameStrPos + strLen)) {
                var obj = new Object();
                obj['span'] = {"begin": sameStrPos, "end": sameStrPos + strLen};
                obj['type'] = spanType;

                var isExist = false;
                for(var sid in spans) {
                    if(spans[sid]['span']['begin'] == obj['span']['begin'] && spans[sid]['span']['end'] == obj['span']['end'] && spans[sid].category == obj.category) {
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

        for(var i = 0; i < childNodes.length; i++) {

            // docareaChilds[i]がfocusNodeならば、繰り返しを抜ける
            if(childNodes[i] == selection.focusNode) {
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

            pos = spans[selection.focusNode.parentNode.id]['span']["begin"];
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
            pos = spans[selection.anchorNode.parentNode.id]['span']["begin"];
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
     * check the bondaries: used afte replication
     */
    function isOutsideDelimiter(document, startPos, endPos) {
        var precedingChar = document.charAt(startPos-1);
        var followingChar = document.charAt(endPos);

        if (!isDelimiter(precedingChar) || !isDelimiter(followingChar)) {return true}
        else {return false}
    }


    /*
     * dismiss the default selection by the browser
    */
    function dismissBrowserSelection() {
        if (window.getSelection){
            var selection = window.getSelection();
            selection.collapse(document.body, 0);
        } else {
            var selection = document.selection.createRange();
            selection.setEndPoint("EndToStart", selection);
            selection.select();
        }
    }


    $(document).keydown(function(e) {
        // mac command
        if (OSName == "MacOS") {
            switch (browserNameVersion[0]) {
                case 'Firefox':
                    if (e.keyCode == 224) {isCtrl = true}
                    break;
                case 'Opera':
                    if (e.keyCode == 17) {isCtrl = true}
                    break;
                default:
                    if (e.keyCode == 91 || e.keyCode == 93) {isCtrl = true}
            }

        }

        // win ctrl
        else if (e.keyCode == 17) {isCtrl = true}

        // shift
        if (e.keyCode == 16) {isShift = true}

        // win ctrl + alt / mac command + option
        if (isCtrl && e.keyCode == 18) {isCtrlAlt = true}

        switch (e.keyCode) {
            case 46: // win delete / mac fn + delete
            case  8: // backspace key
                var edits;

                if (mode == 'span') {
                    var spanRemoves = new Array();
                    while (spanIdsSelected.length > 0) {
                        sid = spanIdsSelected.pop();
                        spanRemoves.push({action:'remove_span', id:sid, begin:spans[sid].span.begin, end:spans[sid].span.end, type:spans[sid].type});
                        instancesPerSpan[sid].forEach(selectInstance);
                        relationsPerSpanInstance[sid].forEach(selectRelation);
                    }

                    var instanceRemoves = new Array();
                    while (instanceIdsSelected.length > 0) {
                        iid = instanceIdsSelected.pop();
                        instanceRemoves.push({action:'remove_instance', id:iid, object:instances[iid].object, type:instances[iid].type});
                        relationsPerSpanInstance[iid].forEach(selectRelation);
                    }

                    var relationRemoves = new Array();
                    while (relationIdsSelected.length > 0) {
                        rid = relationIdsSelected.pop();
                        relationRemoves.push({action:'remove_relation', id:rid, subject:relations[rid].subject, object:relations[rid].object, type:relations[rid].type});
                    }

                    var modificationRemoves = new Array();
                    while (modificationIdsSelected.length > 0) {
                        mid = modificationIdsSelected.pop();
                        modificationRemoves.push({action:'remove_modification', id:mid, object:modifications[mid].object, type:modifications[mid].type});
                    }

                    edits = modificationRemoves.concat(relationRemoves, instanceRemoves, spanRemoves);
                } else if (mode == 'relation') {
                    var relationRemoves = new Array();
                    while (relationIdsSelected.length > 0) {
                        rid = relationIdsSelected.pop();
                        relationRemoves.push({action:'remove_relation', id:rid, subject:relations[rid].subject, object:relations[rid].object, type:relations[rid].type});
                    }

                    var modificationRemoves = new Array();
                    while (modificationIdsSelected.length > 0) {
                        mid = modificationIdsSelected.pop();
                        modificationRemoves.push({action:'remove_modification', id:mid, object:modifications[mid].object, type:modifications[mid].type});
                    }

                    edits = modificationRemoves.concat(relationRemoves);
                }

                makeEdits(edits);
                break;
            case 73: // 'i' key
                if (mode == 'span') {
                    createInstance();
                }
                break;
            case 191: // '?' key
                if (mode == 'span') {
                    createModification("Speculation");
                }
                break;
            case 88: // 'x' key
                if (mode == 'span') {
                    if (!e.ctrlKey) {createModification("Negation")}
                }
                break;
            case 90: // 'z' key
                if (lastEditPtr > -1) {doUndo()}
                break;
            case 89: // 'y' key
                if (lastEditPtr < editHistory.length - 1) {doRedo()}
                break;
            case 37: // left arrow key: move the span selection backward
                if (spanIdsSelected.length == 1) {
                    var spanIdx = spanIds.indexOf(spanIdsSelected.pop());
                    clearSpanSelection()
                    spanIdx--;
                    if (spanIdx < 0) {spanIdx = spanIds.length - 1}
                    selectSpan(spanIds[spanIdx]);
                }
                break;
            case 39: //right arrow key: move the span selection forward
                if (spanIdsSelected.length == 1) {
                    var spanIdx = spanIds.indexOf(spanIdsSelected.pop());
                    clearSpanSelection()
                    spanIdx++;
                    if (spanIdx > spanIds.length - 1) {spanIdx = 0}
                    selectSpan(spanIds[spanIdx]);
                }
                break;
            case 86: // 'v' key: change to view mode
                if (!e.ctrlKey) {pushButtonView()}
                break
            case 83: // 's' key: change to span edit mode
                if (!e.ctrlKey) {pushButtonSpan()}
                break;
            case 82: // 'r' key: change to relation edit mode
                if (!e.ctrlKey) {pushButtonRelation()}
                break;
        }
    });


    $(document).keyup(function(e){
        // mac command
        if (OSName == "MacOS") {
            switch (browserNameVersion[0]) {
                case 'Firefox':
                    if (e.keycode == 224) {isCtrl = false}
                    break;
                case 'Opera':
                    if (e.keycode == 17) {isCtrl = false}
                    break;
                default:
                    if (e.keycode == 91 || e.keycode == 93) {isCtrl = false}
            }

        }

        // win ctrl
        else if (e.keyCode == 17) {isCtrl = false}

        // win alt / mac option
        if (e.keyCode == 18) {isCtrlAlt = false}

        if (e.keyCode == 16) {isShift = false}
    });


    function createInstance() {
        clearInstanceSelection();

        var maxIdNum = getMaxInsannsId();
        for (var i = 0; i < spanIdsSelected.length; i++) {
            var id = "E" + (++maxIdNum);
            makeEdits([{action:'new_instance', id:id, object:spanIdsSelected[i], type:instanceTypeDefault}]);
        }
    }


    /*
     * event handler (instance is clicked)
     */
    function instanceClicked(e) {
        cancelBubble(e);
        var id = $(this).attr('id');

        if (mode == "span") {
            if (isCtrl) {
                if (isInstanceSelected(id)) {deselectInstance(id)}
                else {selectInstance(id)}
            }
            else {
                clearSpanSelection();
                clearInstanceSelection();
                selectInstance(id);
            }
        }

        else if (mode == "relation") {
            clearRelationSelection();

            if (spanIdsSelected.length == 0 && instanceIdsSelected.length == 0) {
                selectInstance(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (spanIdsSelected.length > 0) {sid = spanIdsSelected[0]}
                else {sid = instanceIdsSelected[0]}

                makeEdits([{action:'new_relation', id:rid, type:relationTypeDefault, subject:sid, object:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSpanSelection();
                    clearInstanceSelection();

                    // continuous chaining
                    if (e.shiftKey) {selectInstance(oid)}
                }
            }
        }
    }


    function isInstanceSelected(iid) {
        return (instanceIdsSelected.indexOf(iid) > -1);
    }

    function selectInstance(iid) {
        if (!isInstanceSelected(iid)) {
            $('#' + iid).addClass('selected');
            instanceIdsSelected.push(iid);
        }
    }

    function deselectInstance(iid) {
        var i = instanceIdsSelected.indexOf(iid);
        if (i > -1) {
            $('#' + iid).removeClass('selected');
            instanceIdsSelected.splice(i, 1);
        }
    }

    function clearInstanceSelection() {
        $('.instance.selected').removeClass('selected');
        instanceIdsSelected.length = 0;
    }


    function createModification(type) {
        var i;

        if (mode == "relation") {
            return;

            for(i = 0; i <  relationIdsSelected.length; i++) {
                var conn = relationIdsSelected[i];

                var obj = new Object();
                obj["type"] = type;
                obj["object"] = conn.getParameter("connId");
                obj["id"] = "M" + (getMaxModannsId() + 1);
                obj['created_at'] = (new Date()).getTime();

                modanns.push(obj);

                // 選択状態にする
                modificationIdsSelected.push(obj["id"]);
            }

            relationIdsSelected.length = 0;

        } else if (mode == "span") {
            var edits = [];

            var maxIdNum = getMaxModannsId(); 
            for (i = 0; i < instanceIdsSelected.length; i++) {
                var iid = instanceIdsSelected[i];
                if ($('#' + iid + ' .modification.' + type).length) continue;
                var mid = "M" + (++maxIdNum);
                edits.push({action:'new_modification', id:mid, object:iid, type:type});
            }

            if (edits.length > 0) makeEdits(edits);
        }
    }


    function modificationClicked(e) {
        if (mode == 'span' || mode == 'relation') {
            cancelBubble(e);
            var id = $(this).attr('id');

            if (isCtrl) {
                if (isModificationSelected(id)) {deselectModification(id)}
                else {selectModification(id)}
            }

            else {
                clearSpanSelection();
                clearInstanceSelection();
                clearModificationSelection();
                selectModification(id);
            }
        }
    }


    $('.span_type_label').live('click', function() {
        var edits = new Array();

        for (var i = 0; i < spanIdsSelected.length; i++) {
            var sid = spanIdsSelected[i];
            var oldType = spans[sid].type;
            var newType = $(this).text();

            if (newType != oldType) {
                edits.push({action:"change_span_type", id:sid, old_type:oldType, new_type:newType});
            }
        }

        if (edits.length > 0) {makeEdits(edits)}
    });


    $('.relation_type_label').live('click', function() {
        var edits = new Array();

        for(var i = 0; i < relationIdsSelected.length; i++) {
            var rid = relationIdsSelected[i];
            var oldType = relations[rid].type;
            var newType = $(this).text();

            if (newType != oldType) {
                edits.push({action:"change_relation_type", id:rid, old_type:oldType, new_type:newType});
            }
        }

        if (edits.length > 0) {makeEdits(edits)}
    });


    $('.modtype_apply_btn').live('click', function() {
        for(var i in modificationIdsSelected) {
            var modId = modificationIdsSelected[i];

            for(var j in modanns) {
                var mod = modanns[j];

                if(modId == mod["id"]) {
                    mod['type'] = $(this).text();
                }
            }
        }
    });


    // 'Load' button control
    function enableButtonLoad() {
        $("#btn_load").off('click', getAnnotation).on('click', getAnnotation);
        renderButtonEnable($("#btn_load"))
    }


    function getAnnotation() {
        var location = prompt("Load document with annotation. Enter the location:", targetUrl);
        if (location != null && location != "") {
            getAnnotationFrom(location);
        }
    }

    // 'Save' button control
    function enableButtonSave() {
        $("#btn_save").off('click', saveAnnotation).on('click', saveAnnotation);
        $(window).off('beforeunload', leaveMessage).on('beforeunload', leaveMessage);
        renderButtonEnable($("#btn_save"))
    }

    function disableButtonSave() {
        $("#btn_save").off('click', saveAnnotation);
        $(window).off('beforeunload', leaveMessage);
        renderButtonDisable($("#btn_save"))
    }

    function saveAnnotation() {
        var location = prompt("Save annotation to the document. Enter the location:", targetUrl);
        if (location != null && location != "") {
            saveAnnotationTo(location);
        }
    }

    jQuery.fn.center = function () {
        this.css("position","absolute");
        this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
        this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
        return this;
    };


    function saveAnnotationTo(location) {
        $('#loading').center().show();

        var catanns = [];
        for (var i in spans) {catanns.push(spans[i])}
        for (var i = 0; i < catanns.length; i++) {
            catanns[i]['category'] = catanns[i]['type'];
        }

        var insanns = [];
        for (var i in instances) {insanns.push(instances[i])}

        var relanns = [];
        for (var i in relations) {relanns.push(relations[i])}

        var modanns = [];
        for (var i in modifications) {modanns.push(modifications[i])}

        var postData = {
            "text": sourceDoc,
            "catanns": catanns,
            "insanns": insanns,
            "relanns": relanns,
            "modanns": modanns
        }

        $.ajax({
            type: "post",
            url: location,
            data: {annotations:JSON.stringify(postData)},
            crossDomain: true,
            xhrFields: {withCredentials: true},
            success: function(res){
                $('#loading').hide();
                $('#notice').html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showSource();
                });
                lastSavePtr = lastEditPtr;
                changeButtonStateSave();
            },
            error: function(res, textStatus, errorThrown){
                $('#loading').hide();
                $('#notice').html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showSource();
                });
            }
        });
    }

    // 'Replicate Auto' button control
    function enableButtonReplicateAuto() {
        $("#btn_replicate_auto").off('click', pushButtonReplicateAuto).on('click', pushButtonReplicateAuto);
        renderButtonEnable($("#btn_replicate_auto"));
    }

    function disableButtonReplicateAuto() {
        $("#btn_replicate_auto").off('click', pushButtonReplicateAuto);
        renderButtonDisable($("#btn_replicate_auto"));
    }

    function pushButtonReplicateAuto() {
        if (!isButtonDisabled($('#btn_replicate_auto'))) {
            renderButtonPush($('#btn_replicate_auto'));
            replicateAuto = true;
            $('#btn_replicate_auto').off('click', pushButtonReplicateAuto);
            $('#btn_replicate_auto').off('click', unpushButtonReplicateAuto).on('click', unpushButtonReplicateAuto);
        }
    }

    function unpushButtonReplicateAuto() {
        if (!isButtonDisabled($('#btn_replicate_auto'))) {
            renderButtonUnpush($('#btn_replicate_auto'));
            replicateAuto = false;
            $('#btn_replicate_auto').off('click', unpushButtonReplicateAuto);
            $('#btn_replicate_auto').off('click', pushButtonReplicateAuto).on('click', pushButtonReplicateAuto);
        }
    }

    // 'Replicate' button control
    function enableButtonReplicate() {
        $("#btn_replicate").off('click', replicate).on('click', replicate);
        renderButtonEnable($("#btn_replicate"));
    }

    function disableButtonReplicate() {
        $("#btn_replicate").off('click', replicate);
        renderButtonDisable($("#btn_replicate"));
    }

    function replicate() {
        if (spanIdsSelected.length == 1) {
            makeEdits(getSpanReplicates(spans[spanIdsSelected[0]]));
        }
        else alert('You can replicate span annotation when there is only span selected.');
    }


    function getSpanReplicates(span) {
        var oid      = span['id'];
        var startPos = span["span"]["begin"];
        var endPos   = span["span"]["end"];
        var type     = span["type"];

        var cspans = findSameString(startPos, endPos, type); // candidate spans
        var maxIdNum = getSpanMaxIdNum();
        if (parseInt(oid.slice(1)) > maxIdNum) {
            maxIdNum = parseInt(oid.slice(1));
        }

        var nspans = new Array(); // new spans
        for (var i = 0; i < cspans.length; i++) {
            cspan = cspans[i];

            // check boundary crossing
            var crossing_p = false;
            for (sid in spans) {
                if (
                    (cspan['span']['begin'] > spans[sid]['span']['begin'] && cspan['span']['begin'] < spans[sid]['span']['end'] && cspan['span']['end'] > spans[sid]['span']['end'])
                    ||
                    (cspan['span']['begin'] < spans[sid]['span']['begin'] && cspan['span']['end'] > spans[sid]['span']['begin'] && cspan['span']['end'] < spans[sid]['span']['end'])
                   ) {
                   crossing_p = true;
                   break;
                }
            }

            if(!crossing_p) {
                cspan['id'] = 'T' + (++maxIdNum);
                nspans.push(cspan);
            }
        }

        var edits = new Array();
        for (var i = 0; i < nspans.length; i++) {
            edits.push({action: "new_span", id:nspans[i]['id'], begin:nspans[i]['span']['begin'], end:nspans[i]['span']['end'], type:nspans[i]['type']});
        }

        return edits;
    }


    function makeEdits(edits, context) {
        for (var i = 0; i < edits.length; i++) {
            var edit = edits[i];
            switch (edit.action) {
                // span operations
                case 'new_span' :
                    // model
                    newSpan(edit.id, edit.begin, edit.end, edit.type);
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    instancesPerSpan[edit.id] = new Array();
                    relationsPerSpanInstance[edit.id] = new Array();
                    // rendering
                    renderSpan(edit.id, spanIds);
                    // select
                    selectSpan(edit.id);
                    break;
                case 'remove_span' :
                    //model
                    delete spans[edit.id];
                    delete instancesPerSpan[edit.id];
                    delete relationsPerSpanInstance[edit.id];
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    break;
                case 'change_span_begin' :
                    //model
                    spans[edit.id].span.begin = edit.new_begin;
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(edit.id, spanIds);
                    $('span#' + edit.id).addClass('selected');
                    break;
                case 'change_span_end' :
                    //model
                    spans[edit.id].span.end = edit.new_end;
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(edit.id, spanIds);
                    $('span#' + edit.id).addClass('selected');
                    break;
                case 'change_span_type' :
                    spans[edit.id].type = edit.new_type;
                    $('#' + edit.id).css('backgroundColor', spanTypes[edit.new_type]['color']);
                    // selection
                    selectSpan(edit.id);
                    break;

                // instance operations
                case 'new_instance' :
                    // model
                    instances[edit.id] = {id:edit.id, object:edit.object, type:edit.type};
                    instancesPerSpan[edit.object].push(edit.id);
                    relationsPerSpanInstance[edit.id] = new Array();
                    // rendering
                    renderInstance(edit.id);
                    indexInstancePositions([edit.object]);
                    positionInstances(instancesPerSpan[edit.object]);
                    break;
                case 'remove_instance' :
                    //model
                    delete instances[edit.id];
                    var arr = instancesPerSpan[edit.object];
                    arr.splice( arr.indexOf( edit.id ), 1 );
                    delete relationsPerSpanInstance[edit.id];
                    //rendering
                    $('#' + edit.id).remove();
                    indexInstancePositions([edit.object]);
                    positionInstances(instancesPerSpan[edit.object]);
                    break;
                case 'change_instance_object' :
                    //model
                    instances[edit.id].object = edit.new_object;
                    //rendering
                    $('#' + edit.id).css('borderColor', spanTypes[edit.new_object]['color']);
                    break;

                // relation operations
                case 'new_relation' :
                    // model
                    relations[edit.id] = {id:edit.id, subject:edit.subject, object:edit.object, type:edit.type};
                    relationsPerSpanInstance[edit.subject].push(edit.id);
                    relationsPerSpanInstance[edit.object].push(edit.id);
                    // rendering
                    connectors[edit.id] = renderRelation(edit.id);
                    // selection
                    selectRelation(edit.id);
                    break;
                case 'remove_relation' :
                    // model
                    delete relations[edit.id];
                    var arr = relationsPerSpanInstance[edit.subject];
                    arr.splice( arr.indexOf( edit.id ), 1 );
                    arr = relationsPerSpanInstance[edit.object];
                    arr.splice( arr.indexOf( edit.id ), 1 );
                    // rendering
                    destroyRelation(edit.id);
                    break;
                case 'change_relation_type' :
                    // model
                    relations[edit.id].type = edit.new_type;
                    // rendering
                    connectors[edit.id].setPaintStyle(connectorTypes[edit.new_type+"_selected"]["paintStyle"]);
                    connectors[edit.id].setHoverPaintStyle(connectorTypes[edit.new_type+"_selected"]["hoverPaintStyle"]);
                    connectors[edit.id].setLabel('[' + edit.id + '] ' + edit.new_type);
                    // selection
                    selectRelation(edit.id);
                    break;

                // modification operations
                case 'new_modification' :
                    // model
                    modifications[edit.id] = {id:edit.id, object:edit.object, type:edit.type};
                    // rendering
                    renderModification(edit.id);
                    break;
                case 'remove_modification' :
                    // model
                    delete modifications[edit.id];
                    // rendering
                    destroyModification(edit.id);
                    break;
                default :
                    // do nothing
            }
        }

        // update rendering
        indexPositions(spanIds);
        positionInstances(Object.keys(instances));
        renewConnections(Object.keys(relations));

        if (mode == 'view' || mode =='relation') {
            makeClones();
        }

        switch (context) {
            case 'undo' :
            case 'redo' :
                clearSpanSelection();
                clearInstanceSelection();
                clearRelationSelection();
                clearModificationSelection();
                break;
            default :
                editHistory.splice(++lastEditPtr);
                editHistory.push(edits);
                changeButtonStateUndoRedo();
                changeButtonStateSave();
        }
    }


    function revertEdits(edits) {
        var redits = new Array();
        for (var i = edits.length - 1; i >= 0; i--) {
            edit = edits[i];
            var redit = cloneEdit(edit);
            switch (edit.action) {
                case 'new_span' :
                    redit.action = 'remove_span';
                    break;
                case 'remove_span' :
                    redit.action = 'new_span';
                    break;
                case 'change_span_begin' :
                    redit.old_begin = edit.new_begin;
                    redit.new_begin = edit.old_begin;
                    break;
                case 'change_span_end' :
                    redit.old_end = edit.new_end;
                    redit.new_end = edit.old_end;
                    break;
                case 'change_span_type' :
                    redit.old_type = edit.new_type;
                    redit.new_type = edit.old_type;
                    break;
                case 'new_instance' :
                    redit.action = 'remove_instance';
                    break;
                case 'remove_instance' :
                    redit.action = 'new_instance';
                    break;
                case 'change_instance_object' :
                    redit.old_object = edit.new_object;
                    redit.new_object = edit.old_object;
                    break;
                case 'new_relation' :
                    redit.action = 'remove_relation';
                    break;
                case 'remove_relation' :
                    redit.action = 'new_relation';
                    break;
                case 'change_relation_subject' :
                    redit.old_subject = edit.new_subject;
                    redit.new_subject = edit.old_subject;
                    break;
                case 'change_relation_object' :
                    redit.old_object = edit.new_object;
                    redit.new_object = edit.old_object;
                    break;
                case 'change_relation_type' :
                    redit.old_type = edit.new_type;
                    redit.new_type = edit.old_type;
                    break;
                case 'new_modification' :
                    redit.action = 'remove_modification';
                    break;
                case 'remove_modification' :
                    redit.action = 'new_modification';
                    break;
            }
            redits.push(redit);
        }
        makeEdits(redits, 'undo');
    }


    function cloneEdit(e) {
        c = new Object();
        for (p in e) {c[p] = e[p]}
        return c;
    }


    // mode button controls
    function pushButtonView() {
        unpushButtonSpan();
        unpushButtonRelation();
        renderButtonPush($('#btn_mode_view'));
        $('#btn_mode_view').off('click', pushButtonView);
        changeMode('view');
    }

    function unpushButtonView() {
        renderButtonUnpush($('#btn_mode_view'));
        $('#btn_mode_view').off('click', pushButtonView).on('click', pushButtonView);
    }

    function pushButtonSpan() {
        unpushButtonView();
        unpushButtonRelation();
        renderButtonPush($('#btn_mode_span'));
        $('#btn_mode_span').off('click', pushButtonSpan);
        changeMode('span');
    }

    function unpushButtonSpan() {
        if (!isButtonDisabled($('#btn_mode_span'))) {
            renderButtonUnpush($('#btn_mode_span'));
            $('#btn_mode_span').off('click', pushButtonSpan).on('click', pushButtonSpan);
        }
    }

    function disableButtonSpan() {
        $('#btn_mode_span').off('click', pushButtonSpan);
        renderButtonDisable($('#btn_mode_span'));
    }

    function pushButtonRelation() {
        unpushButtonView();
        unpushButtonSpan();
        renderButtonPush($('#btn_mode_relation'));
        $('#btn_mode_relation').off('click', pushButtonRelation);
        changeMode('relation');
    }

    function unpushButtonRelation() {
        if (!isButtonDisabled($('#btn_mode_relation'))) {
            renderButtonUnpush($('#btn_mode_relation'));
            $('#btn_mode_relation').off('click', pushButtonRelation).on('click', pushButtonRelation);
        }
    }

    function disableButtonRelation() {
        $('#btn_mode_relation').off('click', pushButtonRelation);
        renderButtonDisable($('#btn_mode_relation'));
    }

    function changeMode(tomode) {
        clearSpanSelection();
        clearInstanceSelection();
        clearModificationSelection();
        clearRelationSelection();

        mode = tomode;

        if (mode == 'view') {
            $('#ins_area').css('z-index', 10);
            $('#rel_area').removeAttr('style');

            disableButtonReplicate();
            disableButtonReplicateAuto();

            makeClones();
        } else if (mode == 'span') {
            $('#ins_area').removeAttr('style');
            $('#rel_area').css('z-index', -10);

            enableButtonReplicate();
            enableButtonReplicateAuto();

            destroyClones();
        } else if (mode == 'relation') {
            $('#ins_area').css('z-index', 10);
            $('#rel_area').removeAttr('style');

            disableButtonReplicate();
            disableButtonReplicateAuto();

            makeClones();
        }
    }


    function makeClones() {
        $('#clone_area').empty();

        // clone spans
        var clones = new Array();

        for (var sid in spans) {
            var span = $('#' + sid);

            obj = new Object();
            obj["id"] = "clone_" + sid;
            obj["left"] = span.get(0).offsetLeft;
            obj["top"] = span.get(0).offsetTop;
            obj["width"] = span.innerWidth();
            obj["height"] = span.innerHeight();
            obj["title"] = '[' + sid + '] ' + spans[sid]["category"];
            clones.push(obj);
        }

        // put smaller divs forward 
        sortCloneByWidth(clones);
        for (var i = 0; i < clones.length; i++) {
            var obj = clones[i];
            var div = '<div id="' + obj['id'] + '" '
                    + 'class="clone_span" '
                    + 'style="position:absolute; '
                    + 'left:'   + obj['left']  + 'px; '
                    + 'top:'    + obj['top']  + 'px; '
                    + 'width:'  + obj["width"] + 'px; '
                    + 'height:' + obj["height"] +'px" '
                    + 'title="' + obj['title'] + '"></div>';
            $('#clone_area').append(div);
        }

        $('.clone_span').click(spanClicked);
    }


    function destroyClones() {
        $('#clone_area').empty();
    }


    function sortCloneByWidth(ary) {
        function compare(a, b) {
            return(b['width'] - a['width']);
        }
        ary.sort(compare);
    }


    /*
     * conversion from HEX to RGBA color
     */
    function colorTrans(color, opacity) {
        var c = color.slice(1);
        var r = c.substr(0,2);
        var g = c.substr(2,2);
        var b = c.substr(4,2);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);

        return 'rgba(' + r + ', ' +  g + ', ' + b + ', ' + opacity + ')';
    }


    function renderRelations(rids) {
        indexRelationSize(rids);
        sortRelationIds(rids);
        jsPlumb.reset();

        for(var i = 0; i < rids.length; i++) {
            connectors[rids[i]] = renderRelation(rids[i]);
        }
    }


    function renderRelation (rid) {
        var sourceId = relations[rid]['subject'];
        var targetId = relations[rid]['object'];

        /*
         * Determination of curviness
         */
        var sourceX = positions[sourceId]["center"];
        var targetX = positions[targetId]["center"];

        var sourceY, targetY;
        if ((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T") ) {
            sourceY = positions[sourceId]["bottom"];
            targetY = positions[targetId]["bottom"];
        } else {
            sourceY = positions[sourceId]["top"];
            targetY = positions[targetId]["top"];
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
        var type = relations[rid]['type'];
        var rgba = colorTrans(relationTypes[type]['color'], connOpacity);
        var sourceElem = $('#' + sourceId);
        var targetElem = $('#' + targetId);

        // jsPlumb.makeSource(sourceElem, {
        //     anchor:sourceAnchor,
        //     paintStyle:{ fillStyle:rgba, radius:2 }
        // });

        // jsPlumb.makeTarget(targetElem, {
        //     anchor:targetAnchor,
        //     paintStyle:{ fillStyle:rgba, radius:2 }
        // });

        var label = '[' + rid + '] ' + type;
        var labelClass = "label " + type;
        var labelId = "label_" + rid;

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            anchors:[sourceAnchor, targetAnchor],
            connector:[ "Bezier", {curviness:curviness}],
            paintStyle: connectorTypes[type]["paintStyle"],
            hoverPaintStyle: connectorTypes[type]["hoverPaintStyle"],
            tooltip:'[' + rid + '] ' + type,
            parameters:{"id":rid, "label":label}
        });

        conn.addOverlay(["Arrow", { width:10, length:12, location:1 }]);
        conn.setLabel({label:label, cssClass:"label"});
        conn.getLabelOverlay().hide();
        conn.bind("click", connectorClicked);
        conn.bind("mouseenter", connectorHoverBegin);
        conn.bind("mouseexit", connectorHoverEnd);
        return conn;       
    }


    function connectorClicked (conn, e) {
        if (mode == "relation") {
            var rid  = conn.getParameter("id");

            clearSpanSelection();
            clearInstanceSelection();
            clearModificationSelection();

            if (isRelationSelected(rid)) {
                deselectRelation(rid);
            } else {
                if (!e.ctrlKey) {clearRelationSelection()}
                selectRelation(rid);
            }
        }
        cancelBubble();
        return false;
    }

    function connectorHoverBegin (conn, e) {
        conn.getLabelOverlay().show();
    }

    function connectorHoverEnd (conn, e) {
        conn.getLabelOverlay().hide();
    }


    function isRelationSelected(rid) {
        return (relationIdsSelected.indexOf(rid) > -1);
    }

    function selectRelation(rid) {
        if (!isRelationSelected(rid)) {
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].type + "_selected"] ["paintStyle"]);
            relationIdsSelected.push(rid);
        }
    }


    function deselectRelation(rid) {
        var i = relationIdsSelected.indexOf(rid);
        if (i > -1) {
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].type]["paintStyle"]);
            relationIdsSelected.splice(i, 1);
        }
    }


    function clearRelationSelection() {
        while (relationIdsSelected.length > 0) {
            var rid = relationIdsSelected.pop();
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].type]["paintStyle"]);
        }
    }


    function renewConnections (rids) {
        indexRelationSize(rids);
        sortRelationIds(rids);

        for (var i = 0; i < rids.length; i++) {
            var rid = rids[i];

            /*
             * recompute curviness
             */
            var sourceId = relations[rid]['subject'];
            var targetId = relations[rid]['object'];

            var sourceX = positions[sourceId]["center"];
            var targetX = positions[targetId]["center"];

            var sourceY, targetY;
            if ((sourceId.substr(0,1) == "T") && (targetId.substr(0,1) == "T")) {
                sourceY = positions[sourceId]["bottom"];
                targetY = positions[targetId]["bottom"];
            } else {
                sourceY = positions[sourceId]["top"];
                targetY = positions[targetId]["top"];
            }

            var xdiff = Math.abs(sourceX - targetX);
            var ydiff = Math.abs(sourceY - targetY);
            var curviness = xdiff * xrate + ydiff * yrate + c_offset;
            curviness /= 2.4;

            if (sourceId == targetId) {
                curviness = 30;
            }

            var conn = connectors[rid];
            var label = conn.getLabel();
            conn.removeAllOverlays();
            conn.endpoints[0].repaint();
            conn.endpoints[1].repaint();
            conn.setConnector(["Bezier", {curviness:curviness}], true);
            conn.addOverlay(["Arrow", { width:10, length:12, location:1 }], true);
            conn.setLabel({label:label, cssClass:"label"});
            conn.getLabelOverlay().hide();
        }
    }


    function destroyRelation (rid) {
        var c = connectors[rid];
        var endpoints = c.endpoints;
        jsPlumb.deleteEndpoint(endpoints[0]);
        jsPlumb.deleteEndpoint(endpoints[1]);
    }


    function renderInstances(iids) {
        for(var i = 0; i < iids.length; i++) {
            renderInstance(iids[i]);
        }

        positionInstances(iids);
    }


    function renderInstance(iid) {
        var instance = instances[iid];
        var object = spans[instances[iid]['object']];
        var borderColor = spanTypes[object.type]['color'];
        var div = '<div id="' + iid +'" class="instance" title="[' + iid + '] ' + instance.type + ' : ' + object.type + '" style="width:' + insWidth +'px; height:' + insHeight + 'px; border:' + insBorder + 'px solid ' + borderColor + '; position:absolute" ></div>';
        $('#ins_area').append(div);
        $('#' + iid).live('click', instanceClicked);
        $('#' + iid).live('mouseover mouseout', instanceMouseHover);
    }


    function positionInstances(iids) {
        for(var i = 0; i < iids.length; i++) {
            var iid = iids[i];

            // divを書く位置
            var posX = positions[iid]["center"];
            var posY = positions[iid]["top"];

            $('#' + iid).css("left", posX);
            $('#' + iid).css("top", posY);
        }
    }


    function renderModifications(mids) {
        for(var i = 0; i < mids.length; i++) {
            renderModification(mids[i]);
        }
    }


    function renderModification(mid) {
        var type = modifications[mid]["type"];
        var oid = modifications[mid]["object"];
        var symbol;
        if (type == "Negation") {
            symbol = 'X';
        } else if (type == "Speculation") {
            symbol = '?';
        }
        $('#' + oid).append('<span class="modification" id="' + mid + '">' + symbol + '</span>');
        $('#' + mid).live('click', modificationClicked);
    }


    function destroyModification(mid) {
        $('#' + mid).remove();
    }

    function isModificationSelected(mid) {
        return (modificationIdsSelected.indexOf(mid) > -1);
    }

    function selectModification(mid) {
        if (!isModificationSelected(mid)) {
            $('#' + mid).addClass('selected');
            modificationIdsSelected.push(mid);
        }
    }

    function deselectModification(mid) {
        var i = spanIdsSelected.indexOf(mid);
        if (i > -1) {
            $('#' + mid).removeClass('selected');
            modificationIdsSelected.splice(i, 1);
        }
    }

    function clearModificationSelection() {
        $('modification.selected').removeClass('selected');
        modificationIdsSelected.length = 0;
    }


    function changeConnectionOpacity(opacity) {
        connOpacity = opacity;
        setConnectorTypes();

        for (var rid in relations) {
            var rtype = relations[rid]["type"];
            connectors[rid].setPaintStyle(connectorTypes[rtype]["paintStyle"]);
        }

        for (var i = 0; i < relationIdsSelected; i++) {
            var id = relationIdsSelected[i];
            var type = relations[id]["type"];
            connectors[id].setPaintStyle(connectorTypes[type+"_selected"]["paintStyle"]);
        }
    }

    function detectOS() {
        OSName="Unknown OS";
        if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    }


    navigator.sayswho= (function(){
        var N= navigator.appName, ua= navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
        return M;
    })();


    $(window).resize(function(){
      redraw();
    });

    function redraw() {
        indexPositions(Object.keys(spans));
        positionInstances(Object.keys(instances));
        renewConnections(Object.keys(relations));

        changeMode(mode);
    }

    function leaveMessage() {
        return "There is a change that has not been saved. If you leave now, you will lose it.";
    }
});