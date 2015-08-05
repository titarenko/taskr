function __buildModule (requireAll) {
	var _ = require('lodash');
	var path = require('path');

	function normalizeName (name) {
		return _.camelCase(name);
	}

	function normalizeNames (obj) {
		return _.transform(obj, function (result, value, key) {
			result[normalizeName(key)] = value;
		});
	}

	function normalizeNamesAndValues (obj) {
		return _.transform(obj, function (result, value, key) {
			result[normalizeName(key)] = _.isArray(value)
				? value.map(normalizeName) 
				: normalizeName(value);
		});
	}

	function loadHandlers (basedir, handlers) {
		if (_.isString(handlers)) {
			return requireAll(handlers);
		}
		if (_.isObject(handlers)) {
			return handlers;
		}
		if (_.isString(basedir)) {
			return requireAll(path.join(basedir, 'handlers'));
		}
		throw new Error('No handlers specified!');
	}

	return {
		normalizeName: normalizeName,
		normalizeNames: normalizeNames,
		normalizeNamesAndValues: normalizeNamesAndValues,
		loadHandlers: loadHandlers
	};
}

module.exports = __buildModule(require('require-all'));
module.exports.__buildModule = __buildModule;
