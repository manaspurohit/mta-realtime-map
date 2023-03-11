import { useQuery } from 'graphql-hooks'
import './App.css';

const HELLO_QUERY = `query HelloQuery {
  hello
}`

function AppHeader() {
  const { loading, error, data } = useQuery(HELLO_QUERY)

  return (
    <div className="App">
      <header className="App-header">
        <label>
          {loading && "Loading..."}
          {error && "Error fetching Hello :("}
          {data && data.hello}
        </label>
      </header>
    </div>
  );
}

export default AppHeader;