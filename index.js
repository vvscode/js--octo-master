const Octokat = require('octokat');
const LineByLineReader = require('line-by-line');

const lr = new LineByLineReader('users.db');
const validLines = [];

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
  lr.pause();
  const octo = new Octokat(config);
  octo
    .user
    .fetch()
    .then((data) => {
      console.log(`[FETCHED DATA]: ${data.login} with ${data.publicRepos} repos`);
      validLines.push(line);

      return octo.me
        .starred("REPO_USER/REPO_NAME")
        .add()
        .then(() => {
          console.log('Repo starred');
          lr.resume()
        })
        .catch((err) => {
          console.log('[Starred error]');
          console.log(JSON.stringify(err));
        });
    })
    .catch((err) => {
      console.log('[ERROR]');
      console.log(JSON.stringify(err));
      lr.resume();
    })
});

lr.on('end', function () {
	console.log('[DONE]');
  console.log(`[VALID TOKENS]\n${validLines.join('\n')}`);
});
