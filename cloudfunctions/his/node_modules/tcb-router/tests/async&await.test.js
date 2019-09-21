const TcbRouter = require('../src/index');

describe('req test', () => {
    const app = new TcbRouter({
        event: { $url: "router", data: { name: 'tcb', sex: 'male' } }
    });

    test("req", () => {
        expect(app._req).toMatchObject({
            event: {
                $url: "router",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
        expect(app._req).toHaveProperty("url", "router");
    });
});

describe('route test', () => {

    test("router string", async () => {
        const app = new TcbRouter({
            event: { $url: "router", data: { name: 'tcb', sex: 'male' } }
        });

        app.use(async (ctx, next) => {
            ctx.data = { company: 'Tencent' };
            await next();
        });

        app.router('router', async (ctx, next) => {
            ctx.data.name = 'tcb';
            ctx.body = {
                code: 0,
                message: 'succcess'
            };
            await next();
        });

        let result = await app.serve();

        expect(result).toEqual({
            code: 0,
            message: 'succcess'
        });

        expect(app._req).toMatchObject({
            event: {
                $url: "router",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
        expect(app.data).toEqual({ name: 'tcb', company: 'Tencent' });
    });

    test("router array", async () => {
        const app = new TcbRouter({
            event: { $url: "router2", data: { name: 'tcb', sex: 'male' } }
        });

        app.use(async (ctx, next) => {
            ctx.data = { company: 'Tencent' };
            await next();
        });

        app.router(['router', "router2"], async (ctx, next) => {
            ctx.data.name = 'tcb';
            ctx.body = {
                code: 0,
                message: 'succcess'
            };
            await next();
        });

        let result = await app.serve();

        expect(result).toEqual({
            code: 0,
            message: 'succcess'
        });

        expect(app._req).toMatchObject({
            event: {
                $url: "router2",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
        expect(app.data).toEqual({ name: 'tcb', company: 'Tencent' });
    });

    test("use", async () => {
        const app = new TcbRouter({
            event: { $url: "router2", data: { name: 'tcb', sex: 'male' } }
        });

        app.use(async (ctx) => {
            ctx.data = { company: 'Tencent' };
            ctx.body = {
                code: 0,
                message: 'succcess'
            };
        });

        let result = await app.serve();
        expect(result).toEqual({
            code: 0,
            message: 'succcess'
        });

        expect(app._req).toMatchObject({
            event: {
                $url: "router2",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
        expect(app.data).toEqual({ company: 'Tencent' });
    });

    test('use routes', async () => {
        const app = new TcbRouter({
            event: { $url: 'router', data: { name: 'tcb', sex: 'male' } }
        });

        app.use('router', async (ctx) => {
            ctx.data = { name: 'tcb', company: 'Tencent' };
            ctx.body = {
                code: 0,
                message: 'succcess'
            };
        });

        let result = await app.serve();

        expect(result).toEqual({
            code: 0,
            message: 'succcess'
        });

        expect(app._req).toMatchObject({
            event: {
                $url: "router",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
        expect(app.data).toEqual({ name: 'tcb', company: 'Tencent' });
    });

    test('not match routes', async () => {
        const app = new TcbRouter({
            event: { $url: 'router1', data: { name: 'tcb', sex: 'male' } }
        });

        app.use('router', async (ctx) => {
            ctx.data = { name: 'tcb', company: 'Tencent' };
            ctx.body = {
                code: 0,
                message: 'succcess'
            };
        });

        let result = await app.serve();
        expect(result).toEqual(undefined);

        expect(app._req).toMatchObject({
            event: {
                $url: "router1",
                data: {
                    name: 'tcb',
                    sex: 'male'
                }
            }
        });
    });
});

describe('exceptions', () => {
    test("use requires functions", async () => {
        const app = new TcbRouter({
            event: { $url: "router2", data: { name: 'tcb', sex: 'male' } }
        });

        console.warn = jest.fn();
        app.use(null);
        await app.serve();

        expect(console.warn.mock.calls[0][0]).toEqual('Handler should be a function. The middleware is not installed correctly.');
    });

    test("route requires functions", async () => {
        const app = new TcbRouter({
            event: { $url: "router2", data: { name: 'tcb', sex: 'male' } }
        });

        console.warn = jest.fn();
        app.router('router', null);
        await app.serve();

        expect(console.warn.mock.calls[0][0]).toEqual('Handler should be a function. The middleware is not installed correctly.');
    });
});