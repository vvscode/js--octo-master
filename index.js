const Octokat = require('octokat');
const LineByLineReader = require('line-by-line');

const lr = new LineByLineReader('users.db');

function getConfigByLine(line) {
  if(line.indexOf(' : ')>=0) {
    const userDataArr = line.split(' : ');
    return { username: userDataArr[0], password: userDataArr[1] };
  }
  return { token: line }
}

lr.on('error', function (err) {
  console.log('[ERROR]', err);
});

lr.on('line', function (line) {
  const config = getConfigByLine(line);
  console.log(`line => ${JSON.stringify(config)}`);
  lr.pause();
  const octo = new Octokat(config);
  console.log('[FETCH DATA]');
  octo
    .user
    .fetch()
    .then((data) => {
      console.log('[FETCHED DATA]');
      console.log(JSON.stringify(data));
      lr.resume();
    }, (err) => {
      console.log('[FETCHING ERROR]');
      console.log(JSON.stringify(err));
      lr.resume();
    });
});

lr.on('end', function () {
	console.log('[DONE]');
});
