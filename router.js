class Router {

	constructor() {
		this.routes = [];
		this.map = {};
		this.root = '/';

		this.http404 = '/404';

		this.redirects = {};

		this.addEventListeners();
	}

	parse(path) {
		return decodeURI(path).split('/').filter((v) => {
			if (v !== '') return v;
		});
	}

	route(path, fn) {
		const params = this.parse(path);
		this.routes.push(path);
		this.map[path] = {
			params,
			fn
		};
	}

	navigate(path, silent = false) {
		if (path !== window.location.pathname) {
			let finalPath = path;
			if (this.redirects[path]) finalPath = this.redirects[path];
			window.history.pushState(false, false, this.root.replace(/\/$/, '') + finalPath);
		}
		
		if (!silent) {
			this.check();
		}
	}

	redirect(urls) {
		for (const u in urls) this.redirects[u] = urls[u];
	}

	check() {
		let path = window.location.pathname.replace(this.root.replace(/\/$/, ''), ''),
			match = {
				route: false,
				accuracy: 0,
				variables: []
			};

		if (this.redirects[path]) path = this.redirects[path];

		const params = this.parse(path);

		for (const i in this.routes) {
			const routeParams = this.map[this.routes[i]].params;
			const variables = [];
			let accuracy = 0;
			if (params.length) {
				if (params.length <= routeParams.length) {
					for (const p in routeParams) {
						if (params[p]) {
							if (params[p] === routeParams[p]) {
								accuracy += 100;
							} else if (routeParams[p].charAt(0) === ':') {
								accuracy += 5;
								variables.push(params[p]);
							} else if (routeParams[p].charAt(0) === '?') {
								accuracy += 1;
								if (routeParams[p].charAt(1) === ':') variables.push(params[p]);
							} else {
								accuracy = 0;
								break;
							}
						} else if (routeParams[p].charAt(0) !== '?') {
							accuracy = 0;
						}
					}
				}
			} else {
				match = { route: '/', accuracy, variables };
			}
			if (accuracy && accuracy >= match.accuracy) {
				match = { route: this.routes[i], accuracy, variables };
			}
		}

		if (match.route && this.map[match.route]) {
			this.map[match.route].fn(...match.variables);
		} else if (this.map[this.http404]) {
			this.map[this.http404].fn();
		}
	}

	start(routes) {
		if (routes) {
			for (const r in routes) this.route(r, routes[r]);
		}
		this.check();
	}

	_windowOnPopstate() {
		this.check();
	}

	addEventListeners() {
		this._windowOnPopstate = this._windowOnPopstate.bind(this);

		window.addEventListener('popstate', this._windowOnPopstate);
	}

	removeEventListeners() {
		window.removeEventListener('popstate', this._windowOnPopstate);
	}

}

export default new Router();
