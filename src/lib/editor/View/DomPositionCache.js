var Cache = function() {
        var cache = {},
            set = function(key, value) {
                cache[key] = value;
                return value;
            },
            get = function(key) {
                return cache[key];
            },
            remove = function(key) {
                delete cache[key];
            },
            clear = function() {
                cache = {};
            };

        return {
            set: set,
            get: get,
            remove: remove,
            clear: clear,
            // To debug.
            keys: function() {
                return Object.keys(cache);
            }
        };
    },
    cacheMan = function() {
        var caches = [],
            add = function(cache) {
                caches.push(cache);
            },
            getFromCache = function(cache, getPositionFunciton, id) {
                return cache.get(id) ? cache.get(id) : cache.set(id, getPositionFunciton(id));
            },
            create = function(func) {
                var cache = new Cache();
                add(cache);
                return _.partial(getFromCache, cache, func);
            },
            clear = function() {
                caches.forEach(function(cache) {
                    cache.clear();
                });
            };

        return {
            create: create,
            clear: clear
        };
    }(),
    domUtil = require('./domUtil'),
    createNewCache = function(editor, entityModel) {
        // The chache for position of grids.
        // This is updated at arrange position of grids.
        // This is referenced at create or move relations.
        var gridPositionCache = _.extend(new Cache(), {
            isGridPrepared: function(entityId) {
                var spanId = entityModel.get(entityId).span;
                return gridPositionCache.get(spanId);
            }
        });

        // The posion of the text-box to calculate span postion;
        var getTextNodeFunc = function() {
                return editor.find('.textae-editor__body__text-box').offset();
            },
            getTextNode = cacheMan.create(getTextNodeFunc),
            getSpanFunc = function(spanId) {
                var $span = domUtil.selector.span.get(spanId);
                if ($span.length === 0) {
                    throw new Error("span is not renderd : " + spanId);
                }

                var offset = $span.offset();
                return {
                    top: offset.top - getTextNode().top,
                    left: offset.left - getTextNode().left,
                    width: $span.outerWidth(),
                    height: $span.outerHeight(),
                    center: $span.get(0).offsetLeft + $span.outerWidth() / 2
                };
            },
            getEntityFunc = function(entityId) {
                var $entity = domUtil.selector.entity.get(entityId, editor);
                if ($entity.length === 0) {
                    throw new Error("entity is not rendered : " + entityId);
                }

                var spanId = entityModel.get(entityId).span;
                var gridPosition = gridPositionCache.get(spanId);
                var entityElement = $entity.get(0);
                return {
                    top: gridPosition.top + entityElement.offsetTop,
                    center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2,
                };
            };

        // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
        // This is refered by render.relation and domUtil.selector.relation.
        var connectCache = new Cache();
        var toConnect = function(relationId) {
            return connectCache.get(relationId);
        };

        // The cache for span positions.
        // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
        // This cache is big effective for the initiation, and little effective for resize.
        var getSpan = cacheMan.create(getSpanFunc);
        var getEntity = cacheMan.create(getEntityFunc);

        return {
            reset: cacheMan.clear,
            getSpan: getSpan,
            getEntity: getEntity,
            gridPositionCache: gridPositionCache,
            getGrid: gridPositionCache.get,
            setGrid: gridPositionCache.set,
            toConnect: toConnect,
            connectCache: connectCache
        };
    };

// Utility functions for get positions of DOM elemnts.
module.exports = function(editor, entityModel) {
    // The editor has onry one position cache.
    editor.postionCache = editor.postionCache || createNewCache(editor, entityModel);
    return editor.postionCache;
};
