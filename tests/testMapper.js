let executor = require("./executor");
let mapper = require("../app/mapper")
let ins = [
  "./inp/%s_mapper_models.json",
  "./inp/%s_mapper_relations.json"]
let out = "./out/%s_mapper.json"
executor.exec(mapper.map, ins, out)
