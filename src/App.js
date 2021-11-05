import { Container } from '@mui/material';
import Settings from './Settings';
import Grid from './Grid';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridSize: 5,
      grid: [],
      x: 0,
      y: 0,
      count: 1
    };
  }

  handleChangeGrid = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  generateRandomInt = () => {
    return Math.floor(Math.random() * this.state.gridSize);
  }

  generatePositions = () => {
    let gridSize = this.state.gridSize;

    // Vytvorenie 2d pola, so samymi nulami
    let grid = Array.from({ length: gridSize }, () => (Array.from({ length: gridSize }, () => 0)));
    grid[this.state.y][this.state.x] = 2; // Náš hráč sa nachádza na tejto pozícii

    // Podla poctu pokladov
    for (let i = 0; i < this.state.count; i++) {
      while (true) { // Generujeme poziciu
        let x = this.generateRandomInt();
        let y = this.generateRandomInt();

        if (grid[y][x] === 0) {   // Overenie, ci sa na danej pozicii uz nenachadza poklad
          grid[y][x] = 1; // Umiestnenie pokladu
          break;
        }
      }
    }

    this.setState({ grid });
  }

  render() {
    return (
      <Container className="mt-5">
        <Settings
          handleChangeGrid={this.handleChangeGrid}
          generatePositions={this.generatePositions}
          gridSize={this.state.gridSize}
          x={this.state.x}
          y={this.state.y}
          count={this.state.count}
        />
        <Grid grid={this.state.grid} />
      </Container>
    )
  }
}

export default App;
