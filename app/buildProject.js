const exec = require("child_process").exec;
const fs = require("fs");

function runSeed(outDir)
{
  let dir = __dirname.replace(/ /g, "\\ ");
  let command = `${dir}/bin/seed -i ${outDir}`
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

function createJSON(data, name, platform)
{
  const filters = [{ name: "Text Files", extensions: ["json"] }];
  const outDir = app.dialogs.showSaveDialog("Export in", "SeedManifest.json", filters);
  const result = {
    name: name,
    platform: platform,
    models: data
  }
  fs.writeFileSync(outDir, JSON.stringify(result, null, 2));
  runSeed(outDir)
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
      if (buttonId === 'ok') {
        if (returnValue == null)
          return app.toast.error("Select a platform");
        createJSON(data, name, returnValue)
      }
    })
}

function build()
{
  try {
    const main = require("./lib/main")
    const data = main.getData();
    if (typeof data === 'string' || data instanceof String)
      return app.toast.error(data);
    selectPlatform(data);
  } catch (error) { app.toast.error(error); }
}

exports.build = build;