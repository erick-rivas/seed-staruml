function parseMetas(models)
{
  for (let model of models) {
    mMeta = model.meta;
    attrs = model.attrs;
    model.meta = parseMeta(mMeta);
    for (let attr of attrs) {
      aMeta = attr.meta;
      attr.meta = parseMeta(aMeta);
    }
  }
  return models;
}

function parseMeta(meta)
{
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
  return res;
}

function parseOverride(models)
{
  for (let model of models) {
    mMeta = model.meta;
    attrs = model.attrs;
    model = parseOverr(model, mMeta);
    for (let attr of attrs) {
      aMeta = attr.meta;
      attr = parseOverr(attr, aMeta);
    }
  }
  return models;
}



function parseOverr(entity, metas)
{
  entity.read = true;
  entity.write = true;
  entity.depth = 1

  if (metas == null) return entity;

  if (metas.depth != null) {
    if (!Number.isNaN(parseInt(metas.depth)))
      entity.depth = metas.depth
    delete metas.depth
  }
  if (metas.read != null) {
    entity.read = metas.read == "true";
    delete metas.read;
  }

  if (metas.write != null) {
    entity.write = metas.write == "true";
    delete metas.write;
  }

  if (metas.card_ref != null) {
    entity.card.ref = metas.card_ref;
    delete metas.card_ref;
  }

  if (metas.card_has != null) {
    entity.card.has = metas.card_has;
    delete metas.card_has;
  }

  return entity;
}

function parseFks(model, attr, relations)
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
  models = parseMetas(models);
  models = walk(parseFks, models, relations);
  models = parseOverride(models);
  return models;
}

exports.parse = parse