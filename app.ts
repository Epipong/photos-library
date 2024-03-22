#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imagingEdgeMobile";
import Getopt from "node-getopt";
import { OptionMap } from "./src/interfaces/parsedOption";
import { ImagingEdgeSrvc } from "./src/services/imagingEdgeSrvc";
import { logger } from "./src/infrastructures/logger";

const opt = Getopt.create([
  ["s", "source=ARG", "source location to import files"],
  ["t", "target=ARG", "target location to import files"],
  ["f", "force", "force the copy of the files if they already exist"],
  ["h", "help", "display this help"],
])
  .bindHelp()
  .parseSystem();

const app = () => {
  const iem = new ImagingEdgeMobile(opt.options as OptionMap);
  const manager = new ImagingEdgeSrvc(iem);
  manager.importFiles(opt.options.force as boolean);
};

app();
