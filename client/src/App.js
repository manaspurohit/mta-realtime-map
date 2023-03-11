import { GraphQLClient, ClientContext } from 'graphql-hooks';
import LandingPage from './LandingPage';

const client = new GraphQLClient({
  url: '/graphql'
})

function App() {
  return (
    <ClientContext.Provider value={client}>
      <LandingPage />
    </ClientContext.Provider>
  )
}

export default App;
