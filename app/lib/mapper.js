function getModels(dModels)
{
  let models = []
  for (let model of dModels) {
    let modelName = stdName(model.name);
    let modelMeta = model.documentation.trim();
    let attrs = [];
    for (let attr of model.columns) {
      let name = stdName(attr.name);
      let type = stdName(attr.type);
      let meta = attr.documentation.trim();
      attrs.push({
        name: name,
        type: type,
        meta: meta
      });
    }
    models.push({
      name: modelName,
      attrs: attrs,
      meta: modelMeta
    })
  }
  return models;
}

function getRelations(dModels, dRelations)
{
  let relations = {}
  for (let model of dModels) {
    let modelName = stdName(model.name);
    relations[modelName] = {}
  }
  for (let rels of dRelations) {
    let model1 = stdName(rels.end1.reference.name);
    let model2 = stdName(rels.end2.reference.name);
    let card1 = rels.end1.cardinality;
    let card2 = rels.end2.cardinality;
    if (relations[model1][model2] == null) {
      relations[model1][model2] = card2;
      relations[model2][model1] = card1;
    }
    else {
      relations[model1][model2] = "duplicated";
      relations[model2][model1] = "duplicated";
    }
  }
  return relations;
}

function stdName(name)
{
  return name.toLowerCase().trim();
}

function map(dModels, dRelations)
{
  const models = getModels(dModels);
  const relations = getRelations(dModels, dRelations);
  return {
    models: models,
    relations: relations
  };
}

exports.map = map