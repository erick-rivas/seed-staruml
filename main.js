
const fs = require("fs");

let res = {};
let data = [];

function init() {
  app.commands.register('seed:export-seed', run)
}

function run() {
  try {
    extractData();
    exportJson();
  }
  catch (error) {
    app.toast.info(error);
  }
}

function extractData() {
  let project = app.project.getProject();
  let models = app.repository.select("@ERDEntity");

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

    data.push({
      model: modelName,
      attributes: attributes,
      relations: []
    });
  }

  let relationships = app.repository.select("@ERDRelationship");

  //Relations
  for (let rels of relationships) {
    let model1 = stdName(rels.end1.reference.name);
    let model2 = stdName(rels.end2.reference.name);
    let card1 = rels.end1.cardinality;
    let card2 = rels.end2.cardinality;
    let pos1 = getModelPos(data, model1);
    let pos2 = getModelPos(data, model2);
    data[pos1].relations.push({
      model: model2,
      cardinality: card2
    });
    data[pos2].relations.push({
      model: model1,
      cardinality: card1
    });
  }

  function getModelPos(data, model) {
    for (let i = 0; i < data.length; i++)
      if (data[i].model === model) return i;
    return -1;
  }

  res["project_name"] = project.name;
  res["data"] = data;
}

function stdName(name) {
  return name.toLowerCase();
}

function exportJson() {
  var filters = [
    { name: "Text Files", extensions: ["json"] }
  ];
  var selected = app.dialogs.showSaveDialog("Export in", "defs.json", filters);
  fs.writeFileSync(selected, JSON.stringify(res, null, 2));
  app.toast.info("Exported :)");
}

exports.init = init