import { isProd } from "./env";

function noop() {}
const debug = !isProd ? console.debug : noop;
const log = !isProd ? console.log : noop;
const info = !isProd ? console.info : noop;
const warn = !isProd ? console.warn : noop;
const error = !isProd ? console.error : noop;

export const logger = {
  debug,
  log,
  info,
  warn,
  error,
};
