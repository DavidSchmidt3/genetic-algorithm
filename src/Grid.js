import * as React from 'react';
import './grid.css';

export default class Grid extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.grid)
  }

  render() {
    return (
      <>
        <div>ahoj</div>
        {this.props.grid?.map((array, idx) => {
          return array?.map((number, idy) => {
            return number === 1 ?
              <div key={`${idx}${idy}`} className="cell"></div> :
              <div key={`${idx}${idy}`} className="cell">
                <img src="../images/treasure.png" alt="Poklad" />
              </div>
          });
        })}
      </>
    )
  }
}