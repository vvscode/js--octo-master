const Octokat = require('octokat');
const LineByLineReader = require('line-by-line');

const lr = new LineByLineReader('users.db');

lr.on('error', function (err) {
  console.log('[ERROR]', err);
});

lr.on('line', function (line) {
  console.log(line);
  
});

lr.on('end', function () {
	console.log('[DONE]');
});
