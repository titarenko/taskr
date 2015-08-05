var _ = require('lodash');
var should = require('should');
var sinon = require('sinon');

var utils = require('../utils');

describe('utils', function () {
	describe('loadHandlers', function () {
		it('should load handlers from absolute path', function () {
			var requireAll = sinon.spy();
			var u = utils.__buildModule(requireAll);
			u.loadHandlers(null, 'myabspath');
			requireAll.firstCall.args[0].should.eql('myabspath');
		});
		it('should load handlers from basedir path', function () {
			var requireAll = sinon.spy();
			var u = utils.__buildModule(requireAll);
			u.loadHandlers('mybasedir', null);
			requireAll.firstCall.args[0].should.eql('mybasedir/handlers');
		});
	});
	describe('normalizeNamesAndValues', function () {
		it('should work with string-string dictionaries', function () {
			utils.normalizeNamesAndValues({
				'a task': 'an another task',
				'something-other': 'another-something-other'
			}).should.eql({
				aTask: 'anAnotherTask',
				somethingOther: 'anotherSomethingOther'
			});
		});
		it('should work with string-arrayofstring dictionaries', function () {
			utils.normalizeNamesAndValues({
				'a task': ['an another task'],
				'whoot-2': ['a-b', 'c-d']
			}).should.eql({
				aTask: ['anAnotherTask'],
				whoot2: ['aB', 'cD']
			});
		});
	});
});
