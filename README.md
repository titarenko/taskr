# taskr

Simplest task management promise-based module

## Installation

```bash
npm install taskr --save
```

## Usage

```js
var tasks = require('taskr')(__dirname + '/task-handlers');

// will search for module 'task-handlers/my-awesome-task' considering it's exporting single function-worker
// then immediately run that function bypassing given parameter to it
// assumes, worker function returns promise
tasks.start('my awesome task', {param: value});

// will search for module 'task-handlers/every-minute' considering it's exporting single function-worker
// then will run it each minute
// (if previous call was not finished, then new one will be queued to be executed exactly after previous one)
tasks.schedule('0 * * * *', 'every minute');

// will run 'do that' immediately after 'after this'
tasks.pipe('after this', 'do that');
```

## License

MIT
