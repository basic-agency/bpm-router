# Router

> Super lightweight router for single page applications. It uses a simple weighting algorithm to to determine a paths accuracy.

## Usage

Initialize router with `Router.start()`. You can either pass an object with all routes or register them individually with `Router.route(path, fn)` ideally before starting the router but not necessary.

```javascript
Router.route('/404', () => {
	console.log('404');
});

Router.start({
	'/': () => {
		console.log('home');
	},
	'/:page': (page) => {
		console.log(page);
	},
	'/:id/:a/?:b': (id, a, b) => {
		console.log(id, a, b);
	}
});
```

Navigate:

```javascript
Router.navigate('/page')
```

Change the root of the project:

```javascript
Router.root = '/subdir/'; // default '/'
```

Add redirects:

```javascript
Router.redirect({
	'/home': '/',
	'/old-post': '/new-post'
});
```

## Helpful Functions

```javascript
const routerClick = (e) => {
	e.preventDefault();
	Router.navigate(e.currentTarget.getAttribute('href'));
};

overrideAnchor() {
	const anchor = document.querySelectorAll('a:not([href*="http"]):not([href*="tel"]):not([data-bypass])');
	for (const a of anchor) {
		a.removeEventListener('click', routerClick);
		a.addEventListener('click', routerClick);
	}
}
```
