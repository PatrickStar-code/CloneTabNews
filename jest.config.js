const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
};

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  // Forçamos a transformação do node-pg-migrate
  // Removendo o padrão padrão que ignora todos os node_modules
  config.transformIgnorePatterns = [
    "/node_modules/(?!(node-pg-migrate|glob)/)",
  ];

  return config;
};
