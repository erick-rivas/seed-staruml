
function parse(models, relationships)
{
  let res = [];
  //Attributes
  for (let model of models) {

    let modelName = stdName(model.name);
    let attributes = [];
    for (let attr of model.columns) {
      let name = stdName(attr.name);
      let type = stdName(attr.type);
      attributes.push({
        name: name,
        type: type
      });
    }

    res.push({
      model: modelName,
      attributes: attributes,
      relations: []
    });
  }


  //Relations
  for (let rels of relationships) {
    let model1 = stdName(rels.end1.reference.name);
    let model2 = stdName(rels.end2.reference.name);
    let card1 = rels.end1.cardinality;
    let card2 = rels.end2.cardinality;
    let pos1 = getModelPos(res, model1);
    let pos2 = getModelPos(res, model2);
    res[pos1].relations.push({
      model: model2,
      cardinality: card2
    });
    res[pos2].relations.push({
      model: model1,
      cardinality: card1
    });
  }

  function getModelPos(data, model)
  {
    for (let i = 0; i < data.length; i++)
      if (data[i].model === model) return i;
    return -1;
  }

  return res;
}

function stdName(name)
{
  return name.toLowerCase();
}

exports.parse = parse