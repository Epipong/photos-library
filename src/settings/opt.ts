import Getopt from "node-getopt";

const getopt = new Getopt([
  ["s", "source=PATH", "source location to import files"],
  ["t", "target=PATH", "target location to import files"],
  ["f", "force", "force the copy of the files if they already exist"],
  ["t", "title=ARG", "title of the album"],
  ["h", "help", "display this help"],
]).bindHelp();

const opt = getopt.parse(process.argv.slice(3));

getopt.setHelp("Usage:\n\
  ts-node app.ts [COMMAND] [OPTION]...\n\
\n\
Commands:\n\
  import,           import files\n\
  export,           export files\n\
  init,             log in for Google Photos API\n\
  token,            get the token the Google Photos API\n\
  albums,           get the albums collection\n\
\n\
Options:\n\
  -s, --source=PATH source location to import files\n\
  -t, --target=PATH target location to import files\n\
  -f, --force       force the copy of the files if they already exist\n\
  -t, --title=ARG   title of the album\n\
  -h, --help        display this help\n\
");

export { opt, getopt };
