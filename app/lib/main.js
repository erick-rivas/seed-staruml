const mapper = require("./mapper")
const parser = require("./parser")
const validator = require("./validator")

function getData()
{
  const dModels = app.repository.select("@ERDEntity");
  const dRelations = app.repository.select("@ERDRelationship");
  const data = mapper.map(dModels, dRelations);
  const models = data.models;
  const relations = data.relations;
  const result = parser.parse(models, relations);
  const errors = validator.validate(result, relations);
  return !errors ? result : errors;
}

exports.getData = getData;