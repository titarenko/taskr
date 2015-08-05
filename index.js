var _ = require('lodash');
var engine = require('./engine');
var utils = require('./utils');
var inMemoryMedium = require('./in-memory-medium');

function create (options) {
	var hooks = _.clone(options.hooks);
	_.defaults(hooks, {
		before: _.identity, 
		after: _.identity,
		exception: _.identity 
	});
	var handlers = utils.loadHandlers(options.basedir, options.handlers);
	return engine({
		medium: options.medium || inMemoryMedium(),
		handlers: utils.normalizeNames(handlers),
		concurrency: utils.normalizeNames(options.concurrency || {}),
		piping: utils.normalizeNamesAndValues(options.piping || {}),
		schedule: utils.normalizeNames(options.schedule || {}),
		hooks: hooks
	});
}

module.exports = create;
