module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig-jest.json",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
