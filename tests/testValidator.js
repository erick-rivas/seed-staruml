let executor = require("./executor");
let validator = require("../app/lib/validator")
let ins = [
  "./inp/%s_validator_models.json",
  "./inp/%s_validator_relations.json"]
let out = "./out/%s_validator.json"
executor.exec((models, relations) =>
{
  res = validator.validate(models, relations)
  return {
    res: res == "" || res == null ? "-" : res 
  }
}, ins, out)
