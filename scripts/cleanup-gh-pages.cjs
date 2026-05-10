module.exports = function cleanupGhPages(git) {
  return git.rm([".gitignore", "pos", "server"]);
};

