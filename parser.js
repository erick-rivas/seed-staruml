function parseMeta(model, attr)
{
  let meta = attr.meta;
  if (meta != "") {
    try {
      let meta_json = ""
      let props = meta.split("\n");
      for (let p of props)
        meta_json += `"${p.split(":")[0].trim()}": "${p.split(":")[1].trim()}"`
      attr["meta"] = JSON.parse(`{${meta_json}}`);
    } catch (e) { attr["meta"] = null; }
  } else attr["meta"] = {};

}

function parseFks(model, attr, relations)
{
  let aType = attr.type.replace("[]", "");
  if (relations[mName][aType]) {
    let c1 = relations[aType][mName]
    let c2 = relations[mName][aType]
    attr["is_fk"] = true;
    attr["cardinality"] = c2 + "-" + c1;
  } else {
    attr["is_fk"] = false;
    attr["cardinality"] = "";
  }
}

function walk(func, models, relations)
{
  for (let model of models) {
    mName = model.name;
    attrs = model.attrs;
    for (let attr of attrs)
      func(model, attr, relations);
  }
  return models
}

function parse(models, relations)
{
  models = walk(parseMeta, models, relations)
  models = walk(parseFks, models, relations)
  return models
}



let models = '[  {    "name": "user",    "attrs": [      {        "name": "email",        "type": "string",        "meta": "length: 512"      },      {        "name": "password",        "type": "string",        "meta": "length: 256"      },      {        "name": "teams",        "type": "team[]",        "meta": ""      }    ],    "meta": ""  },  {    "name": "team",    "attrs": [      {        "name": "name",        "type": "string",        "meta": "length: name"      },      {        "name": "logo_url",        "type": "string",        "meta": ""      },      {        "name": "players",        "type": "player[]",        "meta": ""      }    ],    "meta": ""  },  {    "name": "player",    "attrs": [      {        "name": "name",        "type": "string",        "meta": ""      },      {        "name": "photo_url",        "type": "string",        "meta": ""      }    ],    "meta": ""  },  {    "name": "match",    "attrs": [      {        "name": "date",        "type": "date",        "meta": ""      },      {        "name": "local",        "type": "team",        "meta": ""      },      {        "name": "visitor",        "type": "team",        "meta": ""      },      {        "name": "scores",        "type": "score[]",        "meta": ""      }    ],    "meta": ""  },  {    "name": "score",    "attrs": [      {        "name": "min",        "type": "int",        "meta": ""      },      {        "name": "player",        "type": "player",        "meta": ""      }    ],    "meta": ""  }]'
let relations = '{  "user": {    "team": "0..*"  },  "team": {    "user": "0..*",    "player": "0..*",    "match": "0..*"  },  "player": {    "team": "1",    "score": "1"  },  "match": {    "team": "1",    "score": "0..*"  },  "score": {    "player": "1",    "match": "1"  }}';
let res = parse(JSON.parse(models), JSON.parse(relations));
console.log(JSON.stringify(res, null, 4));


exports.parse = parse