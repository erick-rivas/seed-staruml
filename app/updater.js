function update()
{
  const exec = require("child_process").execSync;
  let dir = __dirname.replace(/ /g, "\\ ");
  let command = `git -C ${dir}/../ pull`
  try {
    return app.toast.info(`<b>Go to debug > Reload to finish</b><br/>Message:<br/>${exec(command).toString().replace(/\n/g, "<br/>")}`);
  } catch (error) {
    return app.toast.error(error.message);
  }
}

exports.update = update;