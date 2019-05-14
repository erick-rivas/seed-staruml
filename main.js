function getData()
{
  const mapper = require("./mapper")
  const parser = require("./parser")
  const validator = require("./validator")

  const dModels = app.repository.select("@ERDEntity");
  const dRelations = app.repository.select("@ERDRelationship");
  const data = mapper.map(dModels, dRelations);
  const models = data[0];
  const relations = data[1];
  const res = parser.parse(models, relations);
  const errors = validator.validate(res, relations);

  if (errors) app.toast.error(errors);
  return !errors ? res : null;
}

function exportJSON(data)
{
  const fs = require("fs");
  var filters = [{ name: "Text Files", extensions: ["json"] }];
  var selected = app.dialogs.showSaveDialog("Export in", "models.json", filters);
  fs.writeFileSync(selected, JSON.stringify(data, null, 2));
  app.toast.info("Exported :)");
}

function build()
{
  try {
    let data = getData();
    if (data != null) exportJSON(data);
  } catch (error) { app.toast.error(error); }
}

function init()
{
  app.commands.register('seed:build-seed', build)
}

exports.init = init