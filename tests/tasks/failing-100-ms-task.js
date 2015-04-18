var Promise = require('bluebird');

module.exports = function (input) {
	return Promise.delay(100).then(function () {
		throw new Error();
	});
};
