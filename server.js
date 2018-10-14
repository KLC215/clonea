const Clonea = require('./clonea');
const app = new Clonea();

app.use(async (ctx, next) => {
	ctx.body = '1';
	await next();
	ctx.body += '2';
});
app.use(async (ctx, next) => {
	ctx.body += '3';
	await next();
	await new Promise((resolve, _) =>
		setTimeout(() => {
			resolve();
		}, 1000)
	);
	ctx.body += '4';
});
app.use(async (ctx, next) => {
	ctx.body += '5';
});

app.listen(3001, () => {
	console.log('server is listening on port 3001');
});
