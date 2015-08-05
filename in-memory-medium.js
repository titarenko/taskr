function create () {
	var handlers = {};

	function subscribe (task, handler, options) {
		handlers[task] = handler;
	}

	function publish (task, params) {
		handlers[task](params, function () {});
	}

	return {
		subscribe: subscribe,
		publish: publish
	};
}

module.exports = create;
