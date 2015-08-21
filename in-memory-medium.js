function create () {
	var handlers = {};
	var queues = {};

	function subscribe (task, handler, options) {
		handlers[task] = handler;
	}

	function publish (task, params) {
		var queue = queues[task];
		if (queue) {
			queue.push(params);
			return;
		}
		queues[task] = [params];
		run(task);
	}

	function run (task) {
		var queue = queues[task];
		if (!queue) {
			return;
		}
		var params = queue[0];
		handlers[task](params, function () {
			var queue = queues[task].slice(1);
			queues[task] = queue.length ? queue : null;
			run(task);
		});
	}

	return {
		subscribe: subscribe,
		publish: publish
	};
}

module.exports = create;
