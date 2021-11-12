import * as React from 'react';
import './grid.css';

export default class Grid extends React.Component {
  render() {
    return (
      <>
        {this.props.grid.length ? <h2>Začiatočný stav</h2> : null}
        {this.props.grid?.map((array, idx) => {
          return array?.map((number, idy) => {
            return number === 0 ?
              <div key={`${idx}${idy}`} className="cell"></div> :
              number === 1 ?
                <div key={`${idx}${idy}`} className="cell">
                  <img src={process.env.PUBLIC_URL + '/images/treasure.png'} alt="Poklad" />
                </div> :
                <div key={`${idx}${idy}`} className="cell player">
                  <img src={process.env.PUBLIC_URL + '/images/miner.png'} alt="Hľadač" />
                </div>
          }).concat(<div key={idx} className="separator" />);
        })}
        <div className="mt-2">
          {this.props.finished && <h2>Koncový stav</h2>}
          {this.props.finished && this.props.successfulIndividual?.results?.stats?.grid?.map((array, idx) => {
            return array?.map((number, idy) => {
              return number === 0 ?
                <div key={`${idx}${idy}`} className="cell"></div> :
                number === 1 ?
                  <div key={`${idx}${idy}`} className="cell">
                    <img src={process.env.PUBLIC_URL + '/images/treasure.png'} alt="Poklad" />
                  </div> :
                  <div key={`${idx}${idy}`} className="cell player">
                    <img src={process.env.PUBLIC_URL + '/images/miner.png'} alt="Hľadač" />
                  </div>
            }).concat(<div key={idx} className="separator" />);
          })}
        </div>
      </>
    )
  }
}