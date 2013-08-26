$(document).ready(function() {
    var OSName;
    var browserNameVersion;

    var mode = 'span';  // screen mode: view | span(default) | relation
    var replicateAuto = false;

    var sourceDoc;
    var pars;

    // selected slements
    var spanIdsSelected;
    var entityIdsSelected;
    var modificationIdsSelected;
    var relationIdsSelected;

    var clipBoard;

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

    // configuration data
    var delimiterCharacters;
    var nonEdgeCharacters;

    var entityTypes;
    var relationTypes;
    var modificationTypes;

    var blockTypeDefault = 'block';
    var entityTypeDefault;
    var relationTypeDefault;
    var modificationTypeDefault;

    // annotation data (Objects)
    var blocks;
    var spans;
    var entities;
    var relations;
    var modifications;

    var blockThreshold = 100;

    var connectors;
    var connectorTypes;

    // index
    var entitiesPerSpan;
    var relationsPerSpan;

    // target URL
    var targetUrl = '';

    var editHistory;
    var lastEditPtr;
    var editHistoryLastSavePtr;

    var typeHeight = 0;
    var gridWidthGap = 0;
    var typeMarginTop = 12;
    var typeMarginBottom = 2;
    var palletHeightMax = 100;

    var mouseX;
    var mouseY;
    $('#body').mousemove(function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;
    });

    function getSizes() {
        var div = '<div id="temp_grid" class="grid" style="width:10px; height:auto"></div>';
        $('#annotation_box').append(div);

        div = '<div id="temp_type" class="type" title="[Temp] Temp" >T0</div>';
        $('#temp_grid').append(div);

        div = '<div id="temp_instance_pane" class="instance_pane"><div id="temp_entity" class="entity"></div></div>';
        $('#temp_type').append(div);

        gridWidthGap = $('#temp_grid').outerWidth() - 10;
        typeHeight = $('#temp_type').outerHeight();
        entityHeight = $('#temp_entity').outerHeight();
        $('#temp_grid').remove();
    }

    getUrlParameters();

    // get the url parameters: beginning of the program
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
            url: "config/default.json",
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
                    getAnnotationFrom(targetUrl);
                },
                error: function() {
                    alert('could not read the configuration from the location you specified.');
                }
            });
        } else {
            getAnnotationFrom(targetUrl);
        }
    }


    function showTarget() {
        if (targetUrl != "") {
            var targetDoc = targetUrl.replace(/\/annotations\.json$/, '');
            $('#message').html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
        }
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


    function setConfig(config){
        if (config['delimiter characters'] != undefined) {
            delimiterCharacters = config['delimiter characters'];
        }

        if (config['non-edge characters'] != undefined) {
            nonEdgeCharacters = config['non-edge characters'];
        }

        entityTypes = new Object();
        entityTypeDefault = null;
        if (config['entity types'] != undefined) {
            var entity_types = config['entity types'];
            for (var i in entity_types) {
                entityTypes[entity_types[i]["name"]] = entity_types[i];
                if (entity_types[i]["default"] == true) {entityTypeDefault = entity_types[i]["name"];}
            }
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
        if (targetUrl != null && targetUrl != "") {
            $('#textae_container').css('cursor', 'wait');
            $.ajax({
                type: "GET",
                url: targetUrl,
                dataType: "json",
                crossDomain: true,
                xhrFields: {withCredentials: true},
                success: function(annotation) {
                    if (annotation.text != undefined) {
                        loadAnnotation(annotation);
                        initJsPlumb();
                        renderAnnotation();
                        initialize();
                    } else {
                        alert("read failed.");
                    }
                    $('#textae_container').css('cursor', 'auto');
                },
                error: function(res, textStatus, errorThrown){
                    alert("connection failed.");
                    $('#textae_container').css('cursor', 'auto');
                }
            });
        }
        else {
            initialize();
        }
    }


    function initialize() {
        detectOS();
        browserNameVersion = navigator.sayswho

        // $('#text_box').off('mouseup', doMouseup).on('mouseup', doMouseup);
        // $('#body').off('mouseup', cancelSelect).on('mouseup', cancelSelect);
        $('#body').off('mouseup', doMouseup).on('mouseup', doMouseup);
        // $('#body').off('click', cancelSelect).on('click', cancelSelect);

        spanIdsSelected = new Array();
        entityIdsSelected = new Array();
        relationIdsSelected = new Array();
        modificationIdsSelected = new Array();

        clipBoard = new Array();

        editHistory = new Array();
        lastEditPtr = -1;
        lastSavePtr = -1;

        enableButtonRead();
        enableButtonReplicateAuto();
        enableButtonHelp();
        enableButtonAbout();

        changeButtonStateUndoRedo();
        changeButtonStateSave();
        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateCopy();
        changeButtonStatePaste();

        showTarget();
        // if (entityTypeDefault == null || targetUrl === "") disableButtonSpan();
        // if (relationTypeDefault == null || targetUrl === "") disableButtonRelation();
        // pushButtonSpan();
    }


    function loadAnnotation(data) {
        sourceDoc = data.text;

        spans     = new Object();
        entities  = new Object();
        relations = new Object();

        entitiesPerSpan = new Object();
        typesPerSpan = new Object();
        positions = new Object();
        connectors = new Object();

        if (data.denotations != undefined) {
            for (var i = 0; i < data.denotations.length ; i++) {
                var d = data.denotations[i];

                var sid = getSid(d['span']['begin'], d['span']['end']);
                spans[sid] = {begin:d['span']['begin'], end:d['span']['end']};

                entities[d['id']] = {span:sid, type:d['obj']};

                if (!entityTypes[d['obj']]) entityTypes[d['obj']] = {};
                if (entityTypes[d['obj']]['count']) entityTypes[d['obj']]['count']++;
                else entityTypes[d['obj']]['count'] = 1;

                var tid = getTid(sid, d['obj']);
                if (typesPerSpan[sid]) {
                    if (typesPerSpan[sid].indexOf(tid) < 0) typesPerSpan[sid].push(tid);
                } 
                else typesPerSpan[sid] = [tid];

                if (entitiesPerSpan[sid]) entitiesPerSpan[sid].push(d['id']);
                else entitiesPerSpan[sid] = [d['id']];
            }
        }

        spanIds = Object.keys(spans); // maintained sorted by the position.
        sortSpanIds(spanIds);

        if (data.relations != undefined) {
            for (var i = 0; i < data.relations.length ; i++) {
                relations[data.relations[i]["id"]] = data.relations[i];
            }
        }
        relationIds = Object.keys(relations);
    }


    // span Id
    function getSid(begin, end) {
        return 'S' + begin + '-' + end;
    }

    // type id
    function getTid(sid, type) {
        return sid + '-' + type;
    }

    function indexPositions(ids) {
        for (var i in ids) indexPosition(ids[i]);
    }

    function indexPosition(id) {
        var e = $('#' + id);
        positions[id] = {};
        positions[id].top    = e.get(0).offsetTop;
        positions[id].left   = e.get(0).offsetLeft;
        positions[id].width  = e.outerWidth();
        positions[id].height = e.outerHeight();
    }

    function getLineSpace() {
        var lines = docArea.getClientRects();
        lineSpace = lines[1].top - lines[0].bottom;
        return lineSpace;
    }

    function renderAnnotation() {
        container = document.getElementById("body");
        docArea = document.getElementById("text_box");

        docArea.innerHTML = sourceDoc;
        getLineSpace();
        container.style.paddingTop = lineSpace/2 + 'px';

        docArea.innerHTML = sourceDoc.split("\n").map(function(par){return '<p>' + par + '</p>'}).join("\n");
        pars = {};
        var pid = 0;
        var pre_len = 0;
        $('#text_box p').each(function(){
            // var len = $(this).context.innerText.length;
            var len = $(this).text().length;
            pars['P' + pid] = {begin:pre_len, end:pre_len + len};
            pre_len += len + 1;
            $(this).attr('id', 'P' + pid++);
        });

        $('#annotation_box').empty();
        renderHelp();
        renderAbout();
        renderEntityTypePallet();

        renderSpans(spanIds);
        indexPositions(spanIds);

        getSizes();
        renderEntitiesOfSpans(spanIds);
    }

    function indexRelationSize(rids) {
        for (var i = 0; i < rids.length; i++) {
            rid = rids[i];
            var sourceX = positions[relations[rid]['subj']]["center"];
            var targetX = positions[relations[rid]['obj']]["center"];
            relations[rid]["size"] = Math.abs(sourceX - targetX);
        }
    }


    function sortRelationIds(rids) {
        function compare(a, b) {
            return (relations[b]['size'] - relations[a]['size']);
        }
        rids.sort(compare);
    }


    // sort the span IDs by the position
    function sortSpanIds(sids) {
        function compare(a, b) {
            return((spans[a]['begin'] - spans[b]['begin']) || (spans[b]['end'] - spans[a]['end']));
        }
        sids.sort(compare);
    }

    function getPidBySid(sid) {
        for (var pid in pars) {
            if ((spans[sid].begin >= pars[pid].begin) && (spans[sid].end <= pars[pid].end)) return pid;
        }
        return null;
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


    function doUndo() {
        clearSpanSelection();
        clearEntitySelection();
        clearRelationSelection();
        clearModificationSelection();

        revertEdits(editHistory[lastEditPtr--]);
        changeButtonStateUndoRedo();
        changeButtonStateSave();
    }


    function doRedo() {
        clearSpanSelection();
        clearEntitySelection();
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
            disableButtonWrite();
        } else {
            enableButtonWrite();
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


    function renderEntityTypePallet() {
        var types = Object.keys(entityTypes);
        types.sort(function(a,b) {return (entityTypes[b].count - entityTypes[a].count)});
        if (!entityTypeDefault) {entityTypeDefault = types[0]}

        var pallet = '<div id="entity_type_pallet" class="pallet"><table>';
        for (var i = 0; i < types.length; i++) {
            var t = types[i];
            var uri = entityTypes[t]["uri"];

            pallet += '<tr class="entity_type"';
            pallet += color(t)? ' style="background-color:' + color(t) + '"' : '';
            pallet += '>';

            pallet += '<th><input type="radio" name="etype" class="entity_type_radio" label="' + t + '"';
            pallet += (t == entityTypeDefault)? ' title="default type" checked' : '';
            pallet += '/></th>';

            pallet += '<td class="entity_type_label" label="' + t + '">' + t + '</td>';

            if (uri) pallet += '<th title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"/></a></th>';

            pallet += '</tr>';
        }
        pallet += '</table></div>';


        if ($('#entity_type_pallet').length == 0) $('#annotation_box').append(pallet);
        else                                      $('#entity_type_pallet').html(pallet);

        var p = $('#entity_type_pallet');
        p.css('position', 'absolute');
        p.css('display', 'none');
        p.css('width', p.outerWidth() + 15);
        $('#entity_type_pallet > table').css('width', '100%');
        if (p.outerHeight() > palletHeightMax) p.css('height', palletHeightMax);

        $('.entity_type_radio').off('mouseup', setEntityTypeDefault).on('mouseup', setEntityTypeDefault);
        $('.entity_type_label').off('mouseup', setEntityType).on('mouseup', setEntityType);
   }

    function enableButtonEntity() {
        $("#btn_entity").off('click', createEntity).on('click', createEntity);
        renderButtonEnable($("#btn_entity"));
    }

    function disableButtonEntity() {
        $("#btn_entity").off('click', createEntity);
        renderButtonDisable($("#btn_entity"));
    }

    function changeButtonStateEntity() {
        if (numSpanSelection() > 0) enableButtonEntity();
        else disableButtonEntity();
    }

    function newLabel() {
        if ($(".entity.ui-selected").length > 0) {
            var new_type = prompt("Please enter a new label","");
            if (entityTypes[new_type] == undefined) {
                entityTypes[new_type] = {};
                renderEntityTypePallet();
            }

            var edits = [];
            $(".entity.ui-selected").each(function() {
                var eid = this.id;
                edits.push({action:'change_entity_type', id:eid, old_type:entities[eid].type, new_type:new_type});
            });
            if (edits.length > 0) makeEdits(edits);
        }
        return false;
    }


    function enableButtonNewLabel() {
        $("#btn_new_label").off('click', newLabel).on('click', newLabel);
        renderButtonEnable($("#btn_new_label"));
    }

    function disableButtonNewLabel() {
        $("#btn_new_label").off('click', newLabel);
        renderButtonDisable($("#btn_new_label"));
    }

    function changeButtonStateNewLabel() {
        if (numEntitySelection() > 0) enableButtonNewLabel();
        else disableButtonNewLabel();
    }


    function enableButtonPallet() {
        $("#btn_pallet").off('click', showPallet).on('click', showPallet);
        renderButtonEnable($("#btn_pallet"));
    }

    function disableButtonPallet() {
        $("#btn_pallet").off('click', showPallet);
        renderButtonDisable($("#btn_pallet"));
    }

    function changeButtonStatePallet() {
        if (numEntitySelection() > 0) enableButtonPallet();
        else disableButtonPallet();
    }

    function showPallet(e) {
        var p = $('#entity_type_pallet');
        p.css('top', mouseY);
        p.css('left', mouseX);
        p.css('display', 'block');
        return false;
    }

    // set the default type of denoting object
    function setEntityTypeDefault() {
        entityTypeDefault = $(this).attr('label');
        return false;
    }

    // set the type of an entity
    function setEntityType() {
        var new_type = $(this).attr('label')
        var edits = [];
        $(".entity.ui-selected").each(function() {
            var eid = this.id;
            edits.push({action:'change_entity_type', id:eid, old_type:entities[eid].type, new_type:new_type});
        });
        if (edits.length > 0) makeEdits(edits);
        return false;
    }

    function renderPalletWidget(id, items) {
        var pallet = '<div id="entity_type_pallet" class="pallet"><table>';
        for (var i = 0; i < items.length; i++) {
            var t = items[i];
            var uri = entityTypes[t]["uri"];

            pallet += '<tr class="entity_type"';
            pallet += color(t)? ' style="background-color:' + color(t) + '"' : '';
            pallet += '>';

            pallet += '<th><input type="radio" name="etype" class="entity_type_radio" label="' + t + '"';
            pallet += (t == entityTypeDefault)? ' title="default type" checked' : '';
            pallet += '/></th>';

            pallet += '<td class="entity_type_label" label="' + t + '">' + t + '</td>';

            if (uri) pallet += '<th title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"/></a></th>';

            pallet += '</tr>';
        }
        pallet += '</table></div>';

        $('#annotation_box').append(pallet);

        var p = $('#entity_type_pallet');
        p.css('position', 'absolute');
        p.css('display', 'none');
        p.css('width', p.outerWidth() + 15);
        $('#entity_type_pallet > table').css('width', '100%');
        if (p.outerHeight() > palletHeightMax) p.css('height', palletHeightMax);

        $('.entity_type_radio').off('mouseup', setEntityTypeDefault).on('mouseup', setEntityTypeDefault);
        $('.entity_type_label').off('mouseup', setEntityType).on('mouseup', setEntityType);
    }


    function showPallet(e) {
        var p = $('#entity_type_pallet');
        p.css('top', mouseY);
        p.css('left', mouseX);
        p.css('display', 'block');
        return false;
    }


    function color(type) {
        if (entityTypes && entityTypes[type] && entityTypes[type]['color']) return entityTypes[type]['color'];
        else null;
    }


    function renderSpans(sids) {
        for (var i = 0; i < sids.length; i++) {
            renderSpan(sids[i], sids.slice(0, i));
        }
    }


    // assume the spanIds are sorted by the position.
    // when there are embedded spans, the embedding ones comes earlier then embedded ones.
    function renderSpan(sid, spanIds) {
        var element = document.createElement('span');
        element.setAttribute('id', sid);
        element.setAttribute('title', '[' + sid + '] ');
        element.setAttribute('class', 'span');

        var pid = getPidBySid(sid);
        var beg = spans[sid].begin;
        var end = spans[sid].end;
        var len = end - beg;

        var c; // index of current span
        for (c = 0; c < spanIds.length; c++) if (spanIds[c] == sid) break;

        var begnode = document.getElementById(pid).childNodes[0];
        var begoff = beg - pars[pid].begin;

        // adjust the begin node and offset
        if (c > 0) {
            var p = c - 1; // index of preceding span

            // when the previous span includes the region
            if (spans[spanIds[p]].end > beg) {
                begnode = document.getElementById(spanIds[p]).childNodes[0];
                begoff  = beg - spans[spanIds[p]].begin;
            }

            else {
                if (getPidBySid(spanIds[p]) == pid) {
                    // find the outermost preceding span
                    var pnode = document.getElementById(spanIds[p]);
                    while (pnode.parentElement &&
                            spans[pnode.parentElement.id] &&
                            spans[pnode.parentElement.id].end > spans[pnode.id].begin &&
                            spans[pnode.parentElement.id].end < end) {pnode = pnode.parentElement}

                    begnode = pnode.nextSibling;
                    begoff = beg - spans[pnode.id].end;
                }
            }
        }

        var endnode = begnode;
        var endoff = begoff + len;

        // if there is an intervening span, adjust the end node and offset
        if ((c < spanIds.length - 1) && (end > spans[spanIds[c + 1]].begin)) {
            var i = c + 1; // index of the rightmost intervening span
            // if there is a room for further intervening
            while (i < spanIds.length - 1) {
                // find the next span at the same level
                var n = i + 1;
                while ((n < spanIds.length) && (spans[spanIds[n]].begin < spans[spanIds[i]].end)) n++;
                if (n == spanIds.length) break;
                if (end > spans[spanIds[n]].begin) i = n;
                else break;
            }
            endnode = document.getElementById(spanIds[i]).nextSibling;
            endoff = end - spans[spanIds[i]].end;
        }

        var range = document.createRange();
        range.setStart(begnode, begoff);
        range.setEnd(endnode, endoff);
        range.surroundContents(element);

        $('#' + sid).off('mouseup', spanClicked).on('mouseup', spanClicked);
    }


    function spanClicked(e) {
        $('#entity_type_pallet').css('display', 'none');
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        // if drag, bubble up
        if (!selection.isCollapsed) {
            return true;
        }

        if (mode == "span") {
            var id = $(this).attr('id');

            if (e.ctrlKey) {
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
                clearEntitySelection();
                selectSpan(id);
            }
        }

        else if (mode == "relation") {
            var id = $(this).attr('id').split('_')[1];  // in clone area, clone_id

            clearRelationSelection();

            if (spanIdsSelected.length == 0 && entityIdsSelected.length == 0) {
                selectSpan(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (spanIdsSelected.length > 0) {sid = spanIdsSelected[0]}
                else {sid = entityIdsSelected[0]}

                makeEdits([{action:'new_relation', id:rid, pred:relationTypeDefault, subj:sid, obj:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSpanSelection();
                    clearEntitySelection();

                    // continuous chaining
                    if (e.shiftKey) {selectSpan(oid)}
                }
            }
        }

        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePaste();
        return false;
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


    function numSpanSelection() {
        return spanIdsSelected.length;
    }

    function popSpanSelection() {
        var sid = spanIdsSelected.pop();
        $('#' + sid).removeClass('selected');
        return sid;
    }

    // adjust the beginning position of a span
    function adjustSpanBegin(beginPosition) {
        var pos = beginPosition;
        while (isNonEdgeCharacter(sourceDoc.charAt(pos))) {pos++}
        while (!isDelimiter(sourceDoc.charAt(pos)) && pos > 0 && !isDelimiter(sourceDoc.charAt(pos - 1))) {pos--}
        return pos;
    }

    // adjust the end position of a span
    function adjustSpanEnd(endPosition) {
        var pos = endPosition;
        while (isNonEdgeCharacter(sourceDoc.charAt(pos - 1))) {pos--}
        while (!isDelimiter(sourceDoc.charAt(pos)) && pos < sourceDoc.length) {pos++}
        return pos;
    }


    // adjust the beginning position of a span for shortening
    function adjustSpanBegin2(beginPosition) {
        var pos = beginPosition;
        while ((pos < sourceDoc.length) && (isNonEdgeCharacter(sourceDoc.charAt(pos)) || !isDelimiter(sourceDoc.charAt(pos - 1)))) {pos++}
        return pos;
    }

    // adjust the end position of a span for shortening
    function adjustSpanEnd2(endPosition) {
        var pos = endPosition;
        while ((pos > 0) && (isNonEdgeCharacter(sourceDoc.charAt(pos - 1)) || !isDelimiter(sourceDoc.charAt(pos)))) {pos--}
        return pos;
    }


    function doMouseup(e) {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        if (
            // when the whole div is selected by e.g., triple click
            (range.startContainer == $('#text_box').get(0)) ||
            // when Shift is pressed
            (e.shiftKey) ||
            // when nothing is selected
            (selection.isCollapsed)
            )
        {
            // bubbles go up
            cancelSelect();
            dismissBrowserSelection();
            return true;
        }

        var anchorPosition = getAnchorPosition(selection);
        var focusPosition = getFocusPosition(selection);

        // no boundary crossing: normal -> create a entity
        if (selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {
            clearSpanSelection();

            // switch the position when the selection is made from right to left
            if (anchorPosition > focusPosition) {
                var tmpPos = anchorPosition;
                anchorPosition = focusPosition;
                focusPosition = tmpPos;
            }

            // when the whole text is selected by e.g., triple click (Chrome)
            if ((anchorPosition == 0) && (focusPosition == sourceDoc.length)) {
                // do nothing. bubbles go up
                return true;
            }

            var beginPosition = adjustSpanBegin(anchorPosition);
            var endPosition = adjustSpanEnd(focusPosition);
            var sid = getSid(beginPosition, endPosition);

            if (!spans[sid]) {
                if (endPosition - beginPosition > blockThreshold) {
                    makeEdits([{action:'new_span', id:sid, begin:beginPosition, end:endPosition, block:true, type:blockTypeDefault}]);
                }

                else {
                    var edits = [{action:'new_span', id:sid, begin:beginPosition, end:endPosition}];

                    if (replicateAuto) {
                        var replicates = getSpanReplicates({begin:beginPosition, end:endPosition});
                        edits = edits.concat(replicates);
                    }
                    if (edits.length > 0) makeEdits(edits);
                }
            }
        }

        // boundary crossing: exception
        else {
            if (selection.anchorNode.parentNode.parentNode == selection.focusNode.parentNode) {
                clearSpanSelection();
                clearEntitySelection();
                expandSpan(selection.anchorNode.parentNode.id, selection);
            }
            else if (selection.anchorNode.parentNode == selection.focusNode.parentNode.parentNode) {
                clearSpanSelection();
                clearEntitySelection();
                shortenSpan(selection.focusNode.parentNode.id, selection);
            }
            else if (numSpanSelection() == 1) {
                var sid = popSpanSelection();
                
                // drag began inside the selected span (expansion)
                if ((anchorPosition > spans[sid].begin) && (anchorPosition < spans[sid].end)) {
                    // The focus node should be at one level above the selected node.
                    if ($('#' + sid).get(0).parentNode.id == selection.focusNode.parentNode.id) expandSpan(sid, selection);
                    else {
                        selectSpan(sid);
                        alert('A span cannot be expanded to make a boundary crossing.');
                    }
                }

                // drag ended inside the selected span (shortening)
                else if ((focusPosition > spans[sid].begin) && (focusPosition < spans[sid].end)) {
                    if ($('#' + sid).get(0).id == selection.focusNode.parentNode.id) shortenSpan(sid, selection);
                    else {
                        selectSpan(sid);
                        alert('A span cannot be shrinked to make a boundary crossing.');
                    }
                }

                else alert('It is ambiguous for which span you want to adjust the boundary. Reselect the span, and try again.');
            }
            else {
                alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
            }
        }

        dismissBrowserSelection();
        cancelBubble(e);
        return false;
    }


    function cancelBubble(e) {
        e = e || window.event;
        e.cancelBubble = true;
        e.bubbles=false;
        if (e.stopPropagation) e.stopPropagation();
    }


    // get the max value of the connector Id
    function getMaxConnId() {
        var maxIdNum = 0;
        for (var rid in relations) {
            var idNum = parseInt(rid.slice(1));
            if (idNum > maxIdNum) {
                maxIdNum = idNum;
            }
        }
        return maxIdNum;
    }

    // get the max value of the entity Id
    function getMaxEntityId() {
        var maxIdNum = 0;
        for (var eid in entities) {
            var idNum = parseInt(eid.slice(1));
            if (idNum > maxIdNum) {
                maxIdNum = idNum;
            }
        }
        return maxIdNum;
    }


    function newSpan(id, begin, end, block, type) {
        spans[id] = {begin:begin, end:end, block:block, type:type};
        return id;
    }


    function cancelSelect(e) {
        // if drag, bubble up
        if (!window.getSelection().isCollapsed) {
            dismissBrowserSelection();
            return true;
        }

        clearSpanSelection();
        clearEntitySelection();
        clearRelationSelection();
        clearModificationSelection();
        $('#entity_type_pallet').css('display', 'none');
        hideHelp();
        hideAbout();
        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateCopy();
        changeButtonStatePaste();
    }


    function expandSpan(sid, selection) {
        var edits = [];

        var focusPosition = getFocusPosition(selection);

        var range = selection.getRangeAt(0);
        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        // expand to the right
        if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
            var newBegin = adjustSpanBegin(focusPosition);
            var new_sid = getSid(newBegin, spans[sid]['end']);
            if (!spans[new_sid]) {
                edits.push({action:'new_span', id:new_sid, begin:newBegin, end:spans[sid]['end']});
                for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
                    var eid  = entitiesPerSpan[sid][i];
                    var type = entities[eid].type;
                    edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                    edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                }
                edits.push({action:'remove_span', id:sid, begin:spans[sid]['begin'], end:spans[sid]['end']});
            }
        }

        // expand to the left
        else {
            var newEnd = adjustSpanEnd(focusPosition);
            var new_sid = getSid(spans[sid]['begin'], newEnd);
            if (!spans[new_sid]) {
                edits.push({action:'new_span', id:new_sid, begin:spans[sid]['begin'], end:newEnd});
                for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
                    var eid  = entitiesPerSpan[sid][i];
                    var type = entities[eid].type;
                    edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                    edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                }
                edits.push({action:'remove_span', id:sid, begin:spans[sid]['begin'], end:spans[sid]['end']});
            }
        }
        if (edits.length > 0) makeEdits(edits);
    }


    function shortenSpan(sid, selection) {
        var edits = [];

        var focusPosition = getFocusPosition(selection);

        var range = selection.getRangeAt(0);
        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        // shorten the right boundary
        if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
            var newEnd = adjustSpanEnd2(focusPosition);

            if (newEnd > spans[sid]['begin']) {
                var new_sid = getSid(spans[sid]['begin'], newEnd);
                if (!spans[new_sid]) {
                    edits.push({action:'new_span', id:new_sid, begin:spans[sid]['begin'], end:newEnd});
                    for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
                        var eid  = entitiesPerSpan[sid][i];
                        var type = entities[eid].type;
                        edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                        edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                    }
                    edits.push({action:'remove_span', id:sid, begin:spans[sid]['begin'], end:spans[sid]['end']});
                }
            }
            else {
                selectSpan(sid);
                removeElements();
            }
        }

        // shorten the left boundary
        else {
            var newBegin = adjustSpanBegin2(focusPosition);

            if (newBegin < spans[sid]['end']) {
                var new_sid = getSid(newBegin, spans[sid]['end']);
                if (!spans[new_sid]) {
                    edits.push({action:'new_span', id:new_sid, begin:newBegin, end:spans[sid]['end']});
                    for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
                        var eid  = entitiesPerSpan[sid][i];
                        var type = entities[eid].type;
                        edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                        edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                    }
                    edits.push({action:'remove_span', id:sid, begin:spans[sid]['begin'], end:spans[sid]['end']});
                }
            }
            else {
                selectSpan(sid);
                removeElements();
            }
        }
        if (edits.length > 0) makeEdits(edits);
    }

    
    // search same strings
    // both ends should be delimiter characters
    function findSameString(startPos, endPos) {
        var oentity = sourceDoc.substring(startPos, endPos);
        var strLen = endPos - startPos;

        var ary = new Array();
        var from = 0;
        while (true) {
            var sameStrPos = sourceDoc.indexOf(oentity, from);
            if (sameStrPos == -1) break;

            if (!isOutsideDelimiter(sourceDoc, sameStrPos, sameStrPos + strLen)) {
                var obj = new Object();
                obj['begin'] = sameStrPos;
                obj['end'] = sameStrPos + strLen;

                var isExist = false;
                for(var sid in spans) {
                    if(spans[sid]['begin'] == obj['begin'] && spans[sid]['end'] == obj['end'] && spans[sid].category == obj.category) {
                        isExist = true;
                        break;
                    }
                }

                if(!isExist && startPos != sameStrPos) {
                    ary.push(obj);
                }
            }
            from = sameStrPos + 1;
        }
        return ary;
    }


    function getFocusPosition(selection) {
        // assumption: text_box only includes <p> elements that contains <span> elements that represents spans.
        var cid = selection.focusNode.parentNode.id
        var pos = (cid == 'text_box')? 0 :
                  (cid.charAt(0) == 'P')? pars[cid].begin : spans[cid].begin;

        var childNodes = selection.focusNode.parentElement.childNodes;
        for (var i = 0; childNodes[i] != selection.focusNode; i++) { // until the focus node
            pos += (childNodes[i].nodeName == "#text")? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
        }

        return pos += selection.focusOffset;
    }


    function getAnchorPosition(selection) {
        // assumption: text_box only includes <p> elements that contains <span> elements that represents spans.
        var cid = selection.anchorNode.parentNode.id
        var pos = (cid == 'text_box')? 0 :
                  (cid.charAt(0) == 'P')? pars[cid].begin : spans[cid].begin;

        var childNodes = selection.anchorNode.parentNode.childNodes;
        for (var i = 0; childNodes[i] != selection.anchorNode; i++) { // until the anchor node
            pos += (childNodes[i].nodeName == "#text")? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
        }

        return pos + selection.anchorOffset;
    }


    // check the bondaries: used after replication
    function isOutsideDelimiter(document, startPos, endPos) {
        var precedingChar = document.charAt(startPos-1);
        var followingChar = document.charAt(endPos);

        if (!isDelimiter(precedingChar) || !isDelimiter(followingChar)) {return true}
        else {return false}
    }


    // dismiss the default selection by the browser
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
            case 27: // 'ESC' key
                cancelSelect();
                break;
            case 65: // 'a' key
                getAnnotation();
                break;
            case 83: // 's' key
                saveAnnotation();
                break;
            case 46: // win delete / mac fn + delete
            case 68: // 'd' key
                removeElements();
                break;
            case 69: // 'e' key
                createEntity();
                break;
            case 72: // 'h' key
                showHelp();
                break;
            case 67: // 'c' key
                copyEntities();
                break;
            case 86: // 'v' key
                pasteEntities();
                break;
            case 81: // 'q' key
                // show type selector
                showPallet();
                break;
            case 87: // 'w' key
                // show type selector
                newLabel();
                break;
            case 82: // 'r' key:
                // replicate span annotatino
                replicate();
                break;
            // case 191: // '?' key
            //     if (mode == 'span') {
            //         createModification("Speculation");
            //     }
            //     break;
            // case 88: // 'x' key
            //     if (mode == 'span') {
            //         if (!e.ctrlKey) {createModification("Negation")}
            //     }
            //     break;
            case 90: // 'z' key
                if (lastEditPtr > -1) {doUndo()}
                break;
            case 88: // 'x' key
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
            // case 86: // 'v' key: change to view mode
            //     if (!e.ctrlKey && !isButtonDisabled($('#btn_mode_view'))) {pushButtonView()}
            //     break
            // case 83: // 's' key: change to span edit mode
            //     if (!e.ctrlKey && !isButtonDisabled($('#btn_mode_span'))) {pushButtonSpan()}
            //     break;
            // case 82: // 'r' key: change to relation edit mode
            //     if (!e.ctrlKey && !isButtonDisabled($('#btn_mode_relation'))) {pushButtonRelation()}
            //     break;
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


    // 'delete' button control
    function enableButtonDelete() {
        $("#btn_delete").off('click', removeElements).on('click', removeElements);
        renderButtonEnable($("#btn_delete"));
    }

    function disableButtonDelete() {
        $("#btn_delete").off('click', removeElements);
        renderButtonDisable($("#btn_delete"));
    }

    function changeButtonStateDelete() {
        if ((numSpanSelection() > 0) || ($(".ui-selected").length > 0)) {
            enableButtonDelete();
        } else {
            disableButtonDelete();
        }
    }


    function removeElements() {
        var edits;

        var spanRemoves = new Array();
        while (spanIdsSelected.length > 0) {
            var sid = spanIdsSelected.pop();
            spanRemoves.push({action:'remove_span', id:sid, begin:spans[sid].begin, end:spans[sid].end, obj:spans[sid].obj});
            entitiesPerSpan[sid].forEach(selectEntity);
            // relationsPerSpanEntity[sid].forEach(selectRelation);
        }

        var entityRemoves = new Array();
        $(".ui-selected").each(function() {
            var eid = this.id;
            entityRemoves.push({action:'remove_denotation', id:eid, span:entities[eid].span, type:entities[eid].type});
        });

        var relationRemoves = new Array();
        while (relationIdsSelected.length > 0) {
            rid = relationIdsSelected.pop();
            relationRemoves.push({action:'remove_relation', id:rid, subj:relations[rid].subj, obj:relations[rid].obj, pred:relations[rid].pred});
        }

        var modificationRemoves = new Array();
        while (modificationIdsSelected.length > 0) {
            mid = modificationIdsSelected.pop();
            modificationRemoves.push({action:'remove_modification', id:mid, obj:modifications[mid].obj, pred:modifications[mid].pred});
        }

        edits = modificationRemoves.concat(relationRemoves, entityRemoves, spanRemoves);

        if (edits.length > 0) makeEdits(edits);
    }


    // 'copy' button control
    function enableButtonCopy() {
        $("#btn_copy").off('click', copyEntities).on('click', copyEntities);
        renderButtonEnable($("#btn_copy"));
    }

    function disableButtonCopy() {
        $("#btn_copy").off('click', copyEntities);
        renderButtonDisable($("#btn_copy"));
    }

    function changeButtonStateCopy() {
        if ($(".ui-selected").length > 0) enableButtonCopy();
        else disableButtonCopy();
    }

    function copyEntities() {
        clipBoard.length = 0;
        $(".ui-selected").each(function() {
             clipBoard.push(this.id);
         });
    }

    // 'paste' button control
    function enableButtonPaste() {
        $("#btn_paste").off('click', pasteEntities).on('click', pasteEntities);
        renderButtonEnable($("#btn_paste"));
    }

    function disableButtonPaste() {
        $("#btn_paste").off('click', pasteEntities);
        renderButtonDisable($("#btn_paste"));
    }

    function changeButtonStatePaste() {
        if ((clipBoard.length > 0) && (numSpanSelection() > 0)) {
            enableButtonPaste();
        } else {
            disableButtonPaste();
        }
    }

    function pasteEntities() {
        var edits = new Array();
        var maxIdNum = getMaxEntityId()
        while (sid = popSpanSelection()) {
            for (var e in clipBoard) {
                var id = "E" + (++maxIdNum);
                edits.push({action:'new_denotation', id:id, span:sid, type:entities[clipBoard[e]].type});
            }
        }
        if (edits.length > 0) makeEdits(edits);
    }


    function createEntity() {
        clearEntitySelection();

        var maxIdNum = getMaxEntityId()
        while (numSpanSelection() > 0) {
            sid = popSpanSelection();
            var id = "E" + (++maxIdNum);
            makeEdits([{action:'new_denotation', id:id, span:sid, type:entityTypeDefault}]);
        }
    }


    function selectEntity(eid) {
        $('#' + eid).addClass('ui-selected');
    }

    function clearEntitySelection() {
        $('.entity.ui-selected').removeClass('ui-selected');
        entityIdsSelected.length = 0;
    }

    function numEntitySelection() {
        return $('.entity.ui-selected').length;
    }

    function createModification(pred) {
        var i;

        if (mode == "relation") {
            return;

            for(i = 0; i <  relationIdsSelected.length; i++) {
                var conn = relationIdsSelected[i];

                var obj = new Object();
                obj['pred'] = pred;
                obj['obj'] = conn.getParameter('connId');
                obj['id'] = 'M' + (getMaxModificationId() + 1);
                obj['created_at'] = (new Date()).getTime();

                modifications.push(obj);

                // add to selection
                modificationIdsSelected.push(obj["id"]);
            }

            relationIdsSelected.length = 0;

        } else if (mode == "span") {
            var edits = [];

            var maxIdNum = getMaxModificationId(); 
            for (i = 0; i < instanceIdsSelected.length; i++) {
                var iid = instanceIdsSelected[i];
                if ($('#' + iid + ' .modification.' + pred).length) continue;
                var mid = "M" + (++maxIdNum);
                edits.push({action:'new_modification', id:mid, obj:iid, pred:pred});
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
                clearEntitySelection();
                clearModificationSelection();
                selectModification(id);
            }
        }
    }

    function renderHelp() {
        $('#annotation_box').append("<div id='help'></div>");
        hideHelp();
        $('#help').off('mouseup', hideHelp).on('mouseup', hideHelp);
        $('#help').html("<h3>Help (Keyboard short-cuts)</h3><img src='images/keyhelp.png' />");
    }

    function showHelp() {
        var p = $('#help');
        p.css('display', 'block');
        p.center();
        return false;
    }

    function hideHelp() {
        $('#help').css('display', 'none');
        return false;
    }
    
    // 'Help' button control
    function enableButtonHelp() {
        $("#btn_help").off('click', showHelp).on('click', showHelp);
        renderButtonEnable($("#btn_help"))
    }

    function renderAbout() {
        $('#annotation_box').append("<div id='about'></div>");
        hideAbout();
        $('#about').off('mouseup', hideAbout).on('mouseup', hideAbout);
        $('#about').html("<h3>About TextAE (Text Annotation Editor)</h3>" +
                    "<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>" +
                    "<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>" +
                    "<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。" +
                    "今後は自動アノテーションの種類を増やす計画です。</p>" +
                    "<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>" +
                    "<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。" +
                    "作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>" +
                    "<p>まだ開発中のサービスであり、実装すべき機能が残っています。" +
                    "ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>");
    }

    function showAbout() {
        var p = $('#about');
        p.css('display', 'block');
        p.center();
        return false;
    }

    function hideAbout() {
        $('#about').css('display', 'none');
        return false;
    }
    
    // 'About' button control
    function enableButtonAbout() {
        $("#btn_about").off('click', showAbout).on('click', showAbout);
        renderButtonEnable($("#btn_about"))
    }



    // 'Read' button control
    function enableButtonRead() {
        $("#btn_read").off('click', getAnnotation).on('click', getAnnotation);
        renderButtonEnable($("#btn_read"))
    }


    function getAnnotation() {
        var location = prompt("Load document with annotation. Enter the location:", targetUrl);
        if (location != null && location != "") {
            getAnnotationFrom(location);
        }
    }

    // 'Save' button control
    function enableButtonWrite() {
        $("#btn_write").off('click', saveAnnotation).on('click', saveAnnotation);
        $(window).off('beforeunload', leaveMessage).on('beforeunload', leaveMessage);
        renderButtonEnable($("#btn_write"))
    }

    function disableButtonWrite() {
        $("#btn_write").off('click', saveAnnotation);
        $(window).off('beforeunload', leaveMessage);
        renderButtonDisable($("#btn_write"))
    }

    function saveAnnotation() {
        var location = prompt("Save annotation to the document. Enter the location:", targetUrl);
        if (location != null && location != "") {
            saveAnnotationTo(location);
        }
    }

    jQuery.fn.center = function () {
        var container = $("#textae_container");
        this.css("position","absolute");
        this.css("top", ( container.height() - this.height() ) / 2+container.scrollTop() + "px");
        this.css("left", ( container.width() - this.width() ) / 2+container.scrollLeft() + "px");
        return this;
    };


    function saveAnnotationTo(location) {
        $('#textae_container').css('cursor', 'wait');

        var denotations = [];
        for (var e in entities) {
            var span = {'begin':spans[entities[e]['span']].begin, 'end':spans[entities[e]['span']].end};
            denotations.push({'id':e, 'span':span, 'obj':entities[e]['type']});
        }

        var postData = {
            "text": sourceDoc,
            "denotations": denotations
        }

        $.ajax({
            type: "post",
            url: location,
            data: {annotations:JSON.stringify(postData)},
            crossDomain: true,
            xhrFields: {withCredentials: true},
            success: function(res){
                $('#message').html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showTarget();
                });
                lastSavePtr = lastEditPtr;
                changeButtonStateSave();
                $('#textae_container').css('cursor', 'auto');
            },
            error: function(res, textStatus, errorThrown){
                $('#message').html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showTarget();
                });
                $('#textae_container').css('cursor', 'auto');
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

    function changeButtonStateReplicate() {
        if (numSpanSelection() == 1) {
            enableButtonReplicate();
        } else {
            disableButtonReplicate();
        }
    }

    function replicate() {
        if (spanIdsSelected.length == 1) {
            makeEdits(getSpanReplicates(spans[spanIdsSelected[0]]));
        }
        else alert('You can replicate span annotation when there is only span selected.');
    }


    function getSpanReplicates(span) {
        var startPos = span['begin'];
        var endPos   = span['end'];

        var cspans = findSameString(startPos, endPos); // candidate spans

        var nspans = new Array(); // new spans
        for (var i = 0; i < cspans.length; i++) {
            cspan = cspans[i];

            // check boundary crossing
            var crossing_p = false;
            for (var sid in spans) {
                if (
                    (cspan['begin'] > spans[sid]['begin'] && cspan['begin'] < spans[sid]['end'] && cspan['end'] > spans[sid]['end'])
                    ||
                    (cspan['begin'] < spans[sid]['begin'] && cspan['end'] > spans[sid]['begin'] && cspan['end'] < spans[sid]['end'])
                   ) {
                   crossing_p = true;
                   break;
                }
            }

            if(!crossing_p) {
                nspans.push(cspan);
            }
        }

        var edits = new Array();
        for (var i = 0; i < nspans.length; i++) {
            var nspan = nspans[i];
            var id = getSid(nspan['begin'], nspan['end']);
            edits.push({action: "new_span", id:id, begin:nspan['begin'], end:nspan['end']});
        }

        return edits;
    }


    function makeEdits(edits, context) {
        switch (context) {
            case 'undo' :
            case 'redo' :
                clearSpanSelection();
                clearEntitySelection();
                clearRelationSelection();
                break;
            default :
        }

        for (var i = 0; i < edits.length; i++) {
            var edit = edits[i];
            switch (edit.action) {
                // span operations
                case 'new_span' :
                    // model
                    newSpan(edit.id, edit.begin, edit.end, edit.block, edit.type);
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    entitiesPerSpan[edit.id] = new Array();
                    // rendering
                    renderSpan(edit.id, spanIds);
                    indexPosition(edit.id);
                    // select
                    selectSpan(edit.id);
                    break;
                case 'remove_span' :
                    //model
                    delete spans[edit.id];
                    delete entitiesPerSpan[edit.id];
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    break;
                case 'change_span_begin' :
                    //model
                    new_sid = getSid(edit.new_begin, spans[edit.id].end);
                    spans[new_sid] = spans[edit.id];
                    spans[new_sid].begin = edit.new_begin;
                    entitiesPerSpan[new_sid] = entitiesPerSpan[edit.id];
                    delete spans[edit.id];
                    delete entitiesPerSpan[edit.id];
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(new_sid, spanIds);
                    // select
                    selectSpan(new_sid);
                    // for undo
                    edit.id = new_sid;
                    break;
                case 'change_span_end' :
                    //model
                    new_sid = getSid(spans[edit.id].begin, edit.new_end);
                    spans[new_sid] = spans[edit.id];
                    spans[new_sid].end = edit.new_end;
                    entitiesPerSpan[new_sid] = entitiesPerSpan[edit.id];
                    delete spans[edit.id];
                    delete entitiesPerSpan[edit.id];
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(new_sid, spanIds);
                    // select
                    selectSpan(new_sid);
                    // for undo
                    edit.id = new_sid;
                    break;

                // entity operations
                case 'new_denotation' :
                    // model
                    entities[edit.id] = {id:edit.id, span:edit.span, type:edit.type};
                    entitiesPerSpan[edit.span].push(edit.id);
                    // rendering
                    renderGridAsso(edit.span);
                    renderEntity(edit.id);
                    // select
                    selectEntity(edit.id);
                    break;
                case 'remove_denotation' :
                    //model
                    delete entities[edit.id];
                    var arr = entitiesPerSpan[edit.span];
                    arr.splice(arr.indexOf(edit.id), 1);
                    //rendering
                    destroyEntity(edit.id);
                    renderGridAsso(edit.span);
                    break;
                case 'change_entity_type' :
                    //model
                    entities[edit.id].type = edit.new_type;
                    //rendering
                    renderEntity(edit.id);
                    break;

                // relation operations
                case 'new_relation' :
                    // model
                    relations[edit.id] = {id:edit.id, subj:edit.subj, obj:edit.obj, pred:edit.pred};
                    relationsPerSpanEntity[edit.subj].push(edit.id);
                    relationsPerSpanEntity[edit.obj].push(edit.id);
                    // rendering
                    connectors[edit.id] = renderRelation(edit.id);
                    // selection
                    selectRelation(edit.id);
                    break;
                case 'remove_relation' :
                    // model
                    delete relations[edit.id];
                    var arr = relationsPerSpanEntity[edit.subj];
                    arr.splice( arr.indexOf( edit.id ), 1 );
                    arr = relationsPerSpanEntity[edit.obj];
                    arr.splice( arr.indexOf( edit.id ), 1 );
                    // rendering
                    destroyRelation(edit.id);
                    break;
                case 'change_relation_pred' :
                    // model
                    relations[edit.id].pred = edit.new_pred;
                    // rendering
                    connectors[edit.id].setPaintStyle(connectorTypes[edit.new_pred+"_selected"]["paintStyle"]);
                    connectors[edit.id].setHoverPaintStyle(connectorTypes[edit.new_pred+"_selected"]["hoverPaintStyle"]);
                    connectors[edit.id].setLabel('[' + edit.id + '] ' + edit.new_pred);
                    // selection
                    selectRelation(edit.id);
                    break;

                // modification operations
                case 'new_modification' :
                    // model
                    modifications[edit.id] = {id:edit.id, obj:edit.obj, pred:edit.pred};
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
        renderGrids(spanIds);

        // renewConnections(Object.keys(relations));

        if (mode == 'view' || mode =='relation') {
            // makeClones();
        }

        switch (context) {
            case 'undo' :
            case 'redo' :
                break;
            default :
                editHistory.splice(++lastEditPtr);
                editHistory.push(edits);
                changeButtonStateUndoRedo();
                changeButtonStateSave();
                changeButtonStateReplicate();
                changeButtonStateEntity();
                changeButtonStateDelete();
                changeButtonStatePallet();
                changeButtonStateNewLabel();
                changeButtonStateCopy();
                changeButtonStatePaste();
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
                case 'change_span_obj' :
                    redit.old_obj = edit.new_obj;
                    redit.new_obj = edit.old_obj;
                    break;
                case 'new_denotation' :
                    redit.action = 'remove_denotation';
                    break;
                case 'remove_denotation' :
                    redit.action = 'new_denotation';
                    break;
                case 'change_entity_type' :
                    redit.old_type = edit.new_type;
                    redit.new_type = edit.old_type;
                    break;
                case 'new_relation' :
                    redit.action = 'remove_relation';
                    break;
                case 'remove_relation' :
                    redit.action = 'new_relation';
                    break;
                case 'change_relation_subj' :
                    redit.old_subj = edit.new_subj;
                    redit.new_subj = edit.old_subj;
                    break;
                case 'change_relation_obj' :
                    redit.old_obj = edit.new_obj;
                    redit.new_obj = edit.old_obj;
                    break;
                case 'change_relation_pred' :
                    redit.old_pred = edit.new_pred;
                    redit.new_pred = edit.old_pred;
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
        renderButtonPush($('#btn_mode_entity'));
        $('#btn_mode_entity').off('click', pushButtonSpan);
        changeMode('span');
    }

    function unpushButtonSpan() {
        if (!isButtonDisabled($('#btn_mode_entity'))) {
            renderButtonUnpush($('#btn_mode_entity'));
            $('#btn_mode_entity').off('click', pushButtonSpan).on('click', pushButtonSpan);
        }
    }

    function disableButtonSpan() {
        $('#btn_mode_entity').off('click', pushButtonSpan);
        renderButtonDisable($('#btn_mode_entity'));
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
        clearEntitySelection();
        clearModificationSelection();
        clearRelationSelection();

        mode = tomode;

        if (mode == 'view') {
            $('#ins_area').css('z-index', 10);
            $('#rel_area').removeAttr('style');
        } else if (mode == 'span') {
            $('#ins_area').removeAttr('style');
            $('#rel_area').css('z-index', -10);
        } else if (mode == 'relation') {
            $('#ins_area').css('z-index', 10);
            $('#rel_area').removeAttr('style');
        }
    }

    // conversion from HEX to RGBA color
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
        var sourceId = relations[rid]['subj'];
        var targetId = relations[rid]['obj'];

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
        var pred = relations[rid]['pred'];
        var rgba = colorTrans(relationTypes[pred]['color'], connOpacity);
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

        var label = '[' + rid + '] ' + pred;
        var labelClass = "label " + pred;
        var labelId = "label_" + rid;

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            anchors:[sourceAnchor, targetAnchor],
            connector:[ "Bezier", {curviness:curviness}],
            paintStyle: connectorTypes[pred]["paintStyle"],
            hoverPaintStyle: connectorTypes[pred]["hoverPaintStyle"],
            tooltip:'[' + rid + '] ' + pred,
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
            clearEntitySelection();
            clearModificationSelection();

            if (isRelationSelected(rid)) {
                deselectRelation(rid);
            } else {
                if (!e.ctrlKey) {clearRelationSelection()}
                selectRelation(rid);
            }
        }
        cancelBubble(e);
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
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].pred + "_selected"] ["paintStyle"]);
            relationIdsSelected.push(rid);
        }
    }


    function deselectRelation(rid) {
        var i = relationIdsSelected.indexOf(rid);
        if (i > -1) {
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].pred]["paintStyle"]);
            relationIdsSelected.splice(i, 1);
        }
    }


    function clearRelationSelection() {
        while (relationIdsSelected.length > 0) {
            var rid = relationIdsSelected.pop();
            connectors[rid].setPaintStyle(connectorTypes[relations[rid].pred]["paintStyle"]);
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
            var sourceId = relations[rid]['subj'];
            var targetId = relations[rid]['obj'];

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

    function destroyRelation(rid) {
        var c = connectors[rid];
        var endpoints = c.endpoints;
        jsPlumb.deleteEndpoint(endpoints[0]);
        jsPlumb.deleteEndpoint(endpoints[1]);
    }

    function renderEntitiesOfSpans(sids) {
        for (var s = sids.length - 1; s >= 0; s--) renderEntitiesOfSpan(sids[s]);
    }

    // render the entities of a given span and dependent spans.
    function renderEntitiesOfSpanAsso(sid) {
        renderEntitiesOfSpan(sid);
        var c = spanIds.indexOf(sid)
        for (var p = c - 1; isSpanEmbedded(spans[spanIds[c]], spans[spanIds[p]]); p--) renderEntitiesOfSpan(spanIds[p]);
    }

    function renderEntitiesOfSpan(sid) {
        renderGrid(sid);
        for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
            var eid = entitiesPerSpan[sid][i];
            renderEntity(eid);
        }
    }

    function isSpanEmbedded(s1, s2) {
        return (s1.begin >= s2.begin) && (s1.end <= s2.end)
    }

    function renderGrids(sids) {
        for (var s = sids.length - 1; s >= 0; s--) renderGrid(spanIds[s]);
    }

    // render the entity pane of a given span and its dependent spans.
    function renderGridAsso(sid) {
        renderGrid(sid);

        // see if the pane of the parent node needs to be updated
        var pnode = document.getElementById(sid).parentElement;
        while (pnode && pnode.id && spans[pnode.id]) {
            renderGridAsso(pnode.id);
            pnode = pnode.parentElement;
        }
    }

    function renderGrid(sid) {
        var id = 'G' + sid;

        if (entitiesPerSpan[sid].length < 1) {
            var grid = $('#' + id);
            if (grid.length > 0) {
                grid.remove();
                delete positions[id];
            }
            return null;
        }
        else {
            // decide the offset
            var offset = typeMarginBottom;

            // check the following spans that are embedded in the current span.
            var c = spanIds.indexOf(sid)
            for (var f = c + 1; (f < spanIds.length) && isSpanEmbedded(spans[spanIds[f]], spans[spanIds[c]]); f++) {
                var cid = 'G' + spanIds[f];
                if (positions[cid] && ((positions[cid].offset + positions[cid].height) < offset)) offset = (positions[cid].offset + positions[cid].height) + typeMarginTop + typeMarginBottom;
            }

            var n = typesPerSpan[sid].length;
            var gridHeight = n * (typeHeight + typeMarginBottom + typeMarginTop);

            positions[id]           = {}
            positions[id]['offset'] = offset;
            positions[id]['top']    = positions[sid].top - offset - gridHeight;
            positions[id]['left']   = positions[sid].left;
            positions[id]['width']  = positions[sid].width - gridWidthGap;
            positions[id]['height'] = gridHeight;

            if ($('#' + id).length == 0) {
                createDiv(id, 'grid', positions[id].top, positions[id].left, positions[id].width, positions[id].height);
                $('#' + id).off('mouseover mouseout', gridMouseHover).on('mouseover mouseout', gridMouseHover);
                $('#' + id).selectable({
                    start: function(e, ui) {
                        if (e.ctrlKey) {}
                        else {
                            clearSpanSelection();
                            clearEntitySelection();
                        }
                    },
                    stop: function() {
                        changeButtonStatePallet();
                        changeButtonStateNewLabel();
                        changeButtonStateDelete();
                        changeButtonStateCopy();
                    }
                });
            } else {
                var grid = $('#' + id);
                grid.css('top',  positions[id]['top'] + positions[sid]['top']);
                grid.css('left', positions[id]['left']);
            }
            return id;
        }
    }

    function gridMouseHover(e) {
        var grid = $(this);
        var id = grid.attr('id');

        if (e.type == 'mouseover') {
            grid.css('height', 'auto');
            if (grid.outerWidth() < positions[id]['width']) grid.css('width', positions[id]['width']);
            grid.css('z-index', '254');
        }
        else {
            grid.css('height', positions[id]['height']);
            grid.css('z-index', '');
        }
    }

    function positionGrids(sids) {
        for (var s = sids.length - 1; s >= 0; s--) positionGrid(spanIds[s]);
    }

    function positionGrid(sid) {
        var gid = 'G' + sid
        var grid = $('#' + gid);
        if (grid.length > 0) {
            positions[gid].top  = positions[sid].top - positions[gid].offset - positions[gid].height;
            positions[gid].left = positions[sid].left;
            grid.css('top',  positions[gid].top);
            grid.css('left', positions[sid].left);
        }
    }

    function destroyGrid(sid) {
        $('#G' + sid).remove();
    }

    function createDiv(id, cls, top, left, width, height, title) {
        $('#annotation_box').append('<div id="' + id + '"></div');
        var div = $('#' + id);
        div.addClass(cls);
        div.attr('title', title);
        div.css('position', 'absolute');
        div.css('top', top);
        div.css('left', left);
        div.css('width', width);
        div.css('height', height);
        return id;
    }

    function renderType(type, sid) {
        var tid = getTid(sid, type);

        if ($('#' + tid).length == 0) {
            $('#G' + sid).append('<div id="' + tid +'"></div>');
            var t = $('#' + tid);
            t.addClass('type');
            t.css('background-color', color(type)? color(type) : '');
            t.css('margin-top', typeMarginTop);
            t.css('margin-bottom', typeMarginBottom);
            t.attr('title', type);
            t.append('<div class="instance_pane"></div>');
            t.append(type);
        }

        return tid;
    }

    function renderEntity(eid) {
        if ($('#' + eid).length == 0) {
            var entity = entities[eid];
            var type = entity['type'];
            var sid  = entity['span'];
            var tid = renderType(type, sid);
            var div = '<div id="' + eid +'" class="entity" />';
            $('#' + getTid(sid, type) + ' .instance_pane').append(div);
            var e = $('#' + eid);
            e.attr('title', eid);
            e.css('display: inline-block');
            e.css('border-color', color(type)? color(type) : '')
            e.addClass('ui-selectee');
        }
    }


    // event handler (entity is clicked)
    function entityClicked(e) {
        var id = $(this).attr('id');

        if (mode == "span") {
            // if (isCtrl) {
            if (e.ctrlKey) {
                if (isEntitySelected(id)) {deselectEntity(id)}
                else {selectEntity(id)}
            }
            else {
                clearSpanSelection();
                clearEntitySelection();
                selectEntity(id);
            }
        }

        else if (mode == "relation") {
            clearRelationSelection();

            if (spanIdsSelected.length == 0 && entityIdsSelected.length == 0) {
                selectEntity(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (spanIdsSelected.length > 0) {sid = spanIdsSelected[0]}
                else {sid = entityIdsSelected[0]}

                makeEdits([{action:'new_relation', id:rid, pred:relationTypeDefault, subj:sid, obj:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSpanSelection();
                    clearEntitySelection();

                    // continuous chaining
                    if (e.shiftKey) {selectEntity(oid)}
                }
            }
        }

        cancelBubble(e);
        return false;
    }

    function destroyEntity(eid) {
        $('#' + eid).remove();
    }

    function renderModifications(mids) {
        for(var i = 0; i < mids.length; i++) {
            renderModification(mids[i]);
        }
    }

    function renderModification(mid) {
        var pred = modifications[mid]["pred"];
        var oid = modifications[mid]['obj'];
        var symbol;
        if (pred == "Negation") {
            symbol = 'X';
        } else if (pred == "Speculation") {
            symbol = '?';
        }
        $('#' + oid).append('<entity class="modification" id="' + mid + '">' + symbol + '</entity>');
        $('#' + mid).off('click', modificationClicked).on('click', modificationClicked);
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
            var rtype = relations[rid]["pred"];
            connectors[rid].setPaintStyle(connectorTypes[rtype]["paintStyle"]);
        }

        for (var i = 0; i < relationIdsSelected; i++) {
            var id = relationIdsSelected[i];
            var type = relations[id]["pred"];
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
        indexPositions(spanIds);
        positionGrids(spanIds);
        // renewConnections(Object.keys(relations));
        // changeMode(mode);
    }

    function leaveMessage() {
        return "There is a change that has not been saved. If you leave now, you will lose it.";
    }
});
