import colors from "ansi-colors";

const preset = {
  format: `${colors.green(' {bar}')} {percentage}% | {filename} | ETA: {eta}s | {value}/{total}`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591'
};

export { preset };