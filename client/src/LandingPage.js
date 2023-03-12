import { useQuery } from 'graphql-hooks';
import map from './map.jpg';
import cTrainImg from './c.svg';
import cInTransitImg from './c_in_transit.svg';
import Container from 'react-bootstrap/Container';
import ImageMarker from 'react-image-marker';
import { useEffect, useState } from 'react';
import "./App.css";

const TRAINS_QUERY = `query TrainsQuery($lines: [LineWithDirection!]!) {
  trains(lines: $lines) {
    id
    top
    left
    status
    direction
  }
}`

function Train(props) {
  const southbound = props.direction === 'S';
  const inTransit = props.status === 'IN_TRANSIT';

  let image = inTransit ? cInTransitImg : cTrainImg;
  return (
    <div>
      <img
        src={image}
        alt="C train logo"
        className={southbound ? 'Train_south' : undefined}
      />
    </div>
  )
}

function LandingPage() {
  const { error, data, refetch } = useQuery(TRAINS_QUERY, {
    variables: {
      lines: [
        {
          line: 'C',
          direction: 'S'
        },
        {
          line: 'C',
          direction: 'N'
        }
      ]
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 1000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (error) {
    return <label>Error fetching Trains!</label>
  }

  let markers = []
  if (data) {
    markers = data.trains.map(train => {
      const train_data = {
        key: train.id,
        left: train.left,
        top: train.top,
        status: train.status,
        direction: train.direction
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
        markerComponent={Train}
        // onAddMarker={(marker) => {
        //   console.log(marker.top + "\n" + marker.left);
        //   setMarkers([...markers, marker])
        // }}
      />
    </Container>
  );
}

export default LandingPage;