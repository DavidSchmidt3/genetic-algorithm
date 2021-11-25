import Settings from './Settings';
import Gamegrid from './Grid';
import React from 'react';
import Results from './Results';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parentSelection } from './const';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridSize: 5,
      grid: [],
      actualGrid: [],
      x: 0,
      y: 0,
      count: 1,
      populationCount: 20,
      animationDelay: 10,
      generationCount: 20,
      continue: true,
      elitism: true,
      elitismRatio: 10,
      tournamentCount: 2,
      parentSelection: parentSelection.roulette,
      mutationChance: 10,
      finished: false,
      success: false,
      settingsEnabled: true,
      loading: false,
      statistics: [],
      successfulIndividual: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.gridSize !== this.state.gridSize ||
      prevState.populationCount !== this.state.populationCount ||
      prevState.generationCount !== this.state.generationCount ||
      prevState.elitism !== this.state.elitism ||
      prevState.elitismRatio !== this.state.elitismRatio ||
      prevState.tournamentCount !== this.state.tournamentCount ||
      prevState.mutationChance !== this.state.mutationChance ||
      prevState.x !== this.state.x ||
      prevState.y !== this.state.y) {
      this.setState({ finished: false });
    }
  }

  handleChangeGrid = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'gridSize')
        this.setState({ x: 0, y: 0 }, () => {
          this.setState({ grid: this.createGrid() });
        });
      else if (e.target.name === 'count')
        this.generatePositions();
      else
        this.setState({ grid: this.createGrid() });
    });
  }

  handleSwitch = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleSlider = e => {
    this.setState({ [e.target.name]: e.target.value });
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

    this.setState({ grid, finished: false });
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
      this.setState({ count: coordinates.length });
    };
    reader.readAsText(e.target.files[0]);
    e.target.value = null; // Vyresetujeme input pre dalsie pouzitie
  }

  setPopulation = () => {
    let value = Number(this.state.populationCount);
    if (!isNaN(value)) {
      value = value < 20 ? 20 : value % 2 === 1 ? value + 1 : value;
      this.setState({ populationCount: value });
    }
    else {
      this.setState({ populationCount: 20 });
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  setGenerations = () => {
    let value = this.state.generationCount;
    if (!isNaN(value)) {
      value = value < 20 ? 20 : value;
      this.setState({ generationCount: value });
    }
    else {
      this.setState({ generationCount: 20 });
    }
  }

  generateCell = () => {
    return Math.floor(Math.random() * 256);
  }

  chooseFromInterval = max => {
    return Math.random() * max;
  }

  findIndex = (number, fitnessArray) => {
    if (number < fitnessArray[0])
      return 0;
    for (let i = 0; i < this.state.populationCount; i++) {
      if (number >= fitnessArray[i] && number <= fitnessArray[i + 1])
        return i;
    }
    throw new Error("Number not found!");
  }

  createFirstPopulation = () => {
    let population = [];
    for (let i = 0; i < this.state.populationCount; i++) { // Vytvorim si dany pocet jedincov
      let individual = [];
      for (let j = 0; j < 64; j++) { // Kazdy jedinec ma 64 buniek
        individual.push(this.generateCell());
      }
      population.push(individual);
    }

    return population;
  }

  mergeIndividuals = (individual1, individual2) => {
    let newIndividual = []; // Novy jedinec
    const randomIndex = Math.floor(Math.random() * 64);

    for (let i = 0; i < randomIndex; i++) { // Prva cast bude z prveho jedinca
      newIndividual.push(individual1[i]);
    }
    for (let i = randomIndex; i < 64; i++) { // Druha cast z druheho jedinca
      newIndividual.push(individual2[i]);
    }

    return newIndividual;
  }

  replaceString = (string, index, replacement) => {
    return string.substr(0, index) + replacement + string.substr(index + 1);
  }

  mutateIndivual = individual => {
    const number = Math.floor(Math.random() * 101); // Cislo od 0 po 100

    if (this.state.mutationChance < number) { // Ak dojde k mutacii
      const position = Math.floor(Math.random() * 64);
      const bitPosition = Math.floor(Math.random() * 8); // Bity 0 az 7
      let binaryIndividual = this.dec2bin(individual[position]); // Konverzia danej bunky na binarne cislo
      let newBit = parseInt(binaryIndividual[bitPosition]) === 1 ? 0 : 1; // Obratim bit
      binaryIndividual = this.replaceString(binaryIndividual, bitPosition, newBit) // Zmenim tento bit
      individual[position] = this.bin2dec(binaryIndividual); // Prepisem povodnu bunku
    }
  }

  pushBestInvidivuals = (fitnessArray, generation, newGeneration, desiredCount) => {
    let combinedArray = [];
    for (let j = 0; j < this.state.populationCount; j++)
      combinedArray.push({ 'fitness': fitnessArray[j], 'individual': generation[j] });

    combinedArray.sort((a, b) => (b.fitness - a.fitness));

    for (let j = 0; j < this.state.populationCount - desiredCount; j++) {
      newGeneration.push(combinedArray[j].individual);
    }
  }

  // Funkcia pre zistenie, kolko jedincov chceme ziskat krizenim
  getDesiredCount = () => {
    if (this.state.elitism) {
      let desiredCount = this.state.populationCount - Math.floor((this.state.elitismRatio / 100) * this.state.populationCount);
      return desiredCount % 2 === 1 ? desiredCount - 1 : desiredCount;
    } else {
      return this.state.populationCount;
    }
  }

  runOneIndividual = (individual, fitnessArray, fitnessSumArray, fitnessSum) => {
    let newIndividual = this.cloneIndividual(individual);
    const stats = this.runSimulation(newIndividual);
    const fitness = stats.treasuresFound - 0.001 * stats.moveCount <= 0 ? 0.05 : stats.treasuresFound - 0.001 * stats.moveCount; // Výpočet fitness funkcie, priorita je počet nájdených pokladov a sekundárne počet krokov
    fitnessArray.push(fitness); // Pole pre jednotlive fitness
    fitnessSum += fitness; // Pripočitame fitness jedinca ku celkovej fitness

    fitnessSumArray.push(fitnessSum); // Do pola zapiseme novu aktualnu celkovu hodnotu, tuto pouzijeme na ruletu
    let returnObject = {
      fitnessSum,
      fitness,
      stats,
      success: undefined
    };

    if (stats.success) { // Hrac nasiel vsetky poklady
      this.setState({ sucessIndividual: stats });
      returnObject.success = true;
      return returnObject;
    }

    returnObject.success = false;
    return returnObject;
  }

  applyRoulette = (fitnessSum, fitnessSumArray, generation, newGeneration) => {
    const index1 = this.findIndex(this.chooseFromInterval(fitnessSum), fitnessSumArray); // Vyber nahodnych jedincov podla fitness
    const index2 = this.findIndex(this.chooseFromInterval(fitnessSum), fitnessSumArray);
    if ((index1 !== index2)) { // Vyberam roznych potomkov
      let newIndividual1 = this.mergeIndividuals(generation[index1], generation[index2]); // Krizenie
      let newIndividual2 = this.mergeIndividuals(generation[index1], generation[index2]);
      this.mutateIndivual(newIndividual1);
      this.mutateIndivual(newIndividual2);
      newGeneration.push(newIndividual1, newIndividual2);
    }
  }

  getRandomIndexes = () => {
    let indexArray = [];
    while (indexArray.length < this.state.tournamentCount) { //
      const index = Math.floor(Math.random() * this.state.populationCount);
      if (!indexArray.includes(index)) {
        indexArray.push(index);
      }
    }
    return indexArray;
  }

  // Najdenie najsilnejsieho jedinca z turnaja
  findStrongest = (indexes, fitnessArray, generation) => {
    let maxFitness = 0, itemIndex = 0;
    indexes.forEach(index => {
      if (fitnessArray[index] > maxFitness) {
        maxFitness = fitnessArray[index];
        itemIndex = index;
      }
    });

    return generation[itemIndex];
  }

  applyTournament = (fitnessArray, generation, newGeneration) => {
    const indexes1 = this.getRandomIndexes();
    const indexes2 = this.getRandomIndexes();
    let individual1 = this.findStrongest(indexes1, fitnessArray, generation);
    let individual2 = this.findStrongest(indexes2, fitnessArray, generation);
    let newIndividual1 = this.mergeIndividuals(individual1, individual2);
    let newIndividual2 = this.mergeIndividuals(individual1, individual2);
    this.mutateIndivual(newIndividual1);
    this.mutateIndivual(newIndividual2);
    newGeneration.push(newIndividual1, newIndividual2);
  }

  continueSimulation = () => {
    this.startSimulation(undefined, this.state.generation);
  }

  endSimulation = () => {
    this.setState({ settingsEnabled: true, finished: false });
  }

  startComputations = (e, firstPopulation) => {
    let population = (firstPopulation || this.createFirstPopulation()); // Buď vytvorim novu populaciu, alebo zoberiem prechadzajucu
    let generation = population;
    let bestIndividual = { results: { fitness: 0, success: false } };
    let statistics = []; // Statistiky pre graf

    outerArray:
    for (let i = 0; i < this.state.generationCount; i++) { // Podla poctu pozadovanych generacii
      let newGeneration = [], fitnessArray = [], fitnessSumArray = [], fitnessSum = 0, minFitness = Number.MAX_SAFE_INTEGER, maxFitness = 0;

      for (let j = 0; j < this.state.populationCount; j++) { // Pre kazdeho jedinca zbehnem simulaciu
        let results = this.runOneIndividual(generation[j], fitnessArray, fitnessSumArray, fitnessSum, bestIndividual);
        fitnessSum = results.fitnessSum;
        if (results.fitness > maxFitness)
          maxFitness = results.fitness;

        if (results.fitness < minFitness)
          minFitness = results.fitness;

        if (results.fitness > bestIndividual.results.fitness)
          bestIndividual = { results };

        if (results.success) {
          break outerArray;
        }
      }

      let desiredCount = this.getDesiredCount(); // Pocet jedincov, ktorych chceme dostat krizenim
      statistics.push({ name: i, averageFitness: (fitnessSum / this.state.populationCount).toFixed(2), minFitness, maxFitness }); // Do statistik vlozime objekt, ktory hovori o fitness hodnotach

      while (newGeneration.length < desiredCount) { // Pokym nemam kompletnu novu populaciu
        if (this.state.parentSelection === parentSelection.roulette)
          this.applyRoulette(fitnessSum, fitnessSumArray, generation, newGeneration);
        else
          this.applyTournament(fitnessArray, generation, newGeneration);
      }

      if (this.state.elitism)
        this.pushBestInvidivuals(fitnessArray, generation, newGeneration, desiredCount);

      generation = newGeneration;
    }

    bestIndividual.results.success ? // Ak sa naslo riesenie
      this.setState({ finished: true, success: true, loading: false, statistics, successfulIndividual: bestIndividual, generation }) :
      this.setState({ finished: true, success: false, loading: false, statistics, successfulIndividual: bestIndividual, generation });

  }

  startSimulation = (e, firstPopulation) => {
    this.setState({ finished: false, settingsEnabled: false, loading: true });
    setTimeout(() => this.startComputations(e, firstPopulation), 100); // SetTimeout pre stihnutie vyobrazenia nacitavania
  }

  // Konverzia desiatkove cisla na 8 bitove binarne
  dec2bin = dec => {
    return (dec >>> 0).toString(2).padStart(8, '0');
  }

  bin2dec = bin => {
    return parseInt(bin, 2);
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
      instructionCount: 0,
      grid,
      moveCount: 0,
      success: null,
      moves: []
    };
    let firstTime = true;

    while (firstTime || this.state.continue) { // Ak chcem pokracovat od zaciatku
      firstTime = false;
      for (let i = 0; i < individual.length; i++) { // Podla poctu buniek
        if (stats.instructionCount === 500) // Prebehlo 500 krokov
          return { ...stats, success: false };
        let instruction = parseInt(this.getInstruction(individual[i]), 2);
        let address = parseInt(this.getAdress(individual[i]), 2);
        switch (instruction) {
          case 0: // Inkrementácia
            individual[address] = individual[address] === 255 ? 0 : individual[address] + 1;
            stats.instructionCount++;
            break;
          case 1: // Dekrementácia
            individual[address] = individual[address] === 0 ? 255 : individual[address] - 1;
            stats.instructionCount++;;
            break;
          case 2: // Skok
            i = address;
            stats.instructionCount++;
            continue;
          case 3: // Výpis
            const moveNumber = parseInt(this.getLast2Bits(individual[address]), 2);
            stats.moves.push(moveNumber);
            stats.instructionCount++;
            const validMove = this.applyMove(moveNumber, grid, stats);
            if (!validMove) // Hrac vysiel mimo mapy
              return { ...stats, success: false, error: true };

            if (stats.treasuresFound === this.state.count)  // Hrac nasiel vsetky poklady
              return { ...stats, success: true };

            if (stats.instructionCount === 500) // Prebehlo 500 krokov
              return { ...stats, success: false };
            break;
          default:
            throw new Error("Chyba");
        }
      }
    }

    return { ...stats, success: false };
  }

  timer = ms => new Promise(res => setTimeout(res, ms));

  drawStart = () => {
    this.setState({ actualGrid: this.state.grid });
  }

  startAnimation = async () => {
    let actualGrid = this.cloneGrid(this.state.grid);
    const moves = this.state.successfulIndividual.results.stats.moves;
    let stats = { moveCount: 0 };
    this.setState({ animationRunning: true });

    for (let i = 0; i < moves.length; i++) {
      this.applyMove(moves[i], actualGrid, stats);
      this.setState({ actualGrid });
      await this.timer(this.state.animationDelay);
    }

    this.setState({ animationRunning: false });
  }

  displayEnd = () => {
    this.setState({ actualGrid: this.state.successfulIndividual.results.stats.grid });
  }

  render() {
    return (
      <div className="mx-auto">
        <Box className="m-5">
          <Grid className="mx-auto" container spacing={2}>
            <Grid item xs={4} className="mx-auto">
              <Settings
                handleChangeGrid={this.handleChangeGrid}
                generatePositions={this.generatePositions}
                gridSize={this.state.gridSize}
                handleChange={this.handleChange}
                handleSlider={this.handleSlider}
                handleSwitch={this.handleSwitch}
                x={this.state.x}
                y={this.state.y}
                count={this.state.count}
                startSimulation={this.startSimulation}
                showFile={this.showFile}
                setPopulation={this.setPopulation}
                populationCount={this.state.populationCount}
                continue={this.state.continue}
                generationCount={this.state.generationCount}
                setGenerations={this.setGenerations}
                elitism={this.state.elitism}
                parentSelection={this.state.parentSelection}
                elitismRatio={this.state.elitismRatio}
                grid={this.state.grid}
                mutationChance={this.state.mutationChance}
                finished={this.state.finished}
                continueSimulation={this.continueSimulation}
                endSimulation={this.endSimulation}
                success={this.state.success}
                settingsEnabled={this.state.settingsEnabled}
                startAnimation={this.startAnimation}
                animationRunning={this.state.animationRunning}
                displayEnd={this.displayEnd}
                actualGrid={this.state.actualGrid}
                successfulIndividual={this.state.successfulIndividual}
              />
            </Grid>
            <Grid className="mt-5" item xs={4}>
              <Gamegrid
                grid={this.state.grid}
                finished={this.state.finished}
                successfulIndividual={this.state.successfulIndividual}
                drawStart={this.drawStart}
                actualGrid={this.state.actualGrid}
              />
            </Grid>
            <Grid item xs={4}>
              <Results
                finished={this.state.finished}
                success={this.state.success}
                successfulIndividual={this.state.successfulIndividual}
                statistics={this.state.statistics}
              />
            </Grid>
          </Grid>
          {this.state.finished &&
            <ResponsiveContainer height={300} width="100%">
              <LineChart data={this.state.statistics}
                margin={{ top: 30, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#808080" />
                <XAxis allowDecimals={false} tickCount={25} dataKey="name" type="number" />
                <YAxis tickCount={6} type="number" />
                <Tooltip />
                <Legend />
                <Line type="monotoneX" dot={false} name="Priemerná fitness hodnota generácie" dataKey="averageFitness" stroke="#8884d8" />
                <Line type="monotoneX" dot={false} name="Minimálna fitness hodnota generácie" dataKey="minFitness" stroke="#ff0000" />
                <Line type="monotoneX" dot={false} name="Maximálna fitness hodnota generácie" dataKey="maxFitness" stroke="#0040ff" />
              </LineChart>
            </ResponsiveContainer>
          }
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => 200 }}
            open={this.state.loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </div >
    );
  }
}