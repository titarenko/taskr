var CronJob = require('cron').CronJob;
var Promise = require('bluebird');
var _ = require('lodash');
var path = require('path');

function ctor (directory, stdout, stderr) {
	var handlers = {};
	var executing = {};
	var pipes = {};

	stdout = stdout || console.log;
	stderr = stderr || console.error;

	function pipe (from, to) {
		if (from == to) {
			throw new Error('Cyclic piping is prohibited');
		}
		pipes[from] = to;
	}

	function handleTask (name, input) {
		var handler = load(name);
		var failure;
		return executing[name] = Promise.resolve(executing[name]).then(function () {
			stdout(name, 'started');
		}).then(_.partial(handler, input)).then(function (output) {
			stdout(name, 'ended with success');
			return output;
		}).catch(function (error) {
			stderr(name, 'ended with error', failure = error);
		}).then(function (output) {
			if (!failure) {
				return handlePiping(name, output);
			}
			return output;
		});
	}

	function handlePiping (name, output) {
		var destination = pipes[name];
		if (destination) {
			stdout('piping', name, 'to', destination);
			return handleTask(destination, output);
		}
		return Promise.resolve(output);
	}

	function load (taskName) {
		if (handlers[taskName]) {
			return handlers[taskName];
		}

		var handlerPath = path.join(directory, _.kebabCase(taskName));
		var handler = require(handlerPath);

		return handlers[taskName] = handler;
	}

	function schedule (cronTime, name) {
		var job = new CronJob(cronTime, _.partial(handleTask, name));
		job.start();
	}

	return {
		pipe: pipe,
		schedule: schedule,
		start: handleTask
	};
}

module.exports = ctor;
