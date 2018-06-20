const puppeteer = require("puppeteer");
const Axios = require('axios');
const formData = require('form-data');
const { Graph, astar } = require('javascript-astar');

function delay(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

const getPhotoDescriptor = async (page) => {
    await page.$('.garbage-image');
    const photoURL = await page.$eval('.garbage-image', el => el.src);

    const classifierResponse = await Axios.post('http://localhost:5000/upload', {
        photo: photoURL
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return classifierResponse.data
};

const findNearestField = (gameMap, garbageYIndex, garbageXIndex) => {
    const possibilities = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const filteredPossibilies = possibilities.filter(el => 
        gameMap[garbageYIndex + el[0]] !== undefined && gameMap[garbageYIndex + el[0]][ garbageYIndex + el[1]] !== undefined
    );

    const nearestPossibility = filteredPossibilies.find(el => 
        gameMap[garbageYIndex + el[0]][garbageXIndex + el[1]].FieldType !== 'house'
    )

    console.log('y', garbageYIndex, 'x', garbageXIndex, 'going', nearestPossibility);

    return [garbageYIndex + nearestPossibility[0], garbageXIndex + nearestPossibility[1]]
}

const getMoveDirections = async(gameStateRef) => {
    const foundGarbageLine = gameStateRef.garbageMap.find(el => el.includes(true));
    const garbageYIndex = gameStateRef.garbageMap.indexOf(foundGarbageLine);
    const garbageXIndex = foundGarbageLine.findIndex(el => el === true);

    const weightMap = Array.from(gameStateRef.gameMap).map(el => el.map(nestedElement => {
        if (nestedElement.FieldType == 'path') {
            return 3;
        } else if (nestedElement.FieldType == 'highway') {
            return 1;
        } else {
            return 0;
        }
    }))

    const weightGraph = new Graph(weightMap);

    console.log('garbage target', garbageYIndex, garbageXIndex);

    const target = findNearestField(gameStateRef.gameMap, garbageYIndex, garbageXIndex);

    const astarResult = astar.search(
        weightGraph, 
        weightGraph.grid[gameStateRef.agentPosition[0]][gameStateRef.agentPosition[1]], 
        weightGraph.grid[target[0]][target[1]],
    )

    console.log('move target', target);
    return { astarPath: astarResult, originalTarget: [garbageYIndex, garbageXIndex] }
}

const performMoves = async (page, playerPosition, moveDirections) => {
    const elements = {};
    let currentPlayerPosition = playerPosition;

    elements.goUp = await page.$('[data-testid="go-up"]');
    elements.goDown = await page.$('[data-testid="go-down"]');
    elements.goLeft = await page.$('[data-testid="go-left"]');
    elements.goRight = await page.$('[data-testid="go-right"]');
  
    moveDirections.forEach(async element => {
        if (element.x > currentPlayerPosition[0]) {
            currentPlayerPosition[0]++;
            await elements.goDown.click();
        } else if (element.x < currentPlayerPosition[0]) {
            currentPlayerPosition[0]--;
            await elements.goUp.click();
        } else if (element.y > currentPlayerPosition[1]) {
            currentPlayerPosition[1]++;
            await elements.goRight.click();
        } else {
            currentPlayerPosition[1]--;
            await elements.goLeft.click();
        }
        return;
    });

    return;
}

const collectGarbage = async (page, elements) => {
    const gameStateRef = await page.evaluate(() => window.state);
    const moveDirections = await getMoveDirections(gameStateRef);

    await performMoves(page, gameStateRef.agentPosition, moveDirections.astarPath);
    const cells = await page.$$('.cell');
    const clickTarget = Array.from(cells)[moveDirections.originalTarget[0] * 10 + moveDirections.originalTarget[1]]
    await clickTarget.click();

    let photoDescriptor = await getPhotoDescriptor(page);
  
    elements.plastic = await page.$('[data-testid="plastic"]')
    elements.paper = await page.$('[data-testid="paper"]')
    elements.glass = await page.$('[data-testid="glass"]')
  
    console.log('Debug info: Clicking on - ', photoDescriptor);
    await elements[photoDescriptor].click();
    return
}
puppeteer.launch({
    headless: false,
    slowMo: 200,
}).then(async browser => {
  const elements = {};
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  elements.fieldGarbage = await page.$('.garbage-active');

  let gameStateRef = await page.evaluate(() => window.state);

  while (gameStateRef.garbageLeft > 0) {
    await collectGarbage(page, elements);
    let gameStateRef = await page.evaluate(() => window.state);
  }


  
});
