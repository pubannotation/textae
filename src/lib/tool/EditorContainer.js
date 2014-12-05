var switchActiveClass = function(editors, selected) {
	var activeClass = 'textae-editor--active';

	// Remove activeClass from others than selected.
	_.reject(editors, function(editor) {
		return editor === selected;
	}).forEach(function(others) {
		others.removeClass(activeClass);
		// console.log('deactive', others.editorId);
	});

	// Add activeClass to the selected.
	selected.addClass(activeClass);
	// console.log('active', selected.editorId);
};

module.exports = function() {
	var editorList = [],
		selected = null,
		select = function(editor) {
			switchActiveClass(editorList, editor);
			selected = editor;
		},
		// A container of editors that is extended from Array. 
		editors = {
			push: function(editor) {
				editorList.push(editor);
			},
			getNewId: function() {
				return 'editor' + editorList.length;
			},
			getSelected: function() {
				return selected;
			},
			select: select,
			selectFirst: function() {
				select(editorList[0]);
			},
			forEach: editorList.forEach.bind(editorList)
		};

	return editors;
};