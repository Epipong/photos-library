import cliProgress from "cli-progress";
import { preset } from "../settings/preset";

const singleBar = new cliProgress.SingleBar({
  barsize: 65
}, preset);

export { singleBar };