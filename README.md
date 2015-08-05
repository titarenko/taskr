# taskr

Simplest task management module.

## Installation

```bash
npm i taskr --save
```

## Example

```js
var queue = require('taskr')({
	handlers: __dirname + '/tasks', // load each module as task and name (task) after corresponding modules
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
		'this one takes args': { '2 * * * * *': '2 seconds', '5 * * * * *': '5 secs' }
	}
});
queue.start('start this immediately', { param: 10 });
```

## License

MIT
