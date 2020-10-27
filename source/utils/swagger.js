// Node imports
import fs from 'fs';
import path from 'path';

// Instruments
import jsYaml from 'js-yaml';

const openApiDocument = jsYaml.safeLoad(
    fs.readFileSync(path.resolve('source/swagger/api.yaml'), 'utf-8'), // eslint-disable-line no-sync
);

const css = fs.readFileSync(path.resolve('source/swagger/styles.css'), 'utf-8'); // eslint-disable-line no-sync

export { openApiDocument, css };
