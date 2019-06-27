const fs = require("fs");
const yaml = require("json2yaml")
const mapper = require("./mapper")
const parser = require("./parser")
const validator = require("./validator")

function getData()
{
  const dModels = app.repository.select("@ERDEntity");
  const dRelations = app.repository.select("@ERDRelationship");
  const data = mapper.map(dModels, dRelations);
  const models = data.models;
  const relations = data.relations;
  const result = parser.parse(models, relations);
  const errors = validator.validate(result, relations);

  if (errors) app.toast.error(errors);
  return !errors ? result : null;
}

function createYaml(data, name, platform)
{
  const filters = [{ name: "Text Files", extensions: ["yaml"] }];
  const selected = app.dialogs.showSaveDialog("Export in", "SeedManifest.yaml", filters);
  const result = {
    name: name,
    platform: platform,
    models: data
  }
  fs.writeFileSync(selected, yaml.stringify(result));
  app.toast.info("Exported in " + selected);
}

function selectPlatform(data, name)
{
  var options = [
    { text: "Django", value: "django" },
    { text: "React JS", value: "reactjs" }
  ]
  app.dialogs.showSelectRadioDialog("Select a platform.", options)
    .then(function ({ buttonId, returnValue })
    {
      if (buttonId === 'ok')
        createYaml(data, name, returnValue)
    })
}

function selectName(data)
{
  app.dialogs.showTextDialog("Select a project name.", app.project.getProject().name)
    .then(function ({ buttonId, returnValue })
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

exports.build = build