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
	it('should throw if no handlers specified', function () {
		should.throws(function () {
			taskr({});
		});
	});
	it('should pipe tasks', function (done) {
		var queue = taskr({
			hooks: { exception: done },
			handlers: {
				begin: sinon.stub().returns(48),
				end: function (arg) {
					arg.should.eql(48);
					done();
				}
			},
			piping: {
				begin: 'end'
			}
		});
		queue.start('begin', 42);
	});
	it('should pipe tasks with result mapping', function (done) {
		var args = [];
		var queue = taskr({
			hooks: { exception: function (t, p, e) { done(e); } },
			handlers: {
				begin: sinon.stub().returns([48, 12]),
				end: function (arg) {
					args.push(arg);
					if (args.length === 2) {
						args.should.eql([48, 12]);
						done();
					}
				}
			},
			piping: {
				begin: ['end']
			}
		});
		queue.start('begin', 42);
	});
	it('should multi-pipe tasks', function (done) {
		var calls = 0;
		var queue = taskr({
			hooks: { exception: function (t, p, e) { done(e); } },
			handlers: {
				begin: sinon.stub().returns(11),
				end: function (arg) {
					arg.should.eql(11);
					if (++calls === 2) {
						done();
					}
				},
				end2: function (arg) {
					arg.should.eql(11);
					if (++calls === 2) {
						done();
					}
				}
			},
			piping: {
				begin: ['end', 'end2']
			}
		});
		queue.start('begin', 42);
	});
	it('should call before/after hooks', function (done) {
		var before = sinon.spy(), after = sinon.spy();
		var queue = taskr({
			hooks: { 
				before: before,
				after: after,
				exception: function (t, p, e) { done(e); } 
			},
			handlers: {
				task: sinon.stub().returns(15)
			}
		});
		queue.start('task', 40).then(function () {
			before.firstCall.args.should.eql(['task', 40]);
			after.firstCall.args.should.eql(['task', 40, 15]);
			done();
		});
	});
	it('should call exception hook', function (done) {
		var error = new Error('Oh no!');
		var queue = taskr({
			hooks: { 
				exception: function (t, p, e) {
					t.should.eql('task1');
					p.should.eql(111);
					e.should.eql(error);
					done();
				} 
			},
			handlers: {
				task1: sinon.stub().throws(error)
			}
		});
		queue.start('task1', 111);
	});
	it('should schedule task', function (done) {
		var called = false;
		taskr({
			handlers: {
				task100: function () { if (called) return; called = true; done(); }
			},
			schedule: {
				task100: '* * * * * *'
			}
		});
	});
	it('should schedule task with args', function (done) {
		var called = false;
		taskr({
			handlers: {
				task100: function (arg) { 
					if (called) return; called = true;
					arg.should.eql('something');
					done(); 
				}
			},
			schedule: {
				task100: { '* * * * * *': 'something' }
			}
		});
	});
});
