const YAML = require('json2yaml')
const mapper = require("./mapper")
const parser = require("./parser")
const validator = require("./validator")

function getData()
{
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

function exportYaml(data, name, platform)
{
  const fs = require("fs");
  const filters = [{ name: "Text Files", extensions: ["yaml"] }];
  const selected = app.dialogs.showSaveDialog("Export in", "SeedManifest.yaml", filters);
  const res = {
    name: name,
    platform: platform,
    models: data
  }
  fs.writeFileSync(selected, YAML.stringify(res));
  app.toast.info("Exported in " + selected);
}

function selectPlatform(data, name)
{
  var options = [
    { text: "Django", value: "django" },
    { text: "React JS", value: "reactjs" }
  ]
  app.dialogs.showSelectRadioDialog("Select a platform.", options).then(function ({ buttonId, returnValue })
  {
    if (buttonId === 'ok')
      exportYaml(data, name, returnValue)
  })
}

function selectName(data)
{
  app.dialogs.showTextDialog("Select a project name.", app.project.getProject().name).then(function ({ buttonId, returnValue })
  {
    if (buttonId === 'ok')
      selectPlatform(data, returnValue)
  })
}

function build()
{
  try {
    const data = getData();
    if (data != null) selectName(data);
  } catch (error) { app.toast.error(error); }
}

function init()
{
  app.commands.register('seed:build-seed', build)
}

exports.init = init