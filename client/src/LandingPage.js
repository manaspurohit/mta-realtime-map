import { useQuery } from 'graphql-hooks';
import map from './map.jpg';
import cTrainImg from './assets/c.svg';
import cInTransitImg from './assets/c_invert.svg';
import aTrainImg from './assets/a.svg';
import aInTransitImg from './assets/a_invert.svg';
import eTrainImg from './assets/e.svg';
import eInTransitImg from './assets/e_invert.svg';
import logoImg from './logo.svg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ImageMarker from 'react-image-marker';
import { useEffect, useState } from 'react';
import "./App.css";

const TRAINS_QUERY = `query TrainsQuery($lines: [LineWithDirection!]!) {
  trains(lines: $lines) {
    id
    top
    left
    status
    line
    direction
  }
}`

function getTrainImage(line, inTransit) {
  switch (line) {
    case 'A':
      return inTransit ? aInTransitImg : aTrainImg;
    case 'C':
      return inTransit ? cInTransitImg : cTrainImg;
    case 'E':
      return inTransit ? eInTransitImg : eTrainImg;
    default:
      return logoImg;
  }
}

function Train(props) {
  const southbound = props.direction === 'S';
  const inTransit = props.status === 'IN_TRANSIT';
  const line = props.line;

  let image = getTrainImage(line, inTransit);
  return (
    <div>
      <img
        src={image}
        alt={line + " train logo"}
        className={southbound ? 'Train_south' : undefined}
      />
    </div>
  )
}

function LandingPage() {
  // const [line, setLine] = useState('C')
  // const [direction, setDirection] = useState('N')
  // const { error, data, refetch } = useQuery(TRAINS_QUERY, {
  //   variables: {
  //     lines: [
  //       {
  //         line: line,
  //         direction: direction
  //       },
  //     ]
  //   }
  // })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch()
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

  // if (error) {
  //   return <label>Error fetching Trains!</label>
  // }

  // let markers = []
  // if (data) {
  //   markers = data.trains.map(train => {
  //     const train_data = {
  //       key: train.id,
  //       left: train.left,
  //       top: train.top,
  //       status: train.status,
  //       line: train.line,
  //       direction: train.direction
  //     }
  //     return train_data
  //   })
  // }

  const [markers, setMarkers] = useState([]);

  return (
    <div>
      {/* <Container fluid>
        <Row>
          <Col>
            <Form>
              <Form.Group as={Row}>
                <Col>
                <Form.Select onChange={({ target }) => setLine(target.value)}>
                  <option value="C" defaultValue>C</option>
                  <option value="A">A</option>
                  <option value="E">E</option>
                </Form.Select>
                </Col>
                <Col>
                <Form.Select onChange={({ target }) => setDirection(target.value)}>
                  <option value="N" defaultValue>Northbound</option>
                  <option value="S">Southbound</option>
                </Form.Select>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col>Train data coming soon!</Col>
        </Row>
      </Container> */}
      <ImageMarker
        src={map}
        markers={markers}
        //markerComponent={Train}
        onAddMarker={(marker) => {
          console.log(marker.top + "\n" + marker.left);
          setMarkers([...markers, marker])
        }}
      />
    </div>
  );
}

export default LandingPage;