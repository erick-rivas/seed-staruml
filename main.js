const generator = require("./app/generator")
const updater = require("./app/updater")


function init()
{
  app.commands.register('seed:generate', generator.generate);
  app.commands.register('seed:update', updater.update);

}

exports.init = init