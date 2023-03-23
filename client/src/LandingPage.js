import { useQuery } from 'graphql-hooks';
import map from './map.jpg';
import cTrainImg from './assets/c.svg';
import cInTransitImg from './assets/c_invert.svg';
import aTrainImg from './assets/a.svg';
import aInTransitImg from './assets/a_invert.svg';
import eTrainImg from './assets/e.svg';
import eInTransitImg from './assets/e_invert.svg';
import fiveTrainImg from './assets/five.svg';
import fiveInTransitImg from './assets/five_invert.svg';
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
    case 'FIVE':
      return inTransit ? fiveInTransitImg : fiveTrainImg;
    default:
      return inTransit ? cTrainImg: cInTransitImg;
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
  const [lineData, setLineData] = useState([
    {
      id: 1,
      line: 'C',
      direction: 'N'
    }
  ]);
  const { error, data, refetch } = useQuery(TRAINS_QUERY, {
    variables: {
      lines: lineData.map(({line, direction}) => ({line, direction}))
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
        line: train.line,
        direction: train.direction
      }
      return train_data
    })
  }

  const updateLineData = (data) => {
    let newLineData = lineData.reduce(
      (accLineData, curData) => {
        if (curData.id === data.id) {
          accLineData.push(data)
        } else {
          accLineData.push(curData)
        }
        return accLineData
      },
      []
    )
    setLineData(newLineData)
  }


  const form = lineData.map(data => {
    return (
      <Form.Group as={Row}>
        <Col>
          <Form.Select value={data.line} onChange={({ target }) => updateLineData({ id: data.id, line: target.value, direction: data.direction })}>
            <option value="C">C</option>
            <option value="A">A</option>
            <option value="E">E</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={data.direction} onChange={({ target }) => updateLineData({ id: data.id, line: data.line, direction: target.value })}>
            <option value="N">Northbound</option>
            <option value="S">Southbound</option>
          </Form.Select>
        </Col>
      </Form.Group>
    );
  })

  // const [markers, setMarkers] = useState([]);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <Form>
              {form}
            </Form>
          </Col>
          <Col>Train data coming soon!</Col>
        </Row>
      </Container>
      <ImageMarker
        src={map}
        markers={markers}
        markerComponent={Train}
        // onAddMarker={(marker) => {
        //   console.log(marker.top + "\n" + marker.left);
        //   setMarkers([...markers, marker])
        // }}
      />
    </div>
  );
}

export default LandingPage;