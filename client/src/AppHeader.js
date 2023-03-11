import { useQuery } from 'graphql-hooks'
import './App.css';

const TRAINS_QUERY = `query TrainsQuery {
  trains
}`

function AppHeader() {
  const { loading, error, data } = useQuery(HELLO_QUERY)

  let content = null;

  if (loading) {
    content = <label>Loading</label>
  }

  if (error) {
    content = <label>Error fetching Trains!</label>
  }

  if (data) {
    content =
    <ul>
      {data.trains.map(train => <li>{train}</li>)}
    </ul>
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>
          {content}
        </label>
      </header>
    </div>
  );
}

export default AppHeader;