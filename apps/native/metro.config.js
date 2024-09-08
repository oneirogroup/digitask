// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("node:path");

const workspaceRoot = resolve(__dirname, "../..");
const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [resolve(projectRoot, "node_modules"), resolve(workspaceRoot, "node_modules")];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
