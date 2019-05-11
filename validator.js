function validateAttrs(models)
{
  let validTypes = ["int", "string", "date", "boolean", "float", "enum", "text"]
  for (let model of models) {
    let mName = model.name;
    let attrs = model.attrs;
    if (model.meta == null)
      return `Invalid metadata model (${mName})<br/>TIP: Use format:<br/>name:value<br/>name:value`
    for (let attr of attrs) {
      if (attr.is_fk == false &&
        validTypes.indexOf(attr.type) == -1)
        return `Invalid type (${mName}.${attr.name}=${attr.type})<br/>Valid types: ${validTypes}`
      if (attr.meta == null)
        return `Invalid metadata (${mName}.${attr.name})<br/>TIP: Use format:<br/>name:value`
      if (attr.type == "string") {
        if (attr.meta.length == null)
          return `Include length meta in string(${mName}.${attr.name}) `
        if (Number.isNaN(parseInt(attr.meta.length)))
          return `Invalid length meta in string(${mName}.${attr.name}=${attr.meta.length}) `
      }
      if (attr.type == "enum") {
        if (!Array.isArray(attr.meta.options))
          return `Include options meta in enum (${mName}.${attr.name})<br/>Example:<br/>options:[b,c]`
      }
    }
  }
  return "";
}

function validateFks(models, relations)
{
  for (let r1 in relations) {
    for (let r2 in relations[r1]) {
      if (relations[r1][r2] == "1") {
        let has = false;
        for (let model of models) {
          let mName = model.name;
          let attrs = model.attrs;
          for (let attr of attrs) {
            let aType = attr.type.replace("[]", "");
            if (mName == r1 && aType == r2) {
              has = true
            }
          }
        }
        if (!has)
          return `Missing (${r1}.${r2}) attribute to complete ${relations[r2][r1]} relation `
      }
      if (relations[r1][r2] == "duplicated")
        return `Double relation definition (${r1}>${r2})<br/>TIP: 'Delete from model' extra relations`
    }
  }
  return ""
}



function validate(models, relations)
{
  let errors = "";
  errors = errors == "" ? validateAttrs(models) : errors;
  errors = errors == "" ? validateFks(models, relations) : errors;
  return errors;
}

exports.validate = validate