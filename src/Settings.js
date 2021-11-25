import * as React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { parentSelection } from './const';

export default class Settings extends React.Component {

  valueText = value => {
    return `${value}%`;
  }

  valueMs = value => {
    return `${value} ms`;
  }

  getSimulationDisabled = () => {
    if (!this.props.grid.length || this.props.animationRunning)
      return true;

    for (let y = 0; y < this.props.gridSize; y++) {
      for (let x = 0; x < this.props.gridSize; x++) {
        if (this.props.grid?.[y]?.[x] === 1)
          return false;
      }
    }

    return true;
  }

  getEndDrawDisabled = () => {
    if (this.props.animationRunning)
      return true;

    for (let y = 0; y < this.props.gridSize; y++) {
      for (let x = 0; x < this.props.gridSize; x++) {
        if (this.props.successfulIndividual?.results?.stats?.grid?.[y]?.[x] !== this.props.actualGrid?.[y]?.[x])
          return false;
      }
    }

    return true;
  }

  render() {
    return (
      <div className="settings">
        <h2 className="m-2">Úvodné nastavenie</h2>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="gridLabel">Veľkosť mriežky</InputLabel>
          <Select
            labelId="gridLabel"
            disabled={!this.props.settingsEnabled}
            id="gridSize"
            name="gridSize"
            value={this.props.gridSize}
            label="Veľkosť mriežky"
            onChange={this.props.handleChangeGrid}
          >
            <MenuItem value={5}>5x5</MenuItem>
            <MenuItem value={6}>6x6</MenuItem>
            <MenuItem value={7}>7x7</MenuItem>
            <MenuItem value={8}>8x8</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="countLabel">Počet pokladov</InputLabel>
          <Select
            labelId="countLabel"
            disabled={!this.props.settingsEnabled}
            id="count"
            name="count"
            value={this.props.count}
            label="Počet pokladov"
            onChange={this.props.handleChangeGrid}
          >
            {[...Array(10)].map((i, y) =>
              <MenuItem key={y} value={y + 1}>{y + 1}</MenuItem>
            )}
          </Select>
        </FormControl>
        <br />
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="xLabel">Začiatočná pozícia x</InputLabel>
          <Select
            labelId="xLabel"
            id="x"
            disabled={!this.props.settingsEnabled}
            name="x"
            value={this.props.x}
            label="Začiatočná pozícia x"
            onChange={this.props.handleChangeGrid}
          >
            {[...Array(this.props.gridSize)].map((i, x) =>
              <MenuItem key={x} value={x}>{x}</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="yLabel">Začiatočná pozícia y</InputLabel>
          <Select
            labelId="yLabel"
            id="y"
            disabled={!this.props.settingsEnabled}
            name="y"
            value={this.props.y}
            label="Začiatočná pozícia y"
            onChange={this.props.handleChangeGrid}
          >
            {[...Array(this.props.gridSize)].map((i, y) =>
              <MenuItem key={y} value={y}>{y}</MenuItem>
            )}
          </Select>
        </FormControl>
        <br />
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <TextField
            onChange={this.props.handleChange}
            name="populationCount"
            disabled={!this.props.settingsEnabled}
            id="populationCount"
            label="Počet jedincov v populácii"
            value={this.props.populationCount}
            onBlur={this.props.setPopulation}
            variant="filled"
          />
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <TextField
            onChange={this.props.handleChange}
            id="generationCount"
            disabled={!this.props.settingsEnabled}
            name="generationCount"
            label="Počet generácii"
            value={this.props.generationCount}
            onBlur={this.props.setGenerations}
            variant="filled"
          />
        </FormControl>
        <br />
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="parentSelectionLabel">Spôsob výberu jedincov</InputLabel>
          <Select
            labelId="parentSelectionLabel"
            id="parentSelection"
            disabled={!this.props.settingsEnabled}
            name="parentSelection"
            value={this.props.parentSelection}
            label="Spôsob výberu jedincov"
            onChange={this.props.handleChange}
          >
            <MenuItem value={parentSelection.roulette}>Ruleta</MenuItem>
            <MenuItem value={parentSelection.tournament}>Turnaj</MenuItem>
          </Select>
        </FormControl>
        {
          (this.props.parentSelection === parentSelection.tournament) &&
          <Box className="box" sx={{ width: 200 }}>
            <Typography>Počet jedincov do turnaja</Typography>
            <Slider
              aria-label="Počet jedincov do turnaja"
              name="tournamentCount"
              onChange={this.props.handleSlider}
              disabled={!this.props.settingsEnabled}
              value={this.props.tournamentCount}
              valueLabelDisplay="on"
              size="small"
              step={1}
              className="tournamentSlider"
              marks
              min={2}
              max={5}
            />
          </Box>
        }
        <div className="m-2">
          <Box className="box2" sx={{ width: 420 }}>
            <Typography className="chance">Šanca na mutáciu</Typography>
            <Slider
              aria-label="Šanca na mutáciu"
              name="mutationChance"
              onChange={this.props.handleSlider}
              disabled={!this.props.settingsEnabled}
              value={this.props.mutationChance}
              valueLabelFormat={this.valueText}
              valueLabelDisplay="on"
              step={1}
              className="mutationSlider"
              marks
              min={1}
              max={10}
            />
          </Box>
        </div>
        <div className="m-2 sliders">
          <Box sx={{ width: 420 }}>
            <FormControl>
              <FormControlLabel control={<Switch disabled={!this.props.settingsEnabled} checked={this.props.elitism} name="elitism" onChange={this.props.handleSwitch} />} label="Elitárstvo" />
            </FormControl>
            {this.props.elitism &&
              <Slider
                className="slider"
                aria-label="Podiel elitárstva"
                name="elitismRatio"
                disabled={!this.props.settingsEnabled}
                onChange={this.props.handleSlider}
                value={this.props.elitismRatio}
                getAriaValueText={this.valueText}
                valueLabelDisplay="on"
                valueLabelFormat={this.valueText}
                step={1}
                marks
                min={5}
                max={25}
              />
            }
          </Box>
          <FormControl>
            <FormControlLabel control={<Switch disabled={!this.props.settingsEnabled} checked={this.props.continue} name="continue" onChange={this.props.handleSwitch} />} label="Pokračovať po poslednej bunke" />
          </FormControl>
          <br />
          <FormControl>
            <Typography className="chance">Pauza medzi snímkami animácie</Typography>
            <Slider
              className="slider mt-5"
              aria-label="Pauza medzi snímkami animácie"
              name="animationDelay"
              disabled={!this.props.settingsEnabled}
              onChange={this.props.handleSlider}
              value={this.props.animationDelay}
              getAriaValueText={this.valueMs}
              valueLabelDisplay="on"
              valueLabelFormat={this.valueMs}
              step={10}
              marks
              min={10}
              max={200}
            />
          </FormControl>
        </div>
        <div className="m-2">
          <Button onClick={this.props.generatePositions} disabled={!this.props.settingsEnabled} className="ml-5 button" variant="outlined">Vygenuruj pozície pokladov</Button>
          <br />
          <Button disabled={!this.props.settingsEnabled} className="button-2" variant="outlined" component="label">
            Nahraj súbor so súradnicami
            <input
              onChange={(e) => this.props.showFile(e)}
              type="file"
              hidden
            />
          </Button>
          <br />
          <Button onClick={this.props.startSimulation} disabled={this.getSimulationDisabled()} className="ml-5 button-3" variant="outlined">Začať novú simuláciu</Button>
          {(this.props.finished) &&
            <>
              {!this.props.success &&
                <Button onClick={this.props.continueSimulation} disabled={this.props.animationRunning} className="ml-5 button-3" variant="outlined">Pokračuj simuláciu</Button>
              }
              <Button onClick={this.props.endSimulation} disabled={this.props.animationRunning} className="ml-5 button-3" variant="outlined">Skonči simuláciu</Button>
              <Button onClick={this.props.startAnimation} disabled={this.props.animationRunning} className="ml-5 button-3" variant="outlined">Vykresli animáciu</Button>
              <Button onClick={this.props.displayEnd} disabled={this.getEndDrawDisabled()} className="ml-5 button-3" variant="outlined">Vykresli koniec</Button>
            </>
          }
        </div>
      </div >
    );
  }
}