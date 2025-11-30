function normalizeName(name) {
    if (typeof name !== "string") {
        name = String(name);
    }

    name = name.trim();

    if (name.length === 0) {
        throw new TypeError("Header field name is empty");
    }

    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name)) {
        throw new TypeError(`Invalid character in header field name: ${name}`);
    }

    return name.toLowerCase();
}

function normalizeValue(value) {
    if (typeof value !== "string") {
        value = String(value);
    }
    return value;
}

class Headers {
    #map = new Map();

    constructor(init = {}) {
        if (init instanceof Headers) {
            init.forEach(function (value, name) {
                this.append(name, value);
            }, this);

            return this;
        }

        if (Array.isArray(init)) {
            init.forEach(function ([name, value]) {
                this.append(name, value);
            }, this);

            return this;
        }

        if (init && typeof init === "object") {
            Object.getOwnPropertyNames(init).forEach((name) =>
                this.append(name, init[name])
            );
        }
    }

    append(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        const oldValue = this.get(name);
        this.#map.set(name, oldValue ? oldValue + ", " + value : value);
    }

    delete(name) {
        this.#map.delete(normalizeName(name));
    }

    get(name) {
        name = normalizeName(name);
        return this.has(name) ? this.#map.get(name) : null;
    }

    has(name) {
        return this.#map.has(normalizeName(name));
    }

    set(name, value) {
        this.#map.set(normalizeName(name), normalizeValue(value));
    }

    forEach(callback, thisArg) {
        this.#map.forEach(function (value, name) {
            callback.call(thisArg, value, name, this);
        }, this);
    }

    keys() {
        return this.#map.keys();
    }

    values() {
        return this.#map.values();
    }

    entries() {
        return this.#map.entries();
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    toObject() {
        const obj = {};
        this.#map.forEach((value, name) => {
            obj[name] = value;
        });
        return obj;
    }
}

export default Headers;
