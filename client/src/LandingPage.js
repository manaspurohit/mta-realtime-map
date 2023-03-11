import { useQuery } from 'graphql-hooks'
import map from './map.jpg'
import Container from 'react-bootstrap/Container';
import ImageMarker from 'react-image-marker';
import { useEffect, useState } from 'react';

const TRAINS_QUERY = `query TrainsQuery {
  trains {
    top
    left
  }
}`

function LandingPage() {
  const { error, data, refetch } = useQuery(TRAINS_QUERY)

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <label>Error fetching Trains!</label>
  }

  let markers = []
  if (data) {
    markers = data.trains.map(train => {
      const train_data = {
        left: train.left,
        top: train.top,
      }
      return train_data
    })
  }

  // const [markers, setMarkers] = useState([]);

  return (
    <Container fluid>
      <ImageMarker
        src={map}
        markers={markers}
        // onAddMarker={(marker) => {
        //   console.log(marker.top + "\n" + marker.left);
        //   setMarkers([...markers, marker])
        // }}
      />
    </Container>
  );
}

export default LandingPage;