import yaml from 'js-yaml';
import callbacks from '../host/callbacks';
import { pinLog } from '../log';

export function safeDump(data) {
  if (callbacks.has('yamlSafeDump')) {
    // data is passed as json to avoid unsupported object serialization to python
    return callbacks.get('yamlSafeDump')(JSON.stringify(data));
  }

  // remove undnefineds which are unsupported by jsyaml but cause issues in python
  data = JSON.parse(JSON.stringify(data));

  return yaml.safeDump(data);
}

export function safeLoad(text) {
  if (callbacks.has('yamlSafeLoad')) {
    return callbacks.get('yamlSafeLoad')(text);
  }

  return yaml.safeLoad(text);
}