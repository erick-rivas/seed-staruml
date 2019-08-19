const exec = require("child_process").exec;
const fs = require("fs");

function runSeed(outDir, exportModule, exportModel)
{
  let dir = __dirname.replace(/ /g, "\\ ");
  let command = `${dir}/bin/seed export -i ${outDir} -m ${exportModule}:${exportModel}`
  exec(command, (error, stdout) =>
  {
    if (error) {
      app.toast.error(error);
      return;
    }
    let lines = stdout.split("\n");
    app.toast.info(lines.slice(0, lines.length - 4).join("<br/>"));
    app.toast.info(lines[lines.length - 3]);
  });
}

function createJSON(data, platform, exportModule, exportModel)
{
  const filters = [{ name: "Text Files", extensions: ["json"] }];
  const outDir = app.dialogs.showSaveDialog("Export in", "SeedManifest.json", filters);
  const result = {
    platform: platform,
    models: data
  }
  fs.writeFileSync(outDir, JSON.stringify(result, null, 2));
  runSeed(outDir, exportModule, exportModel)
}

function selectModel(data, platform, exportModule)
{
  function cap(str) 
  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  var options = [{ text: "All models", value: "__all__" }];
  for (let model of data)
    options.push({
      text: cap(model.name), value: model.name
    })
  app.dialogs.showSelectRadioDialog("Select a model.", options)
    .then(function ({ buttonId, returnValue })
    {
      if (buttonId === 'ok') {
        if (returnValue == null) {
          selectModel(data, platform, exportModule);
          return app.toast.error("Select a model");
        }
        createJSON(data, platform, exportModule, returnValue)
      }
    })
}

function selectModule(data, platform)
{
  var options = [];
  if (platform == "django")
    options = [
      { text: "Views", value: "views" },
      { text: "Models", value: "models" },
      { text: "Serializers", value: "serializers" }
    ]
  if (platform == "reactjs")
    options = [
      { text: "Actions", value: "actions" },
      { text: "Components (templates)", value: "components" }
    ]

  app.dialogs.showSelectRadioDialog("Select a module.", options)
    .then(function ({ buttonId, returnValue })
    {
      if (buttonId === 'ok') {
        if (returnValue == null) {
          selectModule(data, platform);
          return app.toast.error("Select a module");
        }
        selectModel(data, platform, returnValue)
      }
    })
}

function selectPlatform(data)
{
  var options = [
    { text: "Django", value: "django" },
    { text: "React JS", value: "reactjs" }
  ]
  app.dialogs.showSelectRadioDialog("Select a platform.", options)
    .then(function ({ buttonId, returnValue })
    {
      if (buttonId === 'ok') {
        if (returnValue == null) {
          selectPlatform(data);
          return app.toast.error("Select a platform");
        }
        selectModule(data, returnValue)
      }
    })
}

function exp()
{
  try {
    const main = require("./lib/main")
    const data = main.getData();
    if (typeof data === 'string' || data instanceof String)
      return app.toast.error(data);
    selectPlatform(data);
  } catch (error) { app.toast.error(error); }
}

exports.exp = exp;