require("jsoneditor")

module.exports = function($dialog) {
    var params = JSON.parse($dialog.params);

    // Default schema
    var schema = {
        disable_collapse: true,
        disable_properties: true,
        schema: {
            title: 'Json Edit: ',
            type: "object",
            properties: {
                target: {
                    type: "string",
                    format: "url",
                },
                sourcedb: {
                    type: "string",
                },
                sourceid: {
                    type: "string",
                }
            }
        }
    }
    // Set default value
    if (params.target !== '') {
        schema.schema.properties.target.default = params.target
    }
    if (params.sourcedb !== '') {
        schema.schema.properties.sourcedb.default = params.sourcedb
    }
    if (params.sourceid !== '') {
        schema.schema.properties.sourceid.default = params.sourceid
    }

    var jsonEditor = new JSONEditor(document.getElementById('editor_holder'), schema);
    jsonEditor.on('change', function() {
        var value = jsonEditor.getValue();
        if (value.target !== '') {
            params.target = value.target;
        }
        if (value.sourcedb !== '') {
            params.sourcedb = value.sourcedb;
        }
        if (value.sourceid !== '') {
            params.sourceid = value.sourceid;
        }

        $dialog.params = JSON.stringify(params);
    });
}
