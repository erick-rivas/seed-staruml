const buildProject = require("./app/buildProject")
const exportModules = require("./app/exportModules")
const generateManifest = require("./app/generateManifest")

function init()
{
  app.commands.register('seed:build', buildProject.build);
  app.commands.register('seed:export', exportModules.exp);
  app.commands.register('seed:manifest', generateManifest.generate);
}

exports.init = init