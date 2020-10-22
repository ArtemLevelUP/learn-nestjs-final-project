const path = require('path');
const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const cookieParser = require('cookie-parser');
const { APP_URL } = require('./configs');
const resolvers = require('./resolvers');
const schemaDirectives = require('./schemaDirectives');
const dataSources = require('./dataSources');
const Auth = require('./dataSources/Auth');

const typeDefs = importSchema(
    path.join(__dirname, './typeDefs/Schema.graphql')
);

/**
 * Create our instance of cookieParser and a function (addCookies) to use it as
 * a Promise instead of a middleware in express
 */
const cp = cookieParser();
const addCookies = (req, res) =>
    new Promise(resolve => {
        cp(req, res, resolve);
    });

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    dataSources,
    cors: {
        origin: APP_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['POST']
    },
    playground: {
        settings: {
            // possible values: 'line', 'block', 'underline'
            'editor.cursorShape': 'block',
            'request.credentials': 'include'
        }
    },
    context: async ({ req, res }) => {
        const auth = new Auth({ req, res });

        await addCookies(req, res);
        await auth.authenticate();

        return { auth };
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});