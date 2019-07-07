const c = require("./const");

function validateAttrs(models)
{
  validTypes = c.nativeTypes;

  for (let model of models) {
    let mName = model.name;
    let attrs = model.attrs;
    if (model.meta == null)
      return `Invalid model metadata<br/><b>${mName}</b><br/>Use format: <i>name:value</i>`
    if (Object.keys(model.meta).length > 0)
      return `Invalid model metadata (${Object.keys(attr.meta)[0]})<br/><b>${mName}</b><br/><i>Check the valid keys in the README</i>`
    else delete model.meta

    for (let attr of attrs) {

      if (attr.is_fk == false &&
        validTypes.indexOf(attr.type) == -1)
        return `Invalid type or missing relation<br/><b>${mName} - ${attr.name}</b> (${attr.type})<br/>Valid types: <i>${validTypes}</i>`

      if (attr.meta == null)
        return `Invalid metadata<br/><b>${mName} - ${attr.name}</b><br/>Use format: <i>name:value</i>`
      if (Object.keys(attr.meta).length > 0)
        return `Invalid metadata (${Object.keys(attr.meta)[0]})<br/><b>${mName} - ${attr.name}</b><br/><i>Check the valid keys in the README</i>`
      else delete attr.meta

      if (attr.type == "string") {
        if (attr.length == null)
          return `Include 'length' meta in string<br/><b>${mName} - ${attr.name}</b>`
        if (Number.isNaN(parseInt(attr.length)))
          return `Invalid 'length' meta in string<br/><b>${mName} - ${attr.name}</b><br/>Example: <i>length: 128</i>`
      }

      if (attr.type == "enum") {
        if (!Array.isArray(attr.options))
          return `Include 'options' meta in enum<br/><b>${mName} - ${attr.name}</b><br/>Example: <i>options:[b,c]</i>`
      }

      if (attr.is_fk == true && attr.card.ref == "0..*"
        && !attr.type.endsWith("[]"))
        return `Include '[]' in 0..* to any attributes<br/><b>${mName} - ${attr.name}</b><br/>Example: <i>Player[]</i>`
    }
  }
  return "";
}

function validateFks(models, relations)
{

  function cap(str) 
  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function tab(num)
  {
    return '&nbsp;'.repeat(num);
  }

  for (let r1 in relations) {
    for (let r2 in relations[r1]) {
      if (relations[r1][r2] == "1" && relations[r2][r1] == "0..*") {
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
        if (!has) return `Missing attr to complete relation<br/><b>${cap(r1)} > ${cap(r2)}</b><br/>Fix: <i>Add '${cap(r2)}' attr to '${cap(r1)}' model</i> </i>`
      }

      if (
        (relations[r1][r2] == "1" && relations[r2][r1] == "1") ||
        (relations[r1][r2] == "0..*" && relations[r2][r1] == "0..*")) {
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
        for (let model of models) {
          let mName = model.name;
          let attrs = model.attrs;
          for (let attr of attrs) {
            let aType = attr.type.replace("[]", "");
            if (mName == r2 && aType == r1) {
              has = true
            }
          }
        }
        if (!has) {
          if (relations[r2][r1] == "1")
            return `Missing at least one attr to complete relation<br/><b>${cap(r1)} > ${cap(r2)}</b><br/>Fix: <i>Add '${cap(r2)}' attr to '${cap(r1)}' model<br/>${tab(12)}or '${cap(r1)}' attr to '${cap(r2)}' model</i>`
          else
            return `Missing at least one attr to complete relation<br/><b>${cap(r1)} > ${cap(r2)}</b><br/>Fix: <i>Add '${cap(r2)}[]' attr to '${cap(r1)}' model<br/>${tab(12)}or '${cap(r1)}[]' attr to '${cap(r2)}' model</i>`
        }
      }



      if (relations[r1][r2] == "duplicated")
        return `Double relation definition<br/><b>${cap(r1)} > ${cap(r2)}</b><br/>Fix: <i>'Delete from model' extra relations</i><br/><i>To set different cardinalities use fk override in metadata (see README)</i>`
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