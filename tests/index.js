var _ = require('lodash');
var should = require('should');

var taskr = require('../');

describe('taskr', function () {
	it('should init', function () {
		var queue = taskr({
			handlers: { 
				task: function () {},
				'another task': function () {}
			},
			schedule: {
				task: '0 5 * * * *'
			},
			piping: {
				'task': 'another task'
			}
		});
	});
});
