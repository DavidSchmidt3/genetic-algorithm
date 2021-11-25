import * as React from 'react';
import './grid.css';

export default class Grid extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.finished !== this.props.finished && this.props.finished) {
      this.props.drawStart();
    }
  }

  render() {
    console.log(this.props.successfulIndividual)
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
        <div className="mt-2 final-grid ">
          {this.props.finished && <h2>Koncový stav</h2>}
          {this.props.finished && this.props.grid?.map((array, idx) => {
            return array?.map((number, idy) => {
              return <div key={`${idx}${idy}`} className="cell"></div>
            }).concat(<div key={idx} className="separator" />);
          })}
          {this.props.finished && this.props.actualGrid?.map((array, idx) => {
            return array?.map((number, idy) => {
              return number === 1 ?
                <img key={`${idx}${idy}`} className="player img" style={{ position: "absolute", left: idy * 50 + 'px', top: idx * 49 + 46 + 'px' }} src={process.env.PUBLIC_URL + '/images/treasure.png'} alt="Poklad" /> : number === 2 ?
                  <img key={`${idx}${idy}`} className="treasure img" style={{ position: "absolute", left: idy * 50 + 'px', top: idx * 49 + 46 + 'px' }} src={process.env.PUBLIC_URL + '/images/miner.png'} alt="Hľadač" /> : null;
            }).concat(<div key={idx} className="separator" />);
          })}
        </div>
      </>
    )
  }
}