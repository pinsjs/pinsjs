if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            const o = Object(this);
            // tslint:disable-next-line:no-bitwise
            const len = o.length >>> 0;

            if (len === 0) {
                return false;
            }
            // tslint:disable-next-line:no-bitwise
            const n = fromIndex | 0;
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}