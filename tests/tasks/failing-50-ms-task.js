var Promise = require('bluebird');

module.exports = function (input) {
	return Promise.delay(50).then(function () {
		throw new Error();
	});
};
