import Getopt from "node-getopt";

const getopt = new Getopt([
  ["s", "source=PATH", "source location to import files"],
  ["t", "target=PATH", "target location to import files"],
  ["f", "force", "force the copy of the files if they already exist"],
  ["h", "help", "display this help"],
]).bindHelp();

const opt = getopt.parse(process.argv.slice(3));

getopt.setHelp(getopt.getHelp().replace("app.ts", "app.ts [COMMAND]"));

export { opt, getopt };
