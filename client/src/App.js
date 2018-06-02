import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import imageSources from "./utils/imageSources";
import validators from "./utils/validators";
import generators from "./utils/generators";

const garbageTypes = [
  imageSources.plasticURL,
  imageSources.paperURL,
  imageSources.glassURL
];

class App extends Component {
  constructor() {
    super();

    const gameMap = generators.fileMapGenerator();
    const garbageMap = generators.getGarbageMap(gameMap);

    this.state = {
      gameMap: gameMap,
      garbageMap,
      agentPosition: [0, 4],
      garbageShown: false,
      garbageLeft: this.countLeftGarbage(garbageMap),
      goodAnswers: 0,
      badAnswers: 0,
    };

    window.state = this.state;
  }
  countLeftGarbage(garbageMap) {
    return garbageMap.reduce(
      (acc, el) => acc + el.reduce((acc, el) => (el ? acc + 1 : acc), 0),
      0
    );
  }
  getGarbageType() {
    return garbageTypes[Math.floor(Math.random() * 3)];
  }
  newDay(e) {
    e.preventDefault();
    const newGarbageMap = generators.getGarbageMap(this.state.gameMap);

    this.setState(state => ({
      ...state,
      garbageMap: newGarbageMap,
      agentPosition: [0, 4],
      garbageLeft: this.countLeftGarbage(newGarbageMap)
    }));

    window.state = {
      garbageMap: newGarbageMap,
      garbageLeft: this.countLeftGarbage(newGarbageMap)
    }
  }
  displayGarbage(parentIndex, index) {
    if (this.state.garbageMap[parentIndex][index] === true) {
      this.setState(state => ({
        ...state,
        garbageShown: true,
        garbageTypeShown: this.getGarbageType(),
        field: [parentIndex, index]
      }));
    }
  }
  moveAgent(direction) {
    const newAgentPosition = [
      this.state.agentPosition[0] + direction[0],
      this.state.agentPosition[1] + direction[1]
    ];

    if (
      !validators.getOutOfBoundsValidator(newAgentPosition) ||
      (!validators.fieldTypeValidator(
        newAgentPosition,
        this.state.gameMap,
        "path"
      ) &&
        !validators.fieldTypeValidator(
          newAgentPosition,
          this.state.gameMap,
          "highway"
        ))
    )
      return;

    this.setState(state => ({
      ...state,
      agentPosition: newAgentPosition
    }));

    window.state.agentPosition = newAgentPosition;
  }
  renderGarbageField(parentIndex, index) {
    return (
      <p
        onClick={() => this.displayGarbage(parentIndex, index)}
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
      const changedGarbageMap = this.state.garbageMap;
      changedGarbageMap[this.state.field[0]][this.state.field[1]] = false;

      this.setState(state => ({
        ...state,
        garbageShown: false,
        garbageMap: changedGarbageMap,
        garbageLeft: this.countLeftGarbage(changedGarbageMap),
        goodAnswers: state.goodAnswers + 1,
      }));

      window.state.garbageMap = changedGarbageMap,
      window.state.garbageLeft = this.countLeftGarbage(changedGarbageMap)
      } else {
      this.setState(state => ({
        ...state,
        badAnswers: state.badAnswers + 1
      }))
    }
  }
  render() {
    return (
      <div>
        <div className="Sidebar" >
          <h2>Game dashboard</h2>
          <p>Garbage left: <span>{ this.state.garbageLeft }</span></p>
          <p data-testid="image-src">{ this.state.garbageTypeShown }</p>
          <p>Good answers: { this.state.goodAnswers}</p>
          <p>Bad answers: { this.state.badAnswers}</p>
        </div>
        <div className="App">
          <header className="App-header">
            Smieciarka - zostalo {this.state.garbageLeft}
          </header>
          {this.state.garbageShown ? (
            <div>
              <img
                className="garbage-image"
                src={this.state.garbageTypeShown}
              />
              <button data-testid='plastic' onClick={() => this.answerGarbage(0)}>Plastic</button>
              <button data-testid='paper' onClick={() => this.answerGarbage(1)}>Paper</button>
              <button data-testid='glass' onClick={() => this.answerGarbage(2)}>Glass</button>
            </div>
          ) : (
            ""
          )}
          <button onClick={e => this.newDay(e)}>Nowy dzien</button>
          {this.state.gameMap.map((elements, parentIndex) => (
            <div className="row">
              {elements.map((element, index) => (
                <div className="cell">
                  {element.FieldType === "path" ||
                  element.FieldType === "highway" ? (
                    <img
                      src={
                        element.FieldType === "path"
                          ? imageSources.roadURL
                          : imageSources.highwayURL
                      }
                    />
                  ) : (
                    <React.Fragment>
                      <img src={imageSources.houseURL} />
                      {this.renderGarbageField(parentIndex, index)}
                    </React.Fragment>
                  )}
                  {this.state.agentPosition[0] === parentIndex &&
                  this.state.agentPosition[1] === index ? (
                    <img className="truck-image" src={imageSources.truckURL} />
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))}
          <button data-testid='go-up' onClick={() => this.moveAgent([-1, 0])}>Up</button>
          <button data-testid='go-down' onClick={() => this.moveAgent([1, 0])}>Down</button>
          <button data-testid='go-left' onClick={() => this.moveAgent([0, -1])}>Left</button>
          <button data-testid='go-right' onClick={() => this.moveAgent([0, 1])}>Right</button>
        </div>
      </div>
    );
  }
}

export default App;
