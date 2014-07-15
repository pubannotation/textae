module.exports = function(editor) {
	var idFactory = require('../util/IdFactory')(editor);

	return {
		selector: {
			span: {
				get: function(spanId) {
					return editor.find('#' + spanId);
				}
			},
			entity: {
				get: function(entityId) {
					return editor.find('#' + idFactory.makeEntityDomId(entityId));
				}
			},
			grid: {
				get: function(spanId) {
					return editor.find('#G' + spanId);
				}
			},
		}
	};
};