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
      count: 1,
      populationCount: 20
    };
  }

  handleChangeGrid = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'gridSize') {
        this.setState({ grid: this.createGrid() });
      }
    });
  }

  generateRandomPosition = () => {
    return Math.floor(Math.random() * this.state.gridSize);
  }

  generatePositions = () => {
    let grid = this.createGrid();

    // Podla poctu pokladov
    for (let i = 0; i < this.state.count; i++) {
      while (true) { // Generujeme poziciu
        let x = this.generateRandomPosition();
        let y = this.generateRandomPosition();

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

  changePopulation = e => {
    this.setState({ populationCount: e.target.value });
  }

  setPopulation = () => {
    let value = this.state.populationCount;
    if (!isNaN(value)) {
      value = value < 20 ? 20 : value;
      this.setState({ populationCount: value });
    }
    else {
      this.setState({ populationCount: 20 });
    }
  }

  generateCell = () => {
    return Math.floor(Math.random() * 256);
  }

  startSimulation = () => {
    let population = [];
    for (let i = 0; i < this.state.populationCount; i++) { // Vytvorime si dany pocet jedincov
      let individual = [];
      for (let j = 0; j < 64; j++) { // Kazdy jedinec ma 64 buniek
        individual.push(this.generateCell());
      }
      population.push(individual);
    }

    for (let i = 0; i < this.state.populationCount; i++) {
      let individual = this.cloneIndividual(population[i]);
      this.runSimulation(individual);
    }
  }

  dec2bin = dec => {
    return (dec >>> 0).toString(2).padStart(8, '0'); // Konverzia desiatkove cisla na 8 bitove binarne
  }

  getInstruction = dec => {
    return this.dec2bin(dec).substring(0, 2);
  }

  getAdress = dec => {
    return this.dec2bin(dec).substring(2, 8);
  }

  cloneIndividual = individual => {
    return individual.map(item => {
      return item;
    })
  }

  runSimulation = individual => {
    let steps = [];
    for (let i = 0; i < individual.length; i++) {
      let instruction = parseInt(this.getInstruction(individual[i]), 2);
      let address = parseInt(this.getAdress(individual[i]), 2);
      switch (instruction) {
        case 0: // Inkrementácia
          individual[address] = individual[address] === 255 ? 0 : individual[address] + 1;
          break;
        case 1: // Dekrementácia
          individual[address] = individual[address] === 0 ? 255 : individual[address] - 1;
          break;
        case 2: // Skok
          i = address;
          continue;
        case 3:
          break;
        default:
          throw new Error("Chyba");
      }
    }
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
              startSimulation={this.startSimulation}
              showFile={this.showFile}
              changePopulation={this.changePopulation}
              setPopulation={this.setPopulation}
              populationCount={this.state.populationCount}
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
