import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';

export default withApollo(
    ({ headers }) =>
        new ApolloClient({
            uri: process.API_URL,
            credentials: 'include',
            headers
        })
);