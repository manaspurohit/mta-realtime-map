import { useQuery } from 'graphql-hooks'
import map from './map.jpg'
import Container from 'react-bootstrap/Container';

const TRAINS_QUERY = `query TrainsQuery {
  trains
}`

function LandingPage() {
  const { loading, error, data } = useQuery(TRAINS_QUERY)

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
    <Container fluid>
      <img src={map} alt="Map of New York City subway"/>
    </Container>
  );
}

export default LandingPage;