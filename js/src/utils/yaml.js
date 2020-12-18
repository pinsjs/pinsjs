import yaml from 'js-yaml';

export function safeDump(data) {
  // remove undnefined which are unsupported by yaml
  data = JSON.parse(JSON.stringify(data));
  return yaml.safeDump(data);
}

export function safeLoad(text) {
  return yaml.safeLoad(text);
}