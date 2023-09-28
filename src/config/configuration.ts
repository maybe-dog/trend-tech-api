import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

const YAML_CONFIG_FILEPATH = 'config/config.yaml';
export const config = yaml.load(
  readFileSync(YAML_CONFIG_FILEPATH, 'utf-8'),
) as Record<string, any>;

export default () => {
  return config;
};
