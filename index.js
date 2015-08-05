var engine = require('./engine');
var utils = require('./utils');
var inMemoryMedium = require('./in-memory-medium');

function create (options) {
	return engine({
		medium: options.medium || inMemoryMedium(),
		handlers: utils.normalizeNames(utils.loadHandlers(options.basedir, options.handlers)),
		concurrency: utils.normalizeNames(options.concurrency || {}),
		piping: utils.normalizeNamesAndValues(options.piping || {}),
		schedule: utils.normalizeNames(options.schedule || {})
	});
}

module.exports = create;
