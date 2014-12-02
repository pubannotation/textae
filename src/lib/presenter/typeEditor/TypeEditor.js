var dismissBrowserSelection = require('./dismissBrowserSelection');

module.exports = function(editor, model, spanConfig, command, viewModel, typeContainer) {
	// will init.
	var elementEditor = require('./ElementEditor')(editor, model, spanConfig, command, viewModel, typeContainer),
		pallet = require('../../component/Pallet')(),
		cancelSelect = function() {
			pallet.hide();
			model.selectionModel.clear();
			dismissBrowserSelection();
		},
		// A relation is drawn by a jsPlumbConnection.
		// The EventHandlar for clieck event of jsPlumbConnection. 
		jsPlumbConnectionClicked = function(jsPlumbConnection, event) {
			// Check the event is processed already.
			// Because the jsPlumb will call the event handler twice
			// when a label is clicked that of a relation added after the initiation.
			if (elementEditor.handler.jsPlumbConnectionClicked && !event.processedByTextae) {
				elementEditor.handler.jsPlumbConnectionClicked(jsPlumbConnection, event);
			}

			event.processedByTextae = true;
		};

	// Bind events.
	elementEditor.bind('cancel.select', cancelSelect);

	pallet
		.bind('type.select', function(label) {
			pallet.hide();
			elementEditor.handler.changeTypeOfSelected(label);
		})
		.bind('default-type.select', function(label) {
			pallet.hide();
			elementEditor.handler.typeContainer.setDefaultType(label);
		});


	return {
		editRelation: elementEditor.start.editRelation,
		editEntity: elementEditor.start.editEntity,
		noEdit: elementEditor.start.noEdit,
		showPallet: function(point) {
			pallet.show(elementEditor.handler.typeContainer, point);
		},
		setNewType: function(newTypeName) {
			elementEditor.handler.changeTypeOfSelected(newTypeName);
		},
		hideDialogs: pallet.hide,
		cancelSelect: cancelSelect,
		jsPlumbConnectionClicked: jsPlumbConnectionClicked,
		getSelectedIdEditable: function() {
			return elementEditor.handler.getSelectedIdEditable && elementEditor.handler.getSelectedIdEditable();
		}
	};
};