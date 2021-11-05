import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default class Settings extends React.Component {
  render() {
    return (
      <>
        <h2>Úvodné nastavenie</h2>
        <Box sx={{ minWidth: 240 }}>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 240 }}>
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
        </Box >
        <Box sx={{ minWidth: 240 }}>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 240 }}>
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
        </Box >
        <Box sx={{ minWidth: 240 }}>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 240 }}>
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
        </Box >
        <Box sx={{ minWidth: 240 }}>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 240 }}>
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
        </Box >
        <Box sx={{ minWidth: 240 }}>
          <div className="m-2">
            <Button onClick={this.props.generatePositions} className="ml-5" size="small" variant="contained">Vygenuruj pozície pokladov</Button>
          </div>
        </Box>
      </>
    );
  }
}