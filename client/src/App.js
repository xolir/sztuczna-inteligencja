import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import map from "./map";

const roadURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAUVBMVEX///8AAADMzMzk5OTx8fHt7e27u7v5+fkZGRnR0dEoKCiioqIpKSnBwcGrq6uysrKampo0NDRTU1ONjY0ICAiHh4d+fn4hISFCQkKAgICYmJg26SuaAAABcUlEQVR4nO3czW6CQBSAUcS2Wn5qFS3S93/QbiQDi4ZMQky8nG85uZnM2d7FFEVm77tZ5eN4v1vsc3JLuTh9PDxGP+bnb7kPzo6QkPCVhUOd+gkpzIuQkJCQkJCQkJCQkJCQkJCQkJBwu8K6Tf2GFMbfeRMSEhISEhISEhISEhISEhISEhKuI8yLkJCQkJCQkJCQkJCQkJCQkJCQcLvC+yV1DymMvxEmJCQkJCQkJCQkJCQkJCQkJCQkXEc4fKf87klISEhISEhISEhISEhISEhISEi4ZWF3SnUhhfF33oSEhISEhISEhISEhISEhISEhM8RlsVhrGhDCvsm1YcU5kVISEhISEhISEhISEhISEhISEj4X8051YQUxt95ExISEhISEhISEhISEhISEhISEq4jvNWpIaQwL0JCQkJCQkJCQkJCQkJCQkJCQsLtCruv1C2kMP7Om5DwecJq0nV89r5a6jgTXpfGz6OwnY72VbbwD/8YhyqWxly6AAAAAElFTkSuQmCC";
const houseURL = "https://image.flaticon.com/icons/svg/63/63813.svg";
const truckURL = "https://d30y9cdsu7xlg0.cloudfront.net/png/690-200.png";
const plasticURL = "https://5.imimg.com/data5/TC/RM/MY-10914613/plastic-bottle-500x500.jpg";
const paperURL = "https://4.imimg.com/data4/UL/HL/MY-18120183/75-gsm-a4-copier-paper-1079606-500x500.jpg";
const glassURL = "https://images-na.ssl-images-amazon.com/images/I/71w973QAsDS._SL1500_.jpg";

const getGameMap = () => map;

const getRandomGarbage = () =>
  Math.floor(Math.random() * 3 + 1) === 1 ? true : false;

const getGarbageMap = gameMap =>
  gameMap.map(gameRow =>
    gameRow.map(
      element => (element.FieldType === "house" ? getRandomGarbage() : false)
    )
  );

const garbageTypes = [
  plasticURL,
  paperURL,
  glassURL,
]  

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameMap: getGameMap(),
      garbageMap: getGarbageMap(getGameMap()),
      agentPosition: [0, 4],
      garbageShown: false,
    };
  }
  getGarbageType() {
    return garbageTypes[Math.floor(Math.random() * 3 + 1)];
  }
  newDay(e) {
    e.preventDefault();
    this.setState(state => ({
      ...state,
      garbageMap: getGarbageMap(state.gameMap)
    }));
  }
  displayGarbage() {
    this.setState((state) => ({
      ...state,
      garbageShown: true,
      garbageTypeShown: this.getGarbageType()
    }))
  }
  moveAgent(direction) {
    const newAgentPosition = [
      this.state.agentPosition[0] + direction[0],
      this.state.agentPosition[1] + direction[1]
    ];

    if (
      newAgentPosition[0] > 9 ||
      newAgentPosition[0] < 0 ||
      newAgentPosition[1] < 0 ||
      newAgentPosition[1] > 9
    ) {
      return;
    }

    if (
      this.state.gameMap[newAgentPosition[0]][newAgentPosition[1]].FieldType ===
      "house"
    ) {
      return;
    }

    this.setState(state => ({
      ...state,
      agentPosition: newAgentPosition
    }));
  }
  renderGarbageField(parentIndex, index) {
    return (
      <p
        onClick={() => this.displayGarbage()}
        className={`garbage-status ${
          this.state.garbageMap[parentIndex][index] ? "garbage-active" : ""
        }`}
      >
        {this.state.garbageMap[parentIndex][index] ? "G" : ""}
      </p>
    );
  }
  answerGarbage(garbageIndex) {
    if (garbageIndex === garbageTypes.indexOf(this.state.garbageTypeShown)) {
      this.setState((state) => ({
        ...state,
        garbageShown: false,
      }))
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">Smieciarka</header>
        { this.state.garbageShown ? (
          <div>
          <img className="garbage-image" src={this.state.garbageTypeShown}></img>
          <button onClick={() => this.answerGarbage(0)}>Plastic</button>
          <button onClick={() => this.answerGarbage(1)}>Paper</button>
          <button onClick={() => this.answerGarbage(2)}>Glass</button>
        </div> )
        : ""
        }
        <button onClick={e => this.newDay(e)}>Nowy dzien</button>
        {this.state.gameMap.map((elements, parentIndex) => (
          <div className="row">
            {elements.map((element, index) => (
              <div className="cell">
                {element.FieldType === "path" ? (
                  <img src={roadURL} />
                ) : (
                  <React.Fragment>
                    <img src={houseURL} />
                    { this.renderGarbageField(parentIndex, index) }
                  </React.Fragment>
                )}
                {this.state.agentPosition[0] === parentIndex &&
                this.state.agentPosition[1] === index ? (
                  <img className="truck-image" src={truckURL} />
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        ))}
        <button onClick={() => this.moveAgent([-1, 0])}>Up</button>
        <button onClick={() => this.moveAgent([1, 0])}>Down</button>
        <button onClick={() => this.moveAgent([0, -1])}>Left</button>
        <button onClick={() => this.moveAgent([0, 1])}>Right</button>
      </div>
    );
  }
}

export default App;
