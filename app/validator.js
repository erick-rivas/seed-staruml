const c = require("./const");

function validateAttrs(models)
{
  validViews = c.readOnlyViews.concat(c.writeOnlyViews);
  validTypes = c.nativeTypes;

  for (let model of models) {
    let mName = model.name;
    let attrs = model.attrs;
    if (model.meta == null)
      return `Invalid model metadata<br/>Model: ${mName}<br/>TIP: Use format - name:value`

    if (model.views != null) {
      for (let view of model.views)
        if (validViews.indexOf(view) == -1)
          return `Invalid view<br/>Model: ${mName}<br/>View: ${view}<br/>TIP: Valid views - ${validViews}`
    } else return `Invalid view group<br/>Model: ${mName}<br/>ViewGroup: ${view}<br/>TIP: Valid viewGroups - 'all', 'read_only', 'write_only'`

    for (let attr of attrs) {

      if (attr.is_fk == false &&
        validTypes.indexOf(attr.type) == -1)
        return `Invalid type or missing relation<br/>Model: ${mName}<br/>Attribute: ${attr.name}<br/>Type: ${attr.type}<br/>TIP: Valid types - ${validTypes}`

      if (attr.meta == null)
        return `Invalid metadata<br/>Model: ${mName}<br/>Attribute: ${attr.name}<br/>TIP: Use format - name:value`

      if (attr.type == "string") {
        if (attr.meta.length == null)
          return `Include 'length' meta in string<br/>Model: ${mName}<br/>Attribute: ${attr.name}`
        if (Number.isNaN(parseInt(attr.meta.length)))
          return `Invalid 'length' meta in string<br/>Model: ${mName}<br/>Attribute: ${attr.name}<br/>TIP: Example - length: 128"`
      }

      if (attr.type == "enum") {
        if (!Array.isArray(attr.meta.options))
          return `Include 'options' meta in enum<br/>Model: ${mName}<br/>Attribute: ${attr.name}<br/>Example - options:[b,c]`
      }

      if (attr.is_fk == true && attr.card.ref == "0..*"
        && !attr.type.endsWith("[]"))
        return `Include '[]' in 0..* to any attributes<br/>Model: ${mName}<br/>Attribute: ${attr.name}<br/>TIP: Example - Player[]`
    }
  }
  return "";
}

function validateFks(models, relations)
{
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
        if (!has) return `Missing (${r1} - ${r2}) attribute to complete ${relations[r2][r1]} relation <br/>TIP: Add reference attribute<br/>Example - player:Player`
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
            return `Missing at least one (${r1} - ${r2}) attribute to complete ${relations[r2][r1]} relation<br/>TIP: Add reference attribute<br/>Example - player:Player`
          else
            return `Missing at least one (${r1} - ${r2}) attribute to complete ${relations[r2][r1]} relation<br/>TIP: Add reference attribute<br/>Example - players:Player[]`
        }
      }



      if (relations[r1][r2] == "duplicated")
        return `Double relation definition (${r1} - ${r2})<br/>TIP: 'Delete from model' extra relations`
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