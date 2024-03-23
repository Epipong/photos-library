#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imagingEdgeMobile";
import { getopt, opt } from "./src/entities/opt";
import { logger } from "./src/infrastructures/logger";
import { OptionMap } from "./src/interfaces/parsedOption";
import { auth } from "./src/services/auth";
import { ImagingEdgeSrvc } from "./src/services/imagingEdgeSrvc";
import { config } from "./src/settings/config";

const main = async () => {
  const iem = new ImagingEdgeMobile(opt.options as OptionMap);
  const manager = new ImagingEdgeSrvc(iem);
  if (process.argv[2] == "import") {
    manager.importFiles(opt.options.force as boolean);
  } else if (process.argv[2] == "export") {
    manager.exportFiles(opt.options.force as boolean);
  } else if (process.argv[2] == "init") {
    auth.init();
  } else {
    getopt.showHelp();
  }
};

main();
