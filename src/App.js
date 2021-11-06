import Settings from './Settings';
import Gamegrid from './Grid';
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridSize: 5,
      grid: [],
      x: 0,
      y: 0,
      count: 1,
      populationCount: 20,
      continue: true
    };
  }

  handleChangeGrid = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'gridSize')
        this.setState({ x: 0, y: 0 }, () => {
          this.setState({ grid: this.createGrid() });
        });
      if (e.target.name === 'count')
        this.generatePositions();
      else
        this.setState({ grid: this.createGrid() });
    });
  }

  handleContinueChange = e => {
    this.setState({ continue: e.target.checked });
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
    for (let i = 0; i < this.state.populationCount; i++) { // Vytvorim si dany pocet jedincov
      let individual = [];
      for (let j = 0; j < 64; j++) { // Kazdy jedinec ma 64 buniek
        individual.push(this.generateCell());
      }
      population.push(individual);
    }

    // Pre kazdeho jedinca zbehnem simulaciu
    for (let i = 0; i < this.state.populationCount; i++) {
      let individual = this.cloneIndividual(population[i]);
      const stats = this.runSimulation(individual);
      const fitness = stats.treasuresFound - 0.001 * stats.moveCount; // Výpočet fitness funkcie, priorita je počet nájdených pokladov a sekundárne počet krokov
      if (stats.success) { // Hrac nasiel vsetky poklady
        this.setState({ sucessIndividual: stats });
        break;
      }
    }
  }

  // Konverzia desiatkove cisla na 8 bitove binarne
  dec2bin = dec => {
    return (dec >>> 0).toString(2).padStart(8, '0');
  }

  getInstruction = dec => {
    return this.dec2bin(dec).substring(0, 2);
  }

  getAdress = dec => {
    return this.dec2bin(dec).substring(2, 8);
  }

  getLast2Bits = dec => {
    return this.dec2bin(dec).substring(6, 8);
  }

  // Klonovanie jedinca
  cloneIndividual = individual => {
    return individual.map(item => {
      return item;
    });
  }

  // Klonovanie gridu
  cloneGrid = grid => {
    return grid.map(outerArray => {
      return outerArray.map(number => {
        return number;
      });
    });
  }

  // Hladanie hraca v gride
  findPlayer = grid => {
    for (let y = 0; y < this.state.gridSize; y++) {
      for (let x = 0; x < this.state.gridSize; x++) {
        if (grid[y][x] === 2) {
          return { playerX: x, playerY: y };
        }
      }
    }
    throw new Error("Player not found");
  }

  changeGrid = (oldX, oldY, newX, newY, grid, stats) => {
    if (newY < 0 || newY >= this.state.gridSize || newX < 0 || newX >= this.state.gridSize)
      return false; // Hrac vysiel z mriezky, nema zmysel pokracovat

    if (grid[newY][newX] === 1) // Hrac nasiel poklad
      stats.treasuresFound++;

    grid[oldY][oldX] = 0; // Premazem staru poziciu
    grid[newY][newX] = 2; // Premazem poklad, teda nastavim hraca na danu poziciu.

    return true;
  }

  applyMove = (moveNumber, grid, stats) => {
    const { playerX, playerY } = this.findPlayer(grid); // Ziskam suradnicu hraca
    stats.moveCount++; // Urobil som krok

    let success;
    switch (moveNumber) { // Podla cisla pohybu urobim krok
      case 0:
        success = this.changeGrid(playerX, playerY, playerX, playerY - 1, grid, stats);
        break;
      case 1:
        success = this.changeGrid(playerX, playerY, playerX, playerY + 1, grid, stats);
        break;
      case 2:
        success = this.changeGrid(playerX, playerY, playerX + 1, playerY, grid, stats);
        break;
      case 3:
        success = this.changeGrid(playerX, playerY, playerX - 1, playerY, grid, stats);
        break;
      default:
        throw new Error("Bad move");
    }

    return success;
  }

  runSimulation = individual => {
    let grid = this.cloneGrid(this.state.grid); // Klonovanie gridu, aby sme nemodifikovali povodny
    let stats = { // Informacia o najdenych pokladoch a vykonanych krokoch
      treasuresFound: 0,
      moveCount: 0,
      success: null,
      moves: []
    };
    let firstTime = true;

    while (firstTime || this.state.continue) { // Ak chcem pokracovat od zaciatku
      firstTime = false;
      for (let i = 0; i < individual.length; i++) { // Podla poctu buniek
        if (stats.moveCount === 500) // Prebehlo 500 krokov
          return { ...stats, success: false };
        let instruction = parseInt(this.getInstruction(individual[i]), 2);
        let address = parseInt(this.getAdress(individual[i]), 2);
        switch (instruction) {
          case 0: // Inkrementácia
            individual[address] = individual[address] === 255 ? 0 : individual[address] + 1;
            stats.moveCount++;
            break;
          case 1: // Dekrementácia
            individual[address] = individual[address] === 0 ? 255 : individual[address] - 1
            stats.moveCount++;;
            break;
          case 2: // Skok
            i = address;
            stats.moveCount++;
            continue;
          case 3: // Výpis
            for (let j = 0; j < i; j++) { // Začíname od prvej bunky až po aktuálnu
              const moveNumber = parseInt(this.getLast2Bits(individual[j]), 2);
              stats.moves.push(moveNumber);
              const success = this.applyMove(moveNumber, grid, stats);
              if (!success) // Hrac vysiel mimo mapy
                return { ...stats, success: false, error: true };

              if (stats.treasuresFound === this.state.count)  // Hrac nasiel vsetky poklady
                return { ...stats, success: true };

              if (stats.moveCount === 500) // Prebehlo 500 krokov
                return { ...stats, success: false };
            }
            break;
          default:
            throw new Error("Chyba");
        }
      }
    }

    return { ...stats, success: false };
  }

  render() {
    return (
      <div className="mx-auto">
        <Box className="m-5">
          <Grid className="mx-auto" container spacing={2}>
            <Grid item xs={6} className="mx-auto">
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
                continue={this.state.continue}
                handleContinueChange={this.handleContinueChange}
              />
            </Grid>
            <Grid className="mt-5" item xs={6}>
              <Gamegrid grid={this.state.grid} />
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}