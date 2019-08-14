let executor = require("./executor");
let parser = require("../app/lib/parser")
let ins = [
  "./inp/%s_parser_models.json",
  "./inp/%s_parser_relations.json"]
let out = "./out/%s_parser.json"
executor.exec(parser.parse, ins, out)
