import * as React from 'react';

export default class Results extends React.Component {

  getMoveString = move => {
    switch (move) {
      case 0:
        return "Hore";
      case 1:
        return "Dole";
      case 2:
        return "Doprava";
      case 3:
        return "Doľava";
      default:
        throw new Error("Bad move");
    }
  }

  render() {
    console.log(this.props.successfulIndividual);
    return (
      <>
        {this.props.finished &&
          <>
            {this.props.successfulIndividual?.results?.stats?.success ?
              <h2>Boli úspešné nájdené všetky poklady</h2> :
              <h2>Neboli úspešné nájdené všetky poklady</h2>}
            <h4>Počet krokov: {this.props.successfulIndividual?.results?.stats?.moveCount}</h4>
            <h4>Nájdených pokladov: {this.props.successfulIndividual?.results?.stats?.treasuresFound}</h4>
            <h4>Postupnosť krokov</h4>
            <div>
              {this.props.successfulIndividual?.results?.stats?.moves?.map((move, idx) => {
                return <p key={idx} className="move">{`${this.getMoveString(move)}, `}</p>
              })}
            </div>
          </>
        }
      </>
    )
  }
}