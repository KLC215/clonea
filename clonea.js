const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Clonea {
	constructor() {
		this.callback = () => {};
		this.context = context;
		this.request = request;
		this.response = response;
		this.middlewares = [];
	}

	use(callback) {
		this.middlewares.push(callback);
	}

	compose(middlewares) {
		return context => {
			const dispatch = i => {
				let func = middlewares[i];

				if (!func) {
					return Promise.resolve();
				}
				return Promise.resolve(func(context, () => dispatch(i + 1)));
			};

			return dispatch(0);
		};
	}

	listen(...args) {
		const server = http.createServer(async (req, res) => {
			let ctx = this.createContext(req, res);
			const func = this.compose(this.middlewares);
			await func(ctx);
			ctx.res.end(ctx.body);
		});

		server.listen(...args);
	}

	createContext(req, res) {
		const ctx = Object.create(this.context);
		ctx.request = Object.create(this.request);
		ctx.response = Object.create(this.response);
		ctx.req = ctx.request.req = req;
		ctx.res = ctx.response.res = res;

		return ctx;
	}
}

module.exports = Clonea;
