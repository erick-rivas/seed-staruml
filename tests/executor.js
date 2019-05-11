function exec(f, inp, out)
{
  var fs = require("fs");
  let testI = 1;
  let passes = 0;

  
  while (true) {

    let ins = [];
    for (let i of inp) {
      i = i.replace("\%s", testI);
      ins.push(JSON.parse(fs.readFileSync(i)));
    }
    
    let o = out.replace("\%s", testI)
    let exp = JSON.parse(fs.readFileSync(o))

    try {
      let act = f.apply(this, ins)
      if (objectEquals(exp, act)) passes++;
    } catch (e) {
      console.log(e);
    }
    testI++
    if (!fs.existsSync(out.replace("\%s", testI)))
      break;
  }

  if (passes == testI - 1)
    console.log(`DONE (${passes}/${passes})`);
  else console.log(`FAILED (${passes}/${testI - 1})`);
}

function objectEquals(x, y)
{
  if (x instanceof Function) {
    if (y instanceof Function) {
      return x.toString() === y.toString();
    }
    return false;
  }
  if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
  if (x === y || x.valueOf() === y.valueOf()) { return true; }
  if (x instanceof Date) { return false; }
  if (y instanceof Date) { return false; }
  if (!(x instanceof Object)) { return false; }
  if (!(y instanceof Object)) { return false; }
  var p = Object.keys(x);
  return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ?
    p.every(function (i) { return objectEquals(x[i], y[i]); }) : false;
}

exports.exec = exec;

