import * as React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { parentSelection } from './const';

export default class Settings extends React.Component {

  valueText = value => {
    return `${value}%`;
  }

  render() {
    return (
      <div className="settings">
        <h2 className="m-2">Úvodné nastavenie</h2>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="gridLabel">Veľkosť mriežky</InputLabel>
          <Select
            labelId="gridLabel"
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
            onChange={this.props.changePopulation}
            id="populationCount"
            label="Počet jedincov v populácii"
            value={this.props.populationCount}
            onBlur={this.props.setPopulation}
            variant="filled"
          />
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <TextField
            onChange={this.props.changeGeneration}
            id="generationCount"
            label="Počet generácii"
            value={this.props.generationCount}
            onBlur={this.props.setGenerations}
            variant="filled"
          />
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="parentSelectionLabel">Spôsob výberu jedincov</InputLabel>
          <Select
            labelId="parentSelectionLabel"
            id="parentSelection"
            name="parentSelection"
            value={this.props.parentSelection}
            label="Spôsob výberu jedincov"
            onChange={this.props.changeParentSelection}
          >
            <MenuItem value={parentSelection.roulette}>Ruleta</MenuItem>
            <MenuItem value={parentSelection.tournament}>Turnaj</MenuItem>
          </Select>
        </FormControl>
        <div className="m-2 sliders">
          <Box sx={{ width: 420 }}>
            <FormControl>
              <FormControlLabel control={<Switch checked={this.props.elitism} name="elitism" onChange={this.props.handleSwitch} />} label="Elitárstvo" />
            </FormControl>
            <Slider
              className="slider"
              aria-label="Podiel elitárstva"
              defaultValue={25}
              disabled={!this.props.elitism}
              getAriaValueText={this.valueText}
              valueLabelDisplay="on"
              valueLabelFormat={this.valueText}
              step={5}
              marks
              min={0}
              max={100}
            />
          </Box>
          <FormControl>
            <FormControlLabel control={<Switch checked={this.props.continue} name="continue" onChange={this.props.handleSwitch} />} label="Pokračovať po poslednej bunke" />
          </FormControl>
        </div>
        <div className="m-2">
          <Button onClick={this.props.generatePositions} className="ml-5 button" variant="outlined">Vygenuruj pozície pokladov</Button>
          <br />
          <Button className="button-2" variant="outlined" component="label">
            Nahraj súbor so súradnicami
            <input
              onChange={(e) => this.props.showFile(e)}
              type="file"
              hidden
            />
          </Button>
          <br />
          <Button onClick={this.props.startSimulation} className="ml-5 button-3" variant="outlined">Začať simuláciu</Button>
        </div>
      </div>
    );
  }
}