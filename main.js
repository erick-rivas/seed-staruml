function init()
{
  app.commands.register('seed:build-seed', run)
}

function run()
{
  try {
   let data = parseData();
    exportJSON(data);
  }
  catch (error) {
    app.toast.info(error);
  }
}
function parseData()
{
  const parser = require("./parser")
  const models = app.repository.select("@ERDEntity");
  const relationships = app.repository.select("@ERDRelationship");
  return parser.parse(models, relationships);
}

function exportJSON(data)
{
  const fs = require("fs");
  var filters = [
    { name: "Text Files", extensions: ["json"] }
  ];
  var selected = app.dialogs.showSaveDialog("Export in", "defs.json", filters);
  fs.writeFileSync(selected, JSON.stringify(data, null, 2));
  app.toast.info("Exported :)");
}

exports.init = init