#!/usr/bin/env ts-node
import { ImagingEdgeMobile } from "./src/entities/imaging-edge-mobile";
import { getopt, opt } from "./src/entities/opt";
import { logger } from "./src/infrastructures/logger";
import { OptionMap } from "./src/interfaces/option-map";
import { auth } from "./src/services/auth";
import { GooglePhotosLibrary } from "./src/services/google-photos-library";
import { ImagingEdgeSrvc } from "./src/services/imaging-edge-srvc";

const main = async () => {
  const iem = new ImagingEdgeMobile(opt.options as OptionMap);
  const manager = new ImagingEdgeSrvc(iem);
  const photos = new GooglePhotosLibrary();

  if (process.argv[2] == "import") {
    manager.importFiles(opt.options.force as boolean);
  } else if (process.argv[2] == "export") {
    manager.exportFiles(opt.options.force as boolean);
  } else if (process.argv[2] == "init") {
    await auth.init();
  } else if (process.argv[2] == "token") {
    auth.token();
  } else if (process.argv[2] == "albums") {
    const albums = await photos.albums();
    logger.info(JSON.stringify(albums));
  } else {
    getopt.showHelp();
  }
};

main();
