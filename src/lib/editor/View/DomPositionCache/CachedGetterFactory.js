import LesserMap from './LesserMap';

export default function() {
    let caches = [],
        factory = (getter) => create(caches, getter);

    factory.clearAllCache = () => clearAll(caches);
    return factory;
}

function create(caches, getter) {
    let map = new LesserMap();

    add(caches, map);
    return (id) => getFromCache(map, getter, id);
}

function add(caches, cache) {
    caches.push(cache);
}

function getFromCache(cache, getter, id) {
    if (!cache.has(id)) {
        cache.set(id, getter(id));
    }

    return cache.get(id);
}

function clearAll(caches) {
    caches.forEach(cache => cache.clear());
}
