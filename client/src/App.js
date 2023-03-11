import { GraphQLClient, ClientContext } from 'graphql-hooks';
import AppHeader from './AppHeader';

const client = new GraphQLClient({
  url: '/graphql'
})

function App() {
  return (
    <ClientContext.Provider value={client}>
      <AppHeader />
    </ClientContext.Provider>
  )
}

export default App;
