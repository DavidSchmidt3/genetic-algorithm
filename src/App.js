import Settings from './Settings';
import Gamegrid from './Grid';
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'gridSize') {
        this.setState({ grid: this.createGrid() });
      }
    });
  }

  generateRandomInt = () => {
    return Math.floor(Math.random() * this.state.gridSize);
  }

  generatePositions = () => {
    let grid = this.createGrid();

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

  // Vytvorenie 2d pola, so samymi nulami

  createGrid = () => {
    let gridSize = this.state.gridSize;
    let grid = Array.from({ length: gridSize }, () => (Array.from({ length: gridSize }, () => 0)));
    grid[this.state.y][this.state.x] = 2; // Náš hráč sa nachádza na tejto pozícii

    return grid;
  }

  insertTreasures = coordinates => {
    let grid = this.createGrid();
    for (let i = 0; i < coordinates.length; i++) {
      let [x, y] = coordinates[i];
      grid[y][x] = 1;
    }

    this.setState({ grid });
  }

  showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result; // Precitam text, urobim z neho 2d array so suradnicami - pozicie pokladov
      let coordinates = text.split("\n").map(item => {
        return item.split(",").map(item => parseInt(item));
      });
      this.insertTreasures(coordinates);
    };
    reader.readAsText(e.target.files[0]);
    e.target.value = null; // Vyresetujeme input pre dalsie pouzitie
  }

  render() {
    return (
      <Box className="m-5" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Settings
              handleChangeGrid={this.handleChangeGrid}
              generatePositions={this.generatePositions}
              gridSize={this.state.gridSize}
              x={this.state.x}
              y={this.state.y}
              count={this.state.count}
              showFile={this.showFile}
            />
          </Grid>
          <Grid className="mt-5" item xs={8}>
            <Gamegrid grid={this.state.grid} />
          </Grid>
        </Grid>
      </Box>
    )
  }
}

export default App;
