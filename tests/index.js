var _ = require('lodash');
var should = require('should');
var sinon = require('sinon');

var taskr = require('../');

describe('taskr', function () {
	it('should run given task', function (done) {
		var queue = taskr({
			hooks: { exception: done },
			handlers: {
				'my task': function (arg) {
					arg.should.eql(42);
					done();
				}
			}
		});
		queue.start('my task', 42);
	});
});
