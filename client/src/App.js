import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import map from './map';

const roadURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAUVBMVEX///8AAADMzMzk5OTx8fHt7e27u7v5+fkZGRnR0dEoKCiioqIpKSnBwcGrq6uysrKampo0NDRTU1ONjY0ICAiHh4d+fn4hISFCQkKAgICYmJg26SuaAAABcUlEQVR4nO3czW6CQBSAUcS2Wn5qFS3S93/QbiQDi4ZMQky8nG85uZnM2d7FFEVm77tZ5eN4v1vsc3JLuTh9PDxGP+bnb7kPzo6QkPCVhUOd+gkpzIuQkJCQkJCQkJCQkJCQkJCQkJBwu8K6Tf2GFMbfeRMSEhISEhISEhISEhISEhISEhKuI8yLkJCQkJCQkJCQkJCQkJCQkJCQcLvC+yV1DymMvxEmJCQkJCQkJCQkJCQkJCQkJCQkXEc4fKf87klISEhISEhISEhISEhISEhISEi4ZWF3SnUhhfF33oSEhISEhISEhISEhISEhISEhM8RlsVhrGhDCvsm1YcU5kVISEhISEhISEhISEhISEhISEj4X8051YQUxt95ExISEhISEhISEhISEhISEhISEq4jvNWpIaQwL0JCQkJCQkJCQkJCQkJCQkJCQsLtCruv1C2kMP7Om5DwecJq0nV89r5a6jgTXpfGz6OwnY72VbbwD/8YhyqWxly6AAAAAElFTkSuQmCC";
const houseURL = "https://image.flaticon.com/icons/svg/63/63813.svg";
const truckURL = "https://d30y9cdsu7xlg0.cloudfront.net/png/690-200.png";

const getGameMap = () => map;

const getRandomGarbage = () => 
  Math.floor((Math.random() * 3) + 1) === 1 
  ? true: 
  false;

const getGarbageMap = (gameMap) => 
  gameMap.map(gameRow => 
    gameRow.map((element =>
      element.FieldType === 'house'
        ? getRandomGarbage()
        : false
    ))
  )

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameMap: getGameMap(),
      garbageMap: getGarbageMap(getGameMap()),
      agentPosition: [0, 4],
    }
  }
  newDay(e) {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      garbageMap: getGarbageMap(state.gameMap),
    }))
  }
  moveAgent(direction) {
    const newAgentPosition = [
      this.state.agentPosition[0] + direction[0],
      this.state.agentPosition[1] + direction[1],
    ]

    if (newAgentPosition[0] > 9
      || newAgentPosition[0] < 0
      ||  newAgentPosition[1] < 0
      || newAgentPosition[1] > 9 
    ) {
      return;
    }

    if (
      this.state.gameMap[newAgentPosition[0]][newAgentPosition[1]].FieldType === "house"
    ) {
      return;
    }
    
    this.setState((state) => ({
      ...state,
      agentPosition: newAgentPosition
    }))

    console.log(this.state.agentPosition);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Smieciarka
        </header>
        <button onClick={e => this.newDay(e)}>
          Nowy dzien
        </button>
        {
          this.state.gameMap.map((elements, parentIndex) => (
            <div className="row">
              {
                elements.map((element, index) => (
                  <div className="cell">
                    { element.FieldType === 'path'
                      ? <img src={roadURL}></img>
                      : <React.Fragment>
                          <img src={houseURL}></img>
                          <p className={`garbage-status ${this.state.garbageMap[parentIndex][index] ? 'garbage-active': ''}`}>
                          { this.state.garbageMap[parentIndex][index] 
                            ? "G"
                            : "" 
                            }
                            </p>
  
                        </React.Fragment>
                    }
                    {
                              this.state.agentPosition[0] === parentIndex && this.state.agentPosition[1] === index 
                              ? <img className="truck-image" src={truckURL}></img>
                              : ""
                            }
                  </div>
                ))
              }
            </div>
          ))
        }
        <button onClick={() => this.moveAgent([-1,0])} >Up</button>
        <button onClick={() => this.moveAgent([1,0])} >Down</button>
        <button onClick={() => this.moveAgent([0,-1])} >Left</button>
        <button onClick={() => this.moveAgent([0,1])} >Right</button>
      </div>
    );
  }
}

export default App;
