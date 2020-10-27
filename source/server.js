// Core
import express from 'express';
import helmet from 'helmet';

// Swagger
import swaggerUi from 'swagger-ui-express';

// Instruments
import { openApiDocument } from './utils';

const app = express();
openApiDocument.info.version
    = process.env.DOCS_API_VERSION || process.env.npm_package_version || '0.0.1';

app.use(helmet());

let path = '/school/docs';

if (process.env.NODE_ENV === 'development') {
    path = '/';
}

app.use(
    path,
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, false, {withCredentials: true}),
);
app.get('/health', (req, res) => {
    res.sendStatus(204);
});

export { app };
