class TcbRouter {

    constructor({ event = {}, callback } = {}) {
        if (callback && typeof callback !== 'function') {
            throw new Error('Callback must be a function.');
        }

        // 中间件
        this._middlewares = [];
        this._req = { event, url: event.$url };
        this._res = { callback };
    }

    use() {
        let path = null;
        let handler = null;

        if (arguments.length === 1) {
            path = '*';
            handler = arguments[0];
        }
        else if (arguments.length > 1) {
            path = arguments[0];
            handler = arguments[1];
        }

        if (typeof handler !== 'function') {
            return console.warn('Handler should be a function. The middleware is not installed correctly.');
        }

        this._middlewares.push({
            handler,
            path
        });
    }

    router(path = '*') {

        for (let i = 1, len = arguments.length; i < len; i++) {
            let handler = arguments[i];
            if (typeof handler !== 'function') {
                return console.warn('Handler should be a function. The middleware is not installed correctly.');
            }

            this._middlewares.push({
                handler,
                path
            });
        }
    }

    serve() {
        let length = this._middlewares.length;
        let index = 0;

        const next = () => {
            if (!this._middlewares[index]) {
                return;
            }
            let { handler, path } = this._middlewares[index++];
            let pathIsArray = Array.isArray(path);
            let isLast = (index + 1 === length);

            if (pathIsArray && path.includes(this._req.url)
                || (path === '*' || new RegExp(`^${this._req.url}$`).test(path))) {
                // path 是数组的情况
                console.log(`本次进行中间件: ${path}`);
                if (!isLast) {
                    handler(this._req, this._res, next);
                }
                else {
                    return handler(this._req, this._res);
                }
            }
            else {
                return this._res.callback(null);
            }
        };

        next();
    }
}

module.exports = TcbRouter;