function validateAttrs(models)
{
  let validTypes = ["int", "string", "date", "boolean", "float", "enum"]
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
      if (attr.type == "enum"){
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

let models = '[  {    "name": "user",    "attrs": [      {        "name": "email",        "type": "string",        "meta": {          "length": "512"        },        "is_fk": false,        "cardinality": ""      },      {        "name": "password",        "type": "string",        "meta": {          "length": "256"        },        "is_fk": false,        "cardinality": ""      },      {        "name": "teams",        "type": "team[]",        "meta": "puta",        "is_fk": true,        "cardinality": "0..*-0..*"      }    ],    "meta": ""  },  {    "name": "team",    "attrs": [      {        "name": "name",        "type": "string",        "meta": {          "length": "123"        },        "is_fk": false,        "cardinality": ""      },      {        "name": "logo_url",        "type": "string",        "meta": {},        "is_fk": false,        "cardinality": ""      },      {        "name": "players",        "type": "player[]",        "meta": {},        "is_fk": true,        "cardinality": "1-0..*"      }    ],    "meta": ""  },  {    "name": "player",    "attrs": [      {        "name": "name",        "type": "string",        "meta": {},        "is_fk": false,        "cardinality": ""      },      {        "name": "photo_url",        "type": "string",        "meta": {},        "is_fk": false,        "cardinality": ""      }    ],    "meta": ""  },  {    "name": "match",    "attrs": [      {        "name": "date",        "type": "date",        "meta": {},        "is_fk": false,        "cardinality": ""      },      {        "name": "local",        "type": "team",        "meta": {},        "is_fk": true,        "cardinality": "0..*-1"      },      {        "name": "visitor",        "type": "team",        "meta": {},        "is_fk": true,        "cardinality": "0..*-1"      },      {        "name": "scores",        "type": "score[]",        "meta": {},        "is_fk": true,        "cardinality": "1-0..*"      }    ],    "meta": ""  },  {    "name": "score",    "attrs": [      {        "name": "min",        "type": "int",        "meta": {},        "is_fk": false,        "cardinality": ""      },      {        "name": "player",        "type": "player",        "meta": {},        "is_fk": true,        "cardinality": "0..*-1"      }    ],    "meta": ""  }]'
let relations = '{  "user": {    "team": "0..*"  },  "team": {    "user": "0..*",    "player": "0..*",    "match": "0..*"  },  "player": {    "team": "1",    "score": "0..*"  },  "match": {    "team": "1",    "score": "0..*"  },  "score": {    "player": "1",    "match": "1"  }}'
let res = validate(JSON.parse(models), JSON.parse(relations));
console.log(JSON.stringify(res, null, 4));

exports.validate = validate