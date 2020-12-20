/* eslint-disable no-console */
const rollup = require("rollup");
const path = require("path");
const loadConfigFile = require("rollup/dist/loadConfigFile");

/**
 * Prints a list of modules which depend on `moduleName`, excluding the module itself.
 * This is useful if you need to see every module which depends on eg. "lodash".
 *
 * @param {*} modules - a list of modules from the build (build.modules or build.cache.modules)
 * @param {*} moduleName
 */
function printModulesWhichDependOn(modules, moduleName) {
  console.log(`MODULES WHICH DEPEND ON "${moduleName}":`);
  modules.forEach(({ id, dependencies }) => {
    if (
      id.indexOf(moduleName) === -1 &&
      dependencies.find((d) => d.indexOf(moduleName) > -1)
    ) {
      console.log(`  - ${id}`);
    }
  });
}

async function build() {
  const { options } = await loadConfigFile(
    path.resolve(__dirname, "rollup.config.js"),
    { format: "es" }
  );
  const bundle = await rollup.rollup(options[1]);
  const { modules } = bundle.cache;
  //   console.log(JSON.stringify(modules));
  printModulesWhichDependOn(
    modules,
    "C:/src/RNW/ef/crownforms-components/src/lib/components/admin/FormDesigner.tsx"
  );
}

build();
