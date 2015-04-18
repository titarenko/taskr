var Promise = require('bluebird');

module.exports = function (input) {
	return Promise.delay(100).return('100 ms task: ' + input);
};
