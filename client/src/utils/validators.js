const mapSize = [10, 20];

const getOutOfBoundsValidator = (agentPosition) => {
    if (
        agentPosition[0] > (mapSize - 1) ||
        agentPosition[0] < 0 ||
        agentPosition[1] < 0 ||
        agentPosition[1] > (mapSize - 1)
    ) {
        return false;
    } else {
        return true;
    }
}

const fieldTypeValidator = (agentPosition, gameMap, fieldType) => {
    try {
        return gameMap[agentPosition[0]][agentPosition[1]].FieldType === fieldType 
    ? true
    : false;
    } catch(e) {
        return false;
    }
}

export default {
    getOutOfBoundsValidator,
    fieldTypeValidator
}