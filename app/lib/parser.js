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
  }
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

  if (attr.is_fk && attr.card.ref == "0..*" && attr.card.has == "1")
    attr.write = false;
  if (attr.type == "image[]" || attr.type == "file[]")
    attr.write = false;
}

function parseOverr(entity)
{
  let metas = entity.meta;
  if (metas == null) return;

  if (metas.read != null &&
    (metas.read == "true" || metas.read == "false")) {
    entity.read = metas.read == "true";
    delete metas.read;
  }

  if (metas.write != null &&
    (metas.write == "true" || metas.write == "false")) {
    entity.write = metas.write == "true";
    delete metas.write;
  }

  if (metas.empty != null &&
    (metas.empty == "true" || metas.empty == "false")) {
    entity.empty = metas.empty == "true";
    delete metas.empty;
  }

  if (metas.ref != null &&
    (metas.ref == "1" || metas.ref == "0..*")) {
    entity.card.ref = metas.ref;
    delete metas.ref;
  }

  if (metas.has != null &&
    (metas.has == "1" || metas.has == "0..*")) {
    entity.card.has = metas.has;
    delete metas.has;
  }

  if (metas.delete != null &&
    (metas.delete == "CASCADE" || metas.delete == "PROTECT" || metas.delete == "EMPTY")) {
    entity.card.delete = metas.delete;
    delete metas.delete;
  }

  if (metas.length != null) {
    entity.length = metas.length;
    delete metas.length;
  }

  if (metas.options != null) {
    entity.options = metas.options;
    delete metas.options;
  }

  if (metas.description != null) {
    entity.description = metas.description;
    delete metas.description;
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
  models = walk(parseOverr, parseOverr, models, relations);
  return models;
}

exports.parse = parse