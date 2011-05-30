// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

// readable string representations of values
exports.repr = function(x) {
    if (x !== null && x !== undefined && typeof x.repr === 'function') return x.repr();

    if (x === null || x === undefined ||
        x instanceof Number || typeof x === 'number' ||
        x instanceof Boolean || typeof x === 'boolean' ||
        x instanceof RegExp || x.constructor === RegExp)
    {
        return String(x);
    }

    if (x instanceof String || typeof x === 'string')
        return '"' + x.replace(/"/g, '\\"') + '"';

    if (x instanceof Date || x.toUTCString)
        return 'new Date(' + (+x) + ')'; // lame

    if (Array.isArray(x))
        return '[' + x.map(repr).join(',') + ']';

    if (x instanceof Function || typeof x === 'function')
        return x.toString();

    // TODO determine how far to go with this. should we include non-enumerable props too?
    if (x instanceof Object || typeof x === 'object')
        return '{' + Object.keys(x).map(function(k) { return repr(k) + ':' + repr(x[k]); }).join(',') + '}';

    throw new Error("don't know how to represent " + x);
};
