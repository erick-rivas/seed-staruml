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

function parseDefaults(models)
{
  for (let model of models) {
    mMeta = model.meta;
    attrs = model.attrs;
    model = parseDefault(model, mMeta);
    for (let attr of attrs) {
      aMeta = attr.meta;
      attr = parseDefault(attr, aMeta);
    }
  }
  return models;
}

function parseDefault(entity, metas)
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
  if (metas.read_only != null) {
    if (metas.read_only == "true")
      entity.write = false;
    delete metas.read_only;
  }
  if (metas.write_only != null) {
    if (metas.write_only == "true")
      entity.write = false;
    delete metas.write_only;
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
    attr.cardinality = c2 + "-" + c1;
  } else {
    attr.is_fk = false;
    attr.cardinality = "";
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
  models = parseDefaults(models);
  models = walk(parseFks, models, relations);
  console.log(JSON.stringify(models));
  return models;
}

exports.parse = parse