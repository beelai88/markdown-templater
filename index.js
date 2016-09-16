const NodeGit = require('nodegit');

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));

const basePath = process.cwd() + '/.tmp';
const dt = Date.now();

const emptyTemp = function() {};
const localRepoPath = basePath + '/' + dt;

const repo = process.argv[2];
const makeFileLink = (path, commit) => {
  const fileparts = path.split('/');
  const filename = fileparts[fileparts.length-1];
  return `### [${filename}](${repo}/tree/${commit}/${path})`
}

NodeGit.Clone.clone(repo, localRepoPath)
.then(() => {
  return NodeGit.Repository.open(localRepoPath);
})
.then(repo => {
  return repo.getBranchCommit("master");
})
.then(commit => {
  const id = commit.id();
  const models = fs.readdirSync(localRepoPath + '/server/db/models');
  const routes = fs.readdirSync(localRepoPath + '/server/app/routes');

  console.log(`# Backend Code Review

## models
${models.map(file => makeFileLink('server/db/models/' + file, commit)).join('\n')}

## routes
${routes.map(file => makeFileLink('server/app/routes/' + file, commit)).join('\n')}
  `);

});