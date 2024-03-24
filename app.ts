#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imaging-edge-mobile";
import { getopt, opt } from "./src/settings/opt";
import { logger } from "./src/infrastructures/logger";
import { OptionMap } from "./src/interfaces/option-map";
import { auth } from "./src/services/auth";
import { GooglePhotosLibrary } from "./src/services/google-photos-library";
import { ImagingEdgeSrvc } from "./src/services/imaging-edge-srvc";
import Getopt from "node-getopt";

const main = async () => {
  const iem = new ImagingEdgeMobile(opt.options);
  const manager = new ImagingEdgeSrvc(iem);
  const photos = new GooglePhotosLibrary();
  const cmd: string = process.argv[2];
  const commands: {[cmd: string]: () => void | Promise<void> | Promise<string> | Getopt} = {
    import: () => manager.importFiles(opt.options.force as boolean),
    export: () => manager.exportFiles(opt.options.force as boolean),
    init: async () => await auth.init(),
    token: async () => await auth.token(),
    albums: async () => await photos.main(opt.options),
    help: () => getopt.showHelp(),
  }

  commands[cmd in commands ? cmd : 'help']();
};

main();
