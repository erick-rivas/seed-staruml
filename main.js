const buildProject = require("./app/buildProject")
const generateManifest = require("./app/generateManifest")

function init()
{
  app.commands.register('seed:build', buildProject.build);
  app.commands.register('seed:manifest', generateManifest.generate);
}

exports.init = init