# taskr

Simplest task management module.

[![Build Status](https://secure.travis-ci.org/titarenko/taskr.png?branch=master)](https://travis-ci.org/titarenko/taskr) [![Coverage Status](https://coveralls.io/repos/titarenko/taskr/badge.png)](https://coveralls.io/r/titarenko/taskr)

[![NPM](https://nodei.co/npm/taskr.png?downloads=true&stars=true)](https://nodei.co/npm/taskr/)

## Installation

```bash
npm i taskr --save
```

## Example

```js
var queue = require('taskr')({
	handlers: __dirname + '/tasks', // load each module as task and name each one (task) after corresponding module
	hooks: {
		before: function (task, params) { console.log('started task', task, params); },
		after: function (task, params, result) { console.log('finished task', task, params, result); }
		exception: function (task, params, exception) { console.log('failed task', task, params, exception); }
	},
	piping: {
		'after task': 'do this task',
		'after task which returns array': ['process each item of resulting array'],
		'after task': ['start', 'multiple', 'tasks', 'immediately']
	},
	schedule: {
		'my periodic task runs each 30 seconds': '*/30 * * * * *',
		'this one takes args': { '2 * * * * *': 'wow!' }
		'this one takes args, now with multiple schedules': { '2 * * * * *': '2 seconds', '5 * * * * *': '5 secs' }
	}
});
queue.start('start this immediately', { param: 10 });
```

## License

MIT
