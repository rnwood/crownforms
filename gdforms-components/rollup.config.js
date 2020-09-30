import { DEFAULT_EXTENSIONS } from "@babel/core";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import { terser } from "rollup-plugin-terser";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

import pkg from "./package.json";

const plugins = (externalize) => {
  const result = [
    postcss({
      plugins: [],
      minimize: true,
      sourceMap: true,
    }),
  ];
  if (externalize) {
    result.push(
      external({
        includeDependencies: true,
      })
    );
  }

  result.push(
    ...[
    esbuild({
        target: "esnext",
        include: ["*.js+(|x)", "**/*.js+(|x)"],
        exclude: [
          "coverage",
          "config",
          "dist",
          "node_modules/**",
          "*.test.{js+(|x), ts+(|x)}",
          "**/*.test.{js+(|x), ts+(|x)}",
        ],
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        sourceMap: true

        
      }),
      babel({
        babelrc: true,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        exclude: "node_modules/**",
        babelHelpers: "runtime",
        sourceMaps: true

      }),
      url(),
      svgr(),
      resolve(),
      commonjs()
    ]
  );

  if (process.env.NODE_ENV === "production") {
    result.push(terser());
  }

  return result;
};

const configs = [
  {
    input: "src/lib/index.ts",
    output: [
      {
        file: pkg.types,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [dts()],
  },
  {
    input: "src/lib/index.ts",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: plugins(true),
  },
  {
    input: "src/lib/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: plugins(true),
  },
];

if (process.env.NODE_ENV === "production" && process.env.FASTBUILD === "") {
  configs.push(
    ...[
      {
        input: "src/lib/renderer/index.ts",
        output: [
          {
            file: pkg.renderer,
            format: "cjs",
            sourcemap: true,
          },
        ],
        plugins: plugins(true),
      },
      {
        input: "src/lib/designer/index.ts",
        output: [
          {
            file: pkg.designer,
            format: "cjs",
            sourcemap:true,
          },
        ],
        plugins: plugins(true),
      },
      {
        context: "window",
        input: "src/lib/noreact.tsx",
        output: [
          {
            name: "efforms",
            file: "dist/browser/renderer.js",
            format: "umd",
            sourcemap: true,
          },
        ],
        plugins: [
          ...plugins(false),
          injectProcessEnv(
            { NODE_ENV: "production" },
            { include: "node_modules/**" }
          ),
        ],
      },
      {
        context: "window",
        input: "src/lib/noreact-designer.tsx",
        output: [
          {
            name: "efformsdesigner",
            file: "dist/browser/designer.js",
            format: "umd",
            sourcemap: true,
          },
        ],
        plugins: [
          ...plugins(false),
          injectProcessEnv(
            { NODE_ENV: "production" },
            { include: "node_modules/**" }
          ),
        ],
      },
    ]
  );
}

export default configs;
