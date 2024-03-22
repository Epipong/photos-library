#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imagingEdgeMobile";
import { getopt, opt } from "./src/entities/opt";
import { OptionMap } from "./src/interfaces/parsedOption";
import { ImagingEdgeSrvc } from "./src/services/imagingEdgeSrvc";

const app = () => {
  const iem = new ImagingEdgeMobile(opt.options as OptionMap);
  const manager = new ImagingEdgeSrvc(iem);
  if (process.argv[2] == "import") {
    manager.importFiles(opt.options.force as boolean);
  } else if (process.argv[2] == "export") {
    manager.exportFiles(opt.options.force as boolean);
  } else {
    getopt.showHelp();
  }
};

app();
