const fs = require("fs");

function createJSON(data, platform)
{
  const filters = [{ name: "Text Files", extensions: ["json"] }];
  const selected = app.dialogs.showSaveDialog("Export in", "SeedManifest.json", filters);
  const result = {
    platform: platform,
    models: data
  }
  fs.writeFileSync(selected, JSON.stringify(result, null, 2));
  app.toast.info("Exported in " + selected);
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
        createJSON(data, returnValue)
      }
    })
}

function generate()
{
  try {
    const main = require("./lib/main")
    const data = main.getData();
    if (typeof data === 'string' || data instanceof String)
      return app.toast.error(data);
    selectPlatform(data);
  } catch (error) { app.toast.error(error); }
}

exports.generate = generate;