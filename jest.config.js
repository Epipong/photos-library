module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["."],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  testEnvironment: "node",
};
