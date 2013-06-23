$(document).ready(function() {
    var OSName;
    var browserNameVersion;

    var mode = 'span';  // screen mode: view | span(default) | relation
    var replicateAuto = false;

    var sourceDoc;

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

    var entityTypeDefault;
    var relationTypeDefault;
    var modificationTypeDefault;

    // annotation data (Objects)
    var spans;
    var entities;
    var relations;
    var modifications;

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

    var entityHeight = 0;
    var entityPaneWidthGap = 0;
    var entityPaneHeightMargin = 0;
    var objectGap = 6;
    var palletHeightMax = 100;

    var mouseX;
    var mouseY;
    $('#body').mousemove(function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;
    });

    function getEntityRepSizes() {
        var div = '<div id="temp_pane" class="entity_pane" style="width:10px; height:auto"></div>';
        $('#annotation_box').append(div);
        div = '<div id="temp_entity" class="entity" title="[Temp] Temp" >T0</div>';
        $('#temp_pane').append(div);

        entityHeight = $('#temp_entity').outerHeight();
        entityPaneWidthGap = $('#temp_pane').outerWidth() - 10;
        entityPaneHeightMargin = $('#temp_pane').outerHeight() - entityHeight;
        $('#temp_pane').remove();
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
                    // renderFrame();
                    getAnnotationFrom(targetUrl);
                },
                error: function() {
                    alert('could not read the configuration from the location you specified.');
                }
            });
        } else {
            // renderFrame();
            getAnnotationFrom(targetUrl);
        }
    }


    function showSource() {
        if (targetUrl != "") $('#message').html("(source: " + targetUrl + ")");
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
        if (entityTypeDefault) tableEntityTypes(entityTypes);
        if (relationTypeDefault) tableRelationTypes(relationTypes);
        if (!entityTypeDefault && !relationTypeDefault) $('#notice').css('display', 'block');

        // tableEntityTypes(instanceTypes);
        // tableModificationTypes(modificationTypes);
        initSlider();
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
                },
                error: function(res, textStatus, errorThrown){
                    alert("connection failed.");
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

        $('#text_box').off('mouseup', doMouseup).on('mouseup', doMouseup);
        $('#body').off('mouseup', cancelSelect).on('mouseup', cancelSelect);

        spanIdsSelected = new Array();
        entityIdsSelected = new Array();
        relationIdsSelected = new Array();
        modificationIdsSelected = new Array();

        clipBoard = new Array();

        editHistory = new Array();
        lastEditPtr = -1;
        lastSavePtr = -1;

        enableButtonRead();

        changeButtonStateUndoRedo();
        changeButtonStateSave();
        changeButtonStateReplicate();
        changeButtonStateDelete();
        changeButtonStateCopy();
        changeButtonStatePaste();

        showSource();
        // if (entityTypeDefault == null || targetUrl === "") disableButtonSpan();
        // if (relationTypeDefault == null || targetUrl === "") disableButtonRelation();
        // pushButtonSpan();
        enableButtonPallet();
    }


    function loadAnnotation(data) {
        sourceDoc = data.text;

        spans     = new Object();
        entities  = new Object();
        relations = new Object();

        entitiesPerSpan = new Object();
        positions = new Object();
        connectors = new Object();

        if (data.denotations != undefined) {
            for (var i = 0; i < data.denotations.length ; i++) {
                var d = data.denotations[i];
                var span = d['span']['begin'] + '-' + d['span']['end'];
                entities[d['id']] = {span:span, type:d['obj']};

                if (!entityTypes[d['obj']]) entityTypes[d['obj']] = {};
                if (entityTypes[d['obj']]['count']) entityTypes[d['obj']]['count']++;
                else entityTypes[d['obj']]['count'] = 1;

                if (entitiesPerSpan[span]) entitiesPerSpan[span].push(d['id']);
                else entitiesPerSpan[span] = [d['id']];
            }
        }

        spanIds = Object.keys(entitiesPerSpan); // maintained sorted by the position.
        for (var i = 0; i < spanIds.length; i++) {
            var pos = spanIds[i].split('-');
            spans[spanIds[i]] = {begin:+pos[0], end:+pos[1]};
        }
        sortSpanIds(spanIds);

        if (data.relations != undefined) {
            for (var i = 0; i < data.relations.length ; i++) {
                relations[data.relations[i]["id"]] = data.relations[i];
            }
        }
        relationIds = Object.keys(relations);

/*
        modifications = new Object();
        if (data.modifications != undefined) {
            for (var i = 0; i < data.modifications.length ; i++) {
                modifications[data.modifications[i]["id"]] = data.modifications[i];
            }
        }
        modificationIds = Object.keys(modifications);
        modificationTypesUnknown = $.unique(modificationTypesUnknown);

        // index instances per array
        instancesPerEntity = new Object();
        for (var sid in entities) {instancesPerEntity[sid] = new Array()}
        for (var iid in instances) {
            instancesPerEntity[instances[iid]['obj']].push(iid);
        }

        // index relations per array or instance
        relationsPerEntity = new Object();
        for (var sid in entities)     {relationsPerEntityEntity[sid] = new Array()}
        for (var iid in instances) {relationsPerEntityEntity[iid] = new Array()}
        for (var rid in relations) {
            relationsPerEntityEntity[relations[rid]['subj']].push(rid);
            relationsPerEntityEntity[relations[rid]['obj']].push(rid);
        }
*/
    }


    function indexPositions(spanIdsSelected) {
        indexSpanPositions(spanIdsSelected);
        // indexEntityPositions(spanIdsSelected); // note that this function takes spans not instances.
    }


    function indexSpanPositions(spanIds) {
        for (var i = 0; i < spanIds.length; i++) indexPosition(spanIds[i]);
    }

    function indexPosition(id) {
        var e = $('#' + id);
        positions[id] = {};
        positions[id]["top"]    = e.get(0).offsetTop;
        positions[id]["left"]   = e.get(0).offsetLeft;
        positions[id]["width"]  = e.outerWidth();
        positions[id]["height"] = e.outerHeight();
    }



    function indexEntityPositions(spanIds) {
        for (var s = 0; s < spanIds.length; s++) {
            var sid = spanIds[s];
            var iids = instancesPerspan[sid];
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


    function getLineSpace() {
        var lines = docArea.getClientRects();
        lineSpace = lines[1].top - lines[0].bottom;
        return lineSpace;
    }

    function renderAnnotation() {
        // $("#text_box").html(sourceDoc);
        container = document.getElementById("body");
        docArea = document.getElementById("text_box");
        docArea.innerHTML = sourceDoc;

        getLineSpace();
        container.style.paddingTop = lineSpace/2 + 'px';

        $('#annotation_box').empty();
        renderEntityTypePallet();

        renderSpans(spanIds);
        indexPositions(spanIds);

        getEntityRepSizes();
        renderEntitiesOfSpans(spanIds);

        // renderRelations(relationIds);
        // renderModifications(modificationIds);
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


    function enableButtonPallet() {
        $("#btn_pallet").off('click', showPallet).on('click', showPallet);
        renderButtonEnable($("#btn_pallet"));
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

    function color(type) {
        if (entityTypes && entityTypes[type] && entityTypes[type]['color']) return entityTypes[type]['color'];
        else null;
    }

    function tableRelationTypes(relationTypes) {
        var html = '<table>';
        html += '<tr><th colentity="2">Relation Types</th></tr>';

        for (var r in relationTypes) {
            var uri   = relationTypes[r]["uri"];
            var color = relationTypes[r]["color"];

            html += '<tr style="background-color:' + color  + '">';

            html += '<td class="radio"><input type="radio" name="rtype" class="relation_type_radio"';
            html += (r == relationTypeDefault)? 'title="default type" checked' : '';
            html += '></td>';

            html += '<td><div class="relation_type_label">' + r  + '</div></td>';

            if (uri) html += '<td title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"></a></td>';

            html += '</tr>';

            var obj = new Object();
            obj[r] = {paintStyle:{strokeStyle:color, lineWidth:2}};
            jsPlumb.registerConnectionTypes(obj);
        }

        html += '</table>';
        $('#relation_types').html(html);
    }


    // List of instance types
    function tableEntityTypes(instanceTypes) {
        var html = '<table>';
        html += '<tr><th colentity="2">Entity Types</th></tr>';

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


    // List of modification types
    function tableModificationTypes(modificationTypes) {
        var html = '<table>';
        html += '<tr><th colentity="2">Modification Types</th></tr>';

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


    // assume the spanIds are sorted by the position.
    // when there are embedded spans, the embedding ones comes earlier then embedded ones.
    function renderSpan(sid, spanIds) {
        var element = document.createElement('span');
        element.setAttribute('id', sid);
        element.setAttribute('class', 'span');
        element.setAttribute('title', '[' + sid + '] ');
        element.style.whiteSpace = 'pre';

        var beg = spans[sid].begin;
        var end = spans[sid].end;
        var len = end - beg;

        var c; // index of current span
        for (c = 0; c < spanIds.length; c++) {
            if (spanIds[c] == sid) break;
        }

        var begnode, begoff;
        var endnode, endoff;

        begnode = document.getElementById("text_box").childNodes[0];
        begoff = beg;

        // adjust the begin node and offset
        if (c > 0) {
            var p = c - 1; // index of preceding span

            // when the previous span includes the region
            if (spans[spanIds[p]].end > beg) {
                begnode = document.getElementById(spanIds[p]).childNodes[0];
                begoff  = beg - spans[spanIds[p]].begin;
            } else {
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

        endnode = begnode;
        endoff = begoff + len;

        // when there is an intervening span, adjust the end node and offset
        if ((c < spanIds.length - 1) && (end > spans[spanIds[c+1]].begin)) {
            var f = c + 1; // index of the following span
            var l = f; // index of the leftmost span
            // find the leftmost span inside the target span
            while ((f < spanIds.length - 2) && (end >= spans[spanIds[f+1]].end)) {
                if (spans[spanIds[f + 1]].end >= spans[spanIds[l]].end ) l = f + 1;
                f++;
            }
            endnode = document.getElementById(spanIds[l]).nextSibling;
            endoff = end - spans[spanIds[l]].end;
        }

        var range = document.createRange();
        range.setStart(begnode, begoff);
        range.setEnd(endnode, endoff);
        range.surroundContents(element);

        $('#' + sid).off('mouseup', spanClicked).on('mouseup', spanClicked);
    }


    function spanClicked(e) {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        // if drag, bubble up
        if (!selection.isCollapsed) return true;

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


    // // set the default type of denoting object
    // $('.entity_type_radio').live('change', function() {
    //     entityTypeDefault = $(this).parent().next().text();
    // });


    // // set the default relation type
    // $('.relation_type_radio').live('change', function() {
    //     relationTypeDefault = $(this).parent().next().text();
    // });


    // merge spans by mouse right click
    // $('.entity').live('contextmenu', function(e){

    //     if (mode == "relation") {
    //        // relationモード

    //     } else if (mode == "span") {

    //         if (spanIdsSelected.length == 1) {
    //             var firstSpanId = spanIdsSelected.shift();
    //             var secondSpanId = $(this).attr('id');
    //             var firstParentId = $('entity#' + firstSpanId).parent().attr('id');
    //             var secondParentId = $(this).parent().attr('id');

    //             // merge spans
    //             if (firstParentId == secondParentId && firstSpanId != secondSpanId) {
    //                 var edits = new Array();

    //                 var firstSpan  = spans[firstSpanId];    // the entity selected by the mouse left click
    //                 var secondSpan = spans[secondSpanId];   // the entity selected by the mouse right click

    //                 // move instances
    //                 for (var i = 0; i < instancesPerSpan[secondSpanId].length; i++) {
    //                     edits.push({action:'change_instance_obj', id:instancesPerSpan[secondSpanId][i], old_obj:secondSpanId, new_obj:firstSpanId});
    //                 }

    //                 // move relations
    //                 for (var i = 0; i < relationsPerSpanEntity[secondSpanId].length; i++) {
    //                     var rid = relationsPerSpanEntity[secondSpanId][i];
    //                     if (relations[rid].subj == secondSpanId) {
    //                         edits.push({action:'change_relation_subj', id:rid, old_subj:secondSpanId, new_subj:firstSpanId});
    //                     }
    //                     if (relations[rid].obj == secondSpanId) {
    //                         edits.push({action:'change_relation_obj', id:rid, old_obj:secondSpanId, new_obj:firstSpanId});
    //                     }
    //                 }

    //                 // merge to the former entity
    //                 if (firstSpan['end'] < secondSpan['end']) {
    //                     edits.push({action:'change_entity_end', id:firstSpanId, old_end:firstSpan['end'], new_end:secondSpan['end']});
    //                 }

    //                 // merge to the latter entity
    //                 else {
    //                     edits.push({action:'change_entity_begin', id:firstSpanId, old_begin:firstSpan['begin'], new_begin:secondSpan['begin']});
    //                 }

    //                 // remove the second entity
    //                 edits.push({action:'remove_entity', id:secondSpanId, begin:spans[secondSpanId].begin, end:spans[secondSpanId].end, obj:spans[secondSpanId].obj});

    //                 makeEdits(edits);
    //             } 
    //         }

    //         else {
    //                 alert("Cannot merge spans when there are more than one spans selected.");
    //             }
    //     }

    //     cancelBubble(e);
    //     return false;
    // });


    // adjust the beginning position of a span
    function adjustSpanStart(startPosition) {
        var pos = startPosition;

        while (isNonEdgeCharacter(sourceDoc.charAt(pos))){
            pos = pos + 1;
            startChar = sourceDoc.charAt(pos);
        }

        while (!isDelimiter(sourceDoc.charAt(pos)) && pos > 0 && !isDelimiter(sourceDoc.charAt(pos - 1))) {pos--}
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

            if (
                // when the whole div is selected by e.g., triple click
                (range.startContainer == $('#text_box').get(0)) ||
                // when Shift is pressed
                (isShift) ||
                // when nothing is selected
                (selection.isCollapsed)
                )
            {
                // do nothing. bubbles go up
                dismissBrowserSelection();
                return true;
            }

            // no boundary crossing: normal -> create a entity
            if (selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {
                clearSpanSelection();

                var anchorChilds = selection.anchorNode.parentNode.childNodes;
                var focusChilds = selection.focusNode.parentNode.childNodes;

                var absoluteAnchorPosition = getAbsoluteAnchorPosition(anchorChilds, selection);
                var absoluteFocusPosition = getAbsoluteFocusPosition(focusChilds, selection);

                dismissBrowserSelection();

                // switch the position when the selection is made from right to left
                if (absoluteAnchorPosition > absoluteFocusPosition) {
                    var tmpPos = absoluteAnchorPosition;
                    absoluteAnchorPosition = absoluteFocusPosition;
                    absoluteFocusPosition = tmpPos;
                }

                // when the whole text is selected by e.g., triple click (Chrome)
                if ((absoluteAnchorPosition == 0) && (absoluteFocusPosition == sourceDoc.length)) {
                    // do nothing. bubbles go up
                    dismissBrowserSelection();
                    return true;
                }

                var startPosition = adjustSpanStart(absoluteAnchorPosition);
                var endPosition = adjustSpanEnd(absoluteFocusPosition);
                var sid = startPosition + '-' + endPosition;

                if (!spans[sid]) {
                    var edits = [{action:'new_span', id:sid, begin:startPosition, end:endPosition, obj:entityTypeDefault}];

                    if (replicateAuto) {
                        var replicates = getSpanReplicates({begin:startPosition, end:endPosition});
                        edits = edits.concat(replicates);
                    }

                    if (edits.length > 0) makeEdits(edits);
                }
            }

            // boundary crossing: exception
            else {
                if (numSpanSelection() == 1) {
                    var selectedId = popSpanSelection();
                    if (selectedId == selection.focusNode.parentElement.id) {
                        shortenSpan(selectedId, selection);
                    } else if (selectedId == getSelectedIdByAnchorNode($('span#' + selectedId), selection.anchorNode)) {
                        expandSpan(selectedId, selection);
                    }
                }
                else {
                    alert('If you want to adjust a boundary of a span, first, select the span, and make a boundary crossing.');
                }

            }

            dismissBrowserSelection();
            cancelBubble(e);
        }

        return false;
    }


    function instanceMouseHover(e) {
        if (mode == 'view') {
            var iid = $(this).attr('id');
            var rids = relationsPerEntityEntity[iid];

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

    // get the max value of the modification Id
    function getMaxModificationId() {
        var numId = 0;
        for(var i in modifications){
            if(parseInt(modifications[i]["id"].slice(1)) > numId){
                numId = parseInt(modifications[i]["id"].slice(1));
            }
        }
        return numId;
    }


    function newSpan(id, begin, end) {
        spans[id] = {begin:begin, end:end};
        return id;
    }


    function cancelSelect(e) {
        clearSpanSelection();
        clearEntitySelection();
        clearRelationSelection();
        clearModificationSelection();
        $('#entity_type_pallet').css('display', 'none');
        changeButtonStateReplicate();
        changeButtonStateDelete();
        changeButtonStateCopy();
        changeButtonStatePaste();

    }


    function expandSpan(sid, selection) {
        var range = selection.getRangeAt(0);

        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        // compareBoundaryPoints: -1, 0, or 1
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

                if(selection.focusNode.parentNode.id == 'text_box') {

                } else {
                    offset = spans[selection.focusNode.parentNode.id]['begin'];
                }

                // 修正
                var oldEnd = spans[sid]['end']
                var newEnd = adjustSpanEnd(offset + len + selection.focusOffset);

                dismissBrowserSelection();

                if (!spans[spans[sid]['begin'] + '-' + newEnd]) {
                    makeEdits([{action:'change_span_end', id:sid, old_end:oldEnd, new_end:newEnd}]);
                }
            }

        } else {

            if ($('span#' + sid).get(0).childNodes[0].parentNode.parentNode == selection.focusNode.parentNode){
                // focusNodeの親ノードの位置を求めます
                var offset = 0;

                // focusノードを起点にしたchild node
                var focusChilds = selection.focusNode.parentElement.childNodes;

                // そのspanの文字数を計算
                var len = getFocusPosBySpan(focusChilds, selection);

                if(selection.focusNode.parentNode.id == 'text_box') {

                } else {
                    offset = spans[selection.focusNode.parentNode.id]['begin'];
                }

                // 修正
                var oldBegin = spans[sid]['begin'];
                var newBegin = adjustSpanStart(offset + len + selection.focusOffset);

                dismissBrowserSelection();

                if (!spans[newBegin + '-' + spans[sid]['end']]) {
                    makeEdits([{action:'change_span_begin', id:sid, old_begin:oldBegin, new_begin:newBegin}]);
                }
            }
        }
    }


    function shortenSpan(sid, selection) {
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
            var endPosition = adjustSpanEnd2(spans[selection.focusNode.parentNode.id]['begin'] + spanLen + selection.focusOffset);

            dismissBrowserSelection();

            // 選択範囲がマークの最初と同じであれば、
            // endPositionがマークのbeginよりも大きくなるので、
            // その場合は何もしない
            if(endPosition > spans[sid]['begin']) {
                var oldEnd = spans[sid]['end'];
                var newEnd = endPosition;
                if (!spans[spans[sid]['begin'] + '-' + newEnd]) {
                    makeEdits([{action:'change_span_end', id:sid, old_end:oldEnd, new_end:newEnd}]);
                }
            } else {
                // remove
                makeEdits([{action:'remove_span', id:sid, begin:spans[sid].begin, end:spans[sid].end}]);
            }

        } else {

            // focusノードを起点にしたchild node
            var focusChilds = selection.focusNode.parentElement.childNodes;

            // そのspanの文字数を計算
            var spanLen = getFocusPosBySpan(focusChilds, selection);

            // 修正
            var startPosition = adjustSpanStart2(spans[selection.focusNode.parentNode.id]['begin'] + spanLen +  selection.focusOffset);

            dismissBrowserSelection();

            // 選択範囲がメークの最後と同じであれば、
            // startPositionがマークのendよりも大きくなるので、
            // その場合は何もしない
            if(startPosition < spans[sid]['end']) {
                var oldBegin = spans[sid]['begin']
                var newBegin = startPosition;
                if (!spans[newBegin + '-' + spans[sid]['end']]) {
                    makeEdits([{action:'change_span_begin', id:sid, old_begin:oldBegin, new_begin:newBegin}]);
                }
            } else {
                // remove
                makeEdits([{action:'remove_span', id:sid, begin:spans[sid].begin, end:spans[sid].end}]);
            }
        }
    }


    function separateElement(spans, selection, selectedId) {
        sortEntities(spans);

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
        if(absoluteAnchorPosition == selectedJson['begin'] ||  absoluteFocusPosition == selectedJson['end']) {
            //if(startPos == 0) {
            if(absoluteAnchorPosition == selectedJson['begin']) {
                newStart = absoluteFocusPosition;

                // 修正
                var startPosition = adjustSpanStart(newStart);

                // 新たな開始点が終了点より小さい場合のみ
                if(startPosition < selectedJson['end']) {
                    //jsonを書き換え
                    //spans[selection.anchorNode.parentElement.id]['begin'] = startPosition;
                    selectedJson['begin'] = startPosition;
                }

            } else if(absoluteFocusPosition == selectedJson['end']) {

                //var newEnd = spans[selection.anchorNode.parentElement.id]['begin'] + startPos;
                var newEnd = absoluteAnchorPosition;
                // 修正
                var endPosition = adjustSpanEnd(newEnd);
                //jsonを書き換え
                selectedJson['end'] = endPosition;

            }

        } else {
            var newStart = absoluteFocusPosition;
            var newEnd = selectedJson['end'];

            var newStartPosition = adjustSpanStart(newStart);
            var newEndPosition = adjustSpanEnd(newEnd);

            // 分離した前方の終了位置
            // var separatedEndPos = adjustSpanEnd(offset + startPos);
            var separatedEndPos = adjustSpanEnd(absoluteAnchorPosition);

            // 分離した前方の終了位置と分離した後方の終了位置が異なる場合のみ
            if(separatedEndPos != newEndPosition && selectedJson['begin'] != newStartPosition) {
                //jsonを書き換え
                //spans[selection.anchorNode.parentElement.id]['end'] = separatedEndPos;
                selectedJson['end'] = separatedEndPos;

                // 新しいjsonを追加
                var obj = new Object();
                obj['begin'] = newStartPosition;
                obj['end'] = newEndPosition;
                obj['id'] = getSpanNewId();
                spans.push(obj);
            }
        }
    }


    // to check if the anchorNode is inside the selected span
    function getSelectedIdByAnchorNode(selected, anchorNode) {

        var anchorRange = document.createRange();
        anchorRange.selectNode(anchorNode);

        // range of the selected element
        var selectedRange = document.createRange();
        selectedRange.selectNode(selected.get(0).childNodes[0]);

        if(anchorRange.compareBoundaryPoints(Range.START_TO_START, selectedRange) > 0 && anchorRange.compareBoundaryPoints( Range.END_TO_END, selectedRange ) > 0) {
            // if the anchorNode is inside the selected span, return the Id of the selected span
            return selected.attr('id');
        }

        // if not, return the Id of the anchorNode
        return anchorNode.parentElement.id;
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
                // text modeでなけばentityノードなので、
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
                // text modeでなけばentityノードなので、
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

        if(selection.focusNode.parentNode.nodeName == 'SPAN' && selection.focusNode.parentNode.id != "text_box") {

            pos = spans[selection.focusNode.parentNode.id]['begin'];
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
                // text modeでなけばentityノードなので、
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

        if(selection.anchorNode.parentNode.nodeName == 'SPAN' && selection.anchorNode.parentNode.id != "text_box") {
            pos = spans[selection.anchorNode.parentNode.id]["begin"];
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
                // text modeでなけばentityノードなので、
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
            case 68: // 'd' key
                removeElements();
                break;
            case 69: // 'e' key
                createEntity();
                break;
            case 67: // 'c' key
                copyEntities();
                break;
            case 86: // 'v' key
                pasteEntities();
                break;
            case 84: // 't' key
                // show type selector
                showPallet();
                break;
            case 82: // 'r' key:
                // replicate span annotatino
                replicate();
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
        if ($(".ui-selected").length > 0) {
            enableButtonCopy();
        } else {
            disableButtonCopy();
        }
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

    function copyEntity() {

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


    // $('.span_type_label').live('click', function() {
    //     var edits = new Array();

    //     for (var i = 0; i < spanIdsSelected.length; i++) {
    //         var sid = spanIdsSelected[i];
    //         var oldObj = spans[sid].obj;
    //         var newObj = $(this).text();

    //         if (newObj != oldObj) {
    //             edits.push({action:"change_span_obj", id:sid, old_obj:oldObj, new_obj:newObj});
    //         }
    //     }

    //     if (edits.length > 0) {makeEdits(edits)}
    // });


    // $('.relation_type_label').live('click', function() {
    //     var edits = new Array();

    //     for(var i = 0; i < relationIdsSelected.length; i++) {
    //         var rid = relationIdsSelected[i];
    //         var oldPred = relations[rid].pred;
    //         var newPred = $(this).text();

    //         if (newPred != oldPred) {
    //             edits.push({action:"change_relation_pred", id:rid, old_pred:oldPred, new_pred:newPred});
    //         }
    //     }

    //     if (edits.length > 0) {makeEdits(edits)}
    // });


    // $('.modtype_apply_btn').live('click', function() {
    //     for(var i in modificationIdsSelected) {
    //         var modId = modificationIdsSelected[i];

    //         for(var j in modifications) {
    //             var mod = modifications[j];

    //             if(modId == mod["id"]) {
    //                 mod['pred'] = $(this).text();
    //             }
    //         }
    //     }
    // });


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
        this.css("position","absolute");
        this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
        this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
        return this;
    };


    function saveAnnotationTo(location) {
        $('#textae_container').css('cursor', 'wait');

        var denotations = [];
        for (var e in entities) {
            var span = {'begin':entities[e]['span'].split('-')[0], 'end':entities[e]['span'].split('-')[1]};
            denotations.push({'id':e, 'span':span, 'obj':entities[e]['type']});
        }

        // var instancesArr = [];
        // for (var i in instances) {instancesArr.push(instances[i])}

        // var relationsArr = [];
        // for (var i in relations) {relationsArr.push(relations[i])}

        // var mofidicationsArr = [];
        // for (var i in modifications) {mofidicationsArr.push(modifications[i])}

        var postData = {
            "text": sourceDoc,
            "denotations": denotations
            // "instances": instancesArr,
            // "relations": relationsArr,
            // "modifications": modificationsArr
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
                    showSource();
                });
                lastSavePtr = lastEditPtr;
                changeButtonStateSave();
                $('#textae_container').css('cursor', 'auto');
            },
            error: function(res, textStatus, errorThrown){
                $('#message').html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    showSource();
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
            var id = nspan['begin'] + '-' + nspan['end'];
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
                clearModificationSelection();
                break;
            default :
        }

        for (var i = 0; i < edits.length; i++) {
            var edit = edits[i];
            switch (edit.action) {
                // span operations
                case 'new_span' :
                    // model
                    newSpan(edit.id, edit.begin, edit.end);
                    spanIds = Object.keys(spans);
                    sortSpanIds(spanIds);
                    entitiesPerSpan[edit.id] = new Array();
                    // rendering
                    renderSpan(edit.id, spanIds);
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
                    spans[edit.id].begin = edit.new_begin;
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(edit.id, spanIds);
                    // select
                    selectSpan(edit.id);
                    break;
                case 'change_span_end' :
                    //model
                    spans[edit.id].end = edit.new_end;
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(edit.id, spanIds);
                    // select
                    selectSpan(edit.id);
                    break;

                // entity operations
                case 'new_denotation' :
                    // model
                    entities[edit.id] = {id:edit.id, span:edit.span, type:edit.type};
                    entitiesPerSpan[edit.span].push(edit.id);
                    // rendering
                    renderEntityPaneAsso(edit.span);
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
                    renderEntityPaneAsso(edit.span);
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
        renderEntityPanes(spanIds);

        // positionEntities(Object.keys(instances));
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
                changeButtonStateDelete();
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

            makeClones();
        } else if (mode == 'span') {
            $('#ins_area').removeAttr('style');
            $('#rel_area').css('z-index', -10);

            destroyClones();
        } else if (mode == 'relation') {
            $('#ins_area').css('z-index', 10);
            $('#rel_area').removeAttr('style');

            makeClones();
        }
    }


    function makeClones() {
        $('#clone_area').empty();

        // clone entities
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
                    + 'class="clone_entity" '
                    + 'style="position:absolute; '
                    + 'left:'   + obj['left']  + 'px; '
                    + 'top:'    + obj['top']  + 'px; '
                    + 'width:'  + obj["width"] + 'px; '
                    + 'height:' + obj["height"] +'px" '
                    + 'title="' + obj['title'] + '"></div>';
            $('#clone_area').append(div);
        }

        $('.clone_entity').off('click', spanClicked).on('click', spanClicked);
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


    function destroyRelation (rid) {
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
        renderEntityPane(sid);
        for (var i = 0; i < entitiesPerSpan[sid].length; i++) {
            var eid = entitiesPerSpan[sid][i];
            renderEntity(eid);
        }
    }


    function isSpanEmbedded (s1, s2) {
        return (s1.begin >= s2.begin) && (s1.end <= s2.end)
    }

    function renderEntityPanes(sids) {
        for (var s = sids.length - 1; s >= 0; s--) renderEntityPane(spanIds[s]);
    }

    // render the entity pane of a given span and its dependent spans.
    function renderEntityPaneAsso(sid) {
        renderEntityPane(sid);

        // see if the pane of the parent node needs to be updated
        var pnode = document.getElementById(sid).parentElement;
        while (pnode && pnode.id && spans[pnode.id]) {
            renderEntityPaneAsso(pnode.id);
            pnode = pnode.parentElement;
        }
    }

    function renderEntityPane(sid) {
        var id = 'D' + sid;

        if (entitiesPerSpan[sid].length < 1) {
            var pane = $('#' + id);
            if (pane.length > 0) {
                pane.remove();
                delete positions[id];
            }
            return null;
        }
        else {
            // decide the bottom
            var bottom = positions[sid].top - objectGap;
            // check the following spans that are embedded in the current span.
            var c = spanIds.indexOf(sid)
            for (var f = c + 1; (f < spanIds.length) && isSpanEmbedded(spans[spanIds[f]], spans[spanIds[c]]); f++) {
                if (positions['D' + spanIds[f]] && (positions['D' + spanIds[f]]['top'] < bottom)) bottom = positions['D' + spanIds[f]]['top'] - objectGap;
            }

            // decide the top
            var heightMax = lineSpace - (positions[sid].top - bottom) - objectGap;
            // count the number of spans that embed the current span.
            var pcount = 0;
            for (var pnode = document.getElementById(sid).parentElement; pnode && pnode.id && spans[pnode.id]; pnode = pnode.parentElement) {
                pcount++;
            }
            heightMax = heightMax - (pcount * (entityHeight + entityPaneHeightMargin));

            var n = entitiesPerSpan[sid].length;
            var paneHeight = n * entityHeight;
            var paneHeightView = (paneHeight < heightMax)? paneHeight : heightMax;

            positions[id]           = {}
            positions[id]['top']    = bottom - paneHeightView;
            positions[id]['left']   = positions[sid].left;
            positions[id]['width']  = positions[sid].width - entityPaneWidthGap;
            positions[id]['height'] = paneHeightView;

            if ($('#' + id).length == 0) {
                createDiv(id, 'entity_pane', positions[id].top, positions[id].left, positions[id].width, positions[id].height);
                // $('#'+id).css('overflow', 'hidden');
                $('#' + id).off('mouseover mouseout', entityPaneMouseHover).on('mouseover mouseout', entityPaneMouseHover);
                $('#' + id).selectable({
                    stop: function() {
                        changeButtonStateDelete();
                        changeButtonStateCopy();
                    }
                });
            } else {
                var pane = $('#' + id);
                pane.css('top',  positions[id]['top']);
                pane.css('left', positions[id]['left']);
                if (pane.css('width')  != 'auto') pane.css('width',  positions[id]['width']);
                if (pane.css('height') != 'auto') pane.css('height', positions[id]['height']);
            }
            return id;
        }
    }

    function entityPaneMouseHover(e) {
        var pane = $(this);
        var id = pane.attr('id');

        if (e.type == 'mouseover') {
            // $(this).css('overflow', 'visible');
            pane.css('width', 'auto');
            pane.css('height', 'auto');
            if (pane.outerWidth() < positions[id]['width']) pane.css('width', positions[id]['width']);
            pane.css('z-index', '254');
        }
        else {
            // pane.css('overflow', 'hidden');
            pane.css('top', positions[id]['top']);
            pane.css('width', positions[id]['width']);
            pane.css('height', positions[id]['height']);
            pane.css('z-index', '');
        }
    }


    function destroyEntityPane(sid) {
        $('#D' + sid).remove();
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


    function renderEntity(eid) {
        var entity = entities[eid];
        var type = entity['type'];
        var sid  = entity['span'];

        if ($('#' + eid).length == 0) {
            var div = '<div id="' + eid +'" class="entity"></div>';
            $('#D' + sid).append(div);
            $('#' + eid).addClass('ui-selectee');
        }

        var e = $('#' + eid);
        e.css('background-color', color(type)? color(type) : '');
        e.attr('title', '[' + eid + '] ' + type)
        e.text(type);
        // $('#' + eid).off('mouseup', entityClicked).on('mouseup', entityClicked);
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


    function positionEntities(iids) {
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
        renderEntityPanes(spanIds);
        // renewConnections(Object.keys(relations));
        // changeMode(mode);
    }

    function leaveMessage() {
        return "There is a change that has not been saved. If you leave now, you will lose it.";
    }
});