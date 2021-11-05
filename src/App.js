import { Container } from '@mui/material';
import Settings from './Settings';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: 5,
      x: 0,
      y: 0,
      count: 1
    };
  }

  handleChangeGrid = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  generatePositions = () => {

  }

  render() {
    return (
      <Container className="mt-5">
        <Settings handleChangeGrid={this.handleChangeGrid} grid={this.state.grid} x={this.state.x} y={this.state.y} count={this.state.count} />
      </Container>
    )
  }
}

export default App;
