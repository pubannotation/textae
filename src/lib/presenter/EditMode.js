var typeGapCache = function() {
    var seed = {
            instanceHide: 0,
            instanceShow: 2
        },
        set = function(mode, val) {
            typeGapCache[mode] = val;
            return val;
        },
        api = _.extend({}, seed),
        capitalize = require('../util/capitalize');

    _.each(seed, function(val, key) {
        api['set' + capitalize(key)] = _.partial(set, key);
    });

    return api;
}();

module.exports = function(model, viewMode, typeEditor, typeGap) {
    var api = {
            init: function() {
                _.extend(api, state.init);
            },
            get lineHeight() {
                return Math.floor(viewMode.getLineHeight());
            },
            changeLineHeight: viewMode.changeLineHeight
        },
        resetView = function() {
            typeEditor.hideDialogs();
            model.selectionModel.clear();
        },
        transition = {
            toTerm: function() {
                resetView();

                typeEditor.editEntity();
                viewMode.setTerm();
                viewMode.setEditable(true);
                typeGap.set(typeGapCache.instanceHide);

                _.extend(api, state.termCentric);
            },
            toInstance: function() {
                resetView();

                typeEditor.editEntity();
                viewMode.setInstance();
                viewMode.setEditable(true);
                typeGap.set(typeGapCache.instanceShow);

                _.extend(api, state.instanceRelation);
            },
            toRelation: function() {
                resetView();

                typeEditor.editRelation();
                viewMode.setRelation();
                viewMode.setEditable(true);
                typeGap.set(typeGapCache.instanceShow);

                _.extend(api, state.relationEdit);
            },
            toViewTerm: function() {
                resetView();

                typeEditor.noEdit();
                viewMode.setTerm();
                viewMode.setEditable(false);
                typeGap.set(typeGapCache.instanceHide);

                _.extend(api, state.viewTerm);
            },
            toViewInstance: function() {
                resetView();

                typeEditor.noEdit();
                viewMode.setInstance();
                viewMode.setEditable(false);
                typeGap.set(typeGapCache.instanceShow);

                _.extend(api, state.viewInstance);
            }
        },
        // Calculate the line-height when the view-mode set
        notTransit = function() {
            console.log('no mode transition.', this.name);
        },
        changeTypeGapInstanceHide = _.compose(typeGap.set, typeGapCache.setInstanceHide),
        changeTypeGapInstanceShow = _.compose(typeGap.set, typeGapCache.setInstanceShow),
        state = {
            init: _.extend({}, transition, {
                name: 'Init'
            }),
            termCentric: _.extend({}, transition, {
                name: 'Term Centric',
                toTerm: notTransit,
                changeTypeGap: changeTypeGapInstanceHide,
                showInstance: false
            }),
            instanceRelation: _.extend({}, transition, {
                name: 'Instance / Relation',
                toInstance: notTransit,
                changeTypeGap: changeTypeGapInstanceShow,
                showInstance: true
            }),
            relationEdit: _.extend({}, transition, {
                name: 'Relation Edit',
                toRelation: notTransit,
                changeTypeGap: changeTypeGapInstanceShow,
                showInstance: true
            }),
            viewTerm: _.extend({}, transition, {
                name: 'View Only',
                toTerm: notTransit,
                toInstance: transition.toViewInstance,
                toRelation: notTransit,
                toViewTerm: notTransit,
                changeTypeGap: changeTypeGapInstanceHide,
                showInstance: false
            }),
            viewInstance: _.extend({}, transition, {
                name: 'View Only',
                toTerm: transition.toViewTerm,
                toInstance: notTransit,
                toRelation: notTransit,
                toViewInstance: notTransit,
                changeTypeGap: changeTypeGapInstanceShow,
                showInstance: true
            })
        };

    return api;
};
