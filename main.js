const generator = require("./app/generator")

function init()
{
  app.commands.register('seed:generate', generator.generate);
}

exports.init = init