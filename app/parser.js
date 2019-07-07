const c = require("./const")

function parseMeta(entity)
{
  let meta = entity.meta;
  let res = null
  if (meta != "") {
    try {
      let metaJson = ""
      let props = meta.split("\n");
      for (let p of props) {
        metaJson +=
          `"${String(p.split(":")[0]).trim()}":` +
          `"${String(p.split(":")[1]).trim()}",`
      }
      if (metaJson.endsWith(","))
        metaJson = metaJson.substring(0, metaJson.length - 1);
      res = JSON.parse(`{${metaJson}}`);
      for (let m in res) {
        if (res[m].startsWith("[")) {
          let mrss = res[m].substring(1, res[m].length - 1)
          let mrs = mrss.split(",")
          res[m] = []
          for (let mr of mrs)
            res[m].push(String(mr.trim()))
        }
      }
    } catch (e) { res = null; }
  } else res = {};
  entity.meta = res;
}


function parseFks(attr, relations)
{
  let aType = attr.type.replace("[]", "");
  if (relations[mName][aType]) {
    let c1 = relations[aType][mName]
    let c2 = relations[mName][aType]
    attr.is_fk = true;
    attr.card = {
      ref: c2,
      has: c1
    };
  } else {
    attr.is_fk = false;
    attr.card = {};
  }
}

function parseDefModel(model)
{
  model.read = true;
  model.write = true;
  model.empty = false;
  model.group = "";
}

function parseDefAttr(attr)
{
  //Def Value
  let aType = attr.type.replace("[]", "");
  let def = null;
  if (aType == "date") def = "now"
  if (aType == "boolean") def = "false"
  if (attr.meta.default != null) {
    def = attr.meta.default;
    delete attr.meta.default;
  }
  if (def != null)
    attr.default = def

  //Default props
  attr.read = true;
  attr.write = true;
  if (attr.is_fk && attr.card.ref == "0..*")
    attr.write = false;
  if (attr.type == "image[]" || attr.type == "file[]")
    attr.write = false;
}

function parseOverr(entity)
{
  let metas = entity.meta;
  if (metas == null) return;

  if (metas.read != null) {
    entity.read = metas.read == "true";
    delete metas.read;
  }

  if (metas.write != null) {
    entity.write = metas.write == "true";
    delete metas.write;
  }

  if (metas.empty != null) {
    entity.empty = metas.empty == "true";
    delete metas.empty;
  }
  
  if (metas.group != null) {
    entity.group = metas.group;
    delete metas.group;
  }

  if (metas.length != null) {
    entity.length = metas.length;
    delete metas.length;
  }

  if (metas.options != null) {
    entity.options = metas.options;
    delete metas.options;
  }

  if (metas.ref != null) {
    entity.card.ref = metas.ref;
    delete metas.ref;
  }

  if (metas.has != null) {
    entity.card.has = metas.has;
    delete metas.has;
  }

  return entity;
}


function walk(modelFunc, attrFunc, models, relations)
{
  for (let model of models) {
    mName = model.name;
    attrs = model.attrs;
    if (modelFunc != null) modelFunc(model, relations)
    for (let attr of attrs)
      if (attrFunc != null) attrFunc(attr, relations);
  }
  return models
}

function parse(models, relations)
{
  models = walk(parseMeta, parseMeta, models, relations);
  models = walk(null, parseFks, models, relations);
  models = walk(null, parseDefAttr, models, relations);
  models = walk(parseDefModel, null, models, relations);
  models = walk(parseOverr, parseOverr, models, relations);
  return models;
}

exports.parse = parse