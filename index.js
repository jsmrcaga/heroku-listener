const http = require('http');
const fishingrod = require('fishingrod');

const server = http.createServer((req, res) => {
	res.end('OK');
});

const keep_alive = (debug=false) => {
	const m20 = 1000 * 60 * 5; // 5 minutes
	setInterval(() => {
		fishingrod.fish({
			host: 'discord-thb-bot.herokuapp.com',
			method: 'GET'
		}).then(({ response }) => {
			debug && console.log('[Heroku] Kept alive: ', response);
		}).catch(e => {
			// wtf?
			debug && console.error('[Heroku][KeepAlive]', e);
		});
	}, m20);
};

module.exports = {
	listen: (options, cb=()=>{}) => {
		options.debug && console.log('[Heroku] Launching server...');
		return new Promise((y, n) => {
			return server.listen(options, (err) => {
				if(err) {
					return n(err);
				}

				options.debug && console.log('[Heroku] Server alive, launching scheduler');
				keep_alive(options.debug);
				cb(server);
				return y(server);
			});
		});
	}
};
