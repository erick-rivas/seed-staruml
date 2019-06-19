const main = require("./app/app")

function init()
{
  app.commands.register('seed:build-seed', main.build)
}

exports.init = init