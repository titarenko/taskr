var Promise = require('bluebird');

module.exports = function (input) {
	return Promise.delay(50).return('50 ms task: ' + input);
};
