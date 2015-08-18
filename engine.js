function create (context) {
	var _ = require('lodash');
	var CronJob = require('cron').CronJob;
	var Promise = require('bluebird');
	var utils = require('./utils');

	var medium = context.medium;
	var piping = context.piping;
	var hooks = context.hooks;
	var handlers = context.handlers;
	var concurrency = context.concurrency;
	var schedule = context.schedule;

	function pipeMessage (task, result) {
		var next = piping[task];
		if (!next) {
			return;
		}
		if (_.isArray(next)) {
			if (_.isArray(result) && next.length === 1) {
				_.each(result, function (item) {
					medium.publish(next[0], item);
				});
			} else {
				_.each(next, function (task) {
					medium.publish(task, result);
				});
			}
		} else {
			medium.publish(next, result);
		}
	}

	function handleMessage (task, handler, params, ack) {
		return Promise
			.try(function () { return hooks.before(task, params); })
			.then(function () { return handler(params); })
			.tap(function (result) { return hooks.after(task, params, result); })
			.then(function (result) { return pipeMessage(task, result); })
			.tap(function () { return ack(); })
			.catch(function (exception) { 
				return Promise.resolve(hooks.exception(task, params, exception))
					.return(exception)
					.then(ack);
			});
	}

	function subscribeMessageHandlers () {
		_.each(handlers, function (handler, task) {
			var options = { concurrency: concurrency[task] || 1 };
			medium.subscribe(task, _.partial(handleMessage, task, handler), options);
		});
	}

	function runSchedule () {
		_.each(schedule, function (cronTime, task) {
			if (_.isObject(cronTime)) {
				_.each(cronTime, function (params, cronTime) {
					new CronJob(cronTime, _.partial(medium.publish, task, params), null, true);
				});
			} else {
				new CronJob(cronTime, _.partial(medium.publish, task), null, true);
			}
		});
	}

	subscribeMessageHandlers();
	runSchedule();

	function start (task, params) {
		return medium.publish(utils.normalizeName(task), params);
	}

	return {
		start: start
	};
}

module.exports = create;
