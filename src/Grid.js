import * as React from 'react';
import './grid.css';

export default class Grid extends React.Component {
  render() {
    return (
      <>
        {this.props.grid?.map((array, idx) => {
          return array?.map((number, idy) => {
            return number === 0 ?
              <div key={`${idx}${idy}`} className="cell"></div> :
              number === 1 ?
                <div key={`${idx}${idy}`} className="cell">
                  <img src="/images/treasure.png" alt="Poklad" />
                </div> :
                <div key={`${idx}${idy}`} className="cell player">
                  <img src="/images/miner.png" alt="Poklad" />
                </div>
          }).concat(<div className="separator" />);
        })}
      </>
    )
  }
}