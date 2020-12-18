import yaml from 'js-yaml';
import callbacks from '../host/callbacks';
import { pinLog } from '../log';

export function safeDump(data) {
  const yamlSafeDump = callbacks.get('yamlSafeDump');
  if (yamlSafeDump) {
    // data is passed as json to avoid unsupported object serialization to python
    return yamlSafeDump(JSON.stringify(data));
  }

  // remove undnefineds which are unsupported by jsyaml but cause issues in python
  data = JSON.parse(JSON.stringify(data));

  return yaml.safeDump(data);
}

export function safeLoad(text) {
  const yamlSafeLoad = callbacks.get('yamlSafeLoad');
  if (yamlSafeLoad) return yamlSafeLoad(text);

  return yaml.safeLoad(text);
}