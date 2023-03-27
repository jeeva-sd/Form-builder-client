const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "form-inc",
    projectName: "awsome-form-builder",
    webpackConfigEnv,
    argv,
     entry: "./src/index.ts",
     output: {
        path: "./dist",
        filename: "bundle.js",
      },
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};
