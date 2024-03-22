#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imagingEdgeMobile";
import Getopt from "node-getopt";
import { OptionMap } from "./src/interfaces/parsedOption";
import { ImagingEdgeSrvc } from "./src/services/imagingEdgeSrvc";

const opt = Getopt.create([
  ["s", "source=ARG", "source location to import files"],
  ["t", "target=ARG", "target location to import files"],
  ["h", "help", "display this help"],
])
  .bindHelp()
  .parseSystem();

const app = () => {
  const iem = new ImagingEdgeMobile(opt.options as OptionMap);
  const manager = new ImagingEdgeSrvc(iem);

  manager.importFiles();
};

app();
