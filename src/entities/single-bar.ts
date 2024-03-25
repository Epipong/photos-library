import cliProgress from "cli-progress";

const singleBar = new cliProgress.SingleBar(
  {
    format:
      " {bar} | {percentage}% | {filename} | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey,
);

export { singleBar };