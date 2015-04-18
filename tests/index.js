var _ = require('lodash');
var should = require('should');

var taskr = require('../');
var queue = taskr(__dirname + '/tasks', _.identity, _.identity);

describe('taskr', function () {
	it('should queue task', function (done) {
		var first;
		queue.start('100 ms task', 1).then(function (output) {
			first = output;
		});
		queue.start('100 ms task', 2).then(function (output) {
			first.should.eql('100 ms task: 1');
			output.should.eql('100 ms task: 2');
			done();
		});
	});

	it('should not allow cyclic piping', function () {
		should(_.partial(queue.pipe, 'same name', 'same name')).throw();
	});

	it('should pipe task', function (done) {
		queue.pipe('100 ms task', '50 ms task');
		queue.start('100 ms task', 1).then(function (output) {
			output.should.eql('50 ms task: 100 ms task: 1');
			done();
		});
	});

	it('should not pipe failing task', function (done) {
		queue.pipe('failing 100 ms task', '50 ms task');
		queue.start('failing 100 ms task', 1).then(function (output) {
			should(output).be.undefined;
			done();
		});
	});
});
