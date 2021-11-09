import './index.less'

(function () {

  /**
   * Grid constructor
   * @param {*} gridRow 
   * @param {*} gridCol 
   * @param {*} type 
   * @param {*} isWalkable 
   */
  function Grid(gridRow, gridCol, type, isWalkable) {
    this.gridRow = gridRow;
    this.gridCol = gridCol
    this.gridType = type;
    this.isWalkable = isWalkable;
  }

  Grid.prototype.gridColor = ["#B5B5B5", "#FF845E", "#CCFF00"];
  Grid.prototype.gridRadius = 24;
  Grid.prototype.gridGap = 6;

  /**
   * draw grid in canvas
   * @param {*} game 
   * @param {*} context 
   */
  Grid.prototype.drawGrid = function (game, context) {
    context.beginPath();
    context.arc(
      this.getGridPosition(game).gridPositionX,
      this.getGridPosition(game).gridPositionY,
      this.gridRadius,
      0,
      Math.PI * 2,
      true
    );
    context.fillStyle = this.gridColor[this.gridType];
    context.fill();
    context.closePath();
  };

  /**
   * get grid position by row and col
   * @param {*} game 
   * @returns 
   */
  Grid.prototype.getGridPosition = function (game) {
    const gridPosition = {};

    // even row from left to right to draw 
    if (this.gridRow % 2 === 0) {
      gridPosition.gridPositionX =
        + this.gridRadius * 3 / 2 // + 1/2 girdRadius offset
        + this.gridCol * (this.gridRadius * 2 + this.gridGap);

      gridPosition.gridPositionY =
        + this.gridRadius
        + this.gridRow * (this.gridRadius * 2 + this.gridGap);
    } else {
      // ood row from l right to left to draw 
      gridPosition.gridPositionX =
        + game.gameCanvasWidth
        - (
          + this.gridRadius * 3 / 2 // + 1/2 girdRadius offset
          + (game.gameGridsColCount - 1 - this.gridCol) * (this.gridRadius * 2 + this.gridGap)
        );

      gridPosition.gridPositionY =
        + this.gridRadius
        + this.gridRow * (this.gridRadius * 2 + this.gridGap);
    }

    return gridPosition
  }

  /**
   * Cat constructor
   * @param {*} x 
   * @param {*} y 
   */
  function Cat(x, y) {
    this.catX = x;
    this.catY = y
  }

  /**
   * Barrier constructor
   * @param {*} x 
   * @param {*} y 
   */
  function Barrier(x, y) {
    this.barrierX = x;
    this.barrierY = y;
  }

  /**
   * Game constructor
   * @param {*} gameStart 
   * @param {*} gameSteps 
   * @param {*} gameMinSteps 
   */
  function Game(gameStart, gameSteps, gameMinSteps) {
    this.gameStart = gameStart;
    this.gameSteps = gameSteps;
    this.gameMinSteps = gameMinSteps;
  }

  Game.prototype.gameGridsRowCount = 9;
  Game.prototype.gameGridsColCount = 9;
  Game.prototype.gameCanvasWidth = 0;
  Game.prototype.gameCanvasHeight = 0;
  Game.prototype.gameBarriersCount = 6;

  /**
   * set game min steps
   * @param {*} gameMinSteps 
   */
  Game.prototype.setGameMinSteps = function (gameMinSteps) {
    document.getElementById('minSteps').innerHTML = gameMinSteps
  }

  /**
   * set game current steps
   * @param {*} gameSteps 
   */
  Game.prototype.setGameSteps = function (gameSteps) {
    document.getElementById('steps').innerHTML = gameSteps
  }

  /**
   * get game gird's radius and gap
   * @returns 
   */
  Game.prototype.getGameGridData = function () {
    const gridData = {};

    // according current client widtn,daynamic accument game grad's radus and gap
    const clientWidth = document.body.clientWidth;

    if (clientWidth > 1023 && clientWidth < 1440) {
      gridData.gridRadius = 24;
      gridData.gridGap = 6;
    } else if (clientWidth > 768 && clientWidth < 1024) {
      gridData.gridRadius = 20;
      gridData.gridGap = 5;
    } else if (clientWidth > 480 && clientWidth < 769) {
      gridData.gridRadius = 16;
      gridData.gridGap = 4;
    } else if (clientWidth < 481) {
      gridData.gridRadius = 12;
      gridData.gridGap = 3;
    } else {
      gridData.gridRadius = 24;
      gridData.gridGap = 6;
    }

    return gridData
  }

  /**
   * set game canvas size
   */
  Game.prototype.setGameCanvasSize = function () {
    const gridData = this.getGameGridData()

    // adapt canvas width 
    this.gameCanvasWidth =
      + gridData.gridRadius * 2 * this.gameGridsColCount
      + gridData.gridGap * (this.gameGridsColCount - 1)
      + gridData.gridRadius * 2
      + gridData.gridGap / 2

    // adapt canvas height
    this.gameCanvasHeight =
      + gridData.gridRadius * 2 * this.gameGridsRowCount
      + gridData.gridGap * (this.gameGridsRowCount - 1)

    // set canvas wight
    document.getElementById('canvas').setAttribute('width', this.gameCanvasWidth);
    // set canvas height
    document.getElementById('canvas').setAttribute('height', this.gameCanvasHeight)
  }

  /**
   * init crazy cat
   */
  Game.prototype.initGameCat = function () {
    const catPosX = (game.gameGridsColCount - 1) / 2;
    const catPosY = (game.gameGridsRowCount - 1) / 2;

    return new Cat(catPosX, catPosY);
  }

  /**
   * init game barriers
   */
  Game.prototype.initGameBarriers = function () {
    const gameBarriers = [];

    const x = [];
    const y = [];

    for (let i = 0; i < this.gameGridsRowCount; i++) {
      x.push(i)
    }

    for (let j = 0; j < this.gameGridsColCount; j++) {
      y.push(j)
    }

    for (let k = 0; k < this.gameBarriersCount; k++) {
      let randomX = Math.floor(Math.random() * this.gameGridsRowCount);
      let randomY = Math.floor(Math.random() * this.gameGridsColCount);

      while ((x[randomX] === -1 && y[randomY] === -1) || (randomX === 4 && randomY === 4)) {
        randomX = Math.floor(Math.random() * this.gameGridsRowCount);
        randomY = Math.floor(Math.random() * this.gameGridsColCount);
      }

      gameBarriers.push(new Barrier(randomX, randomY));

      x[randomX] = -1
      y[randomY] = -1
    }

    return gameBarriers
  }

  /**
   * init game grids
   * @param {*} gridData 
   * @param {*} gameBarriers 
   * @param {*} cat 
   */
  Game.prototype.initGameGrids = function (gridData, gameBarriers, cat) {
    const gameGrids = [];

    let grid
    let gridType
    let isWalkable

    let game = this;

    for (let i = 0; i < this.gameGridsRowCount; i++) {

      // i row
      gameGrids[i] = [];

      for (let j = 0; j < this.gameGridsColCount; j++) {
        // initila gird config
        gridType = 0;
        isWalkable = true;

        // find barriers in Game intance
        for (let k = 0; k < gameBarriers.length; k++) {
          const currentBarrier = gameBarriers[k];
          if (currentBarrier.barrierX === i && currentBarrier.barrierY === j) {
            gridType = 1
            isWalkable = false
            break;
          }
        }

        // find cat in Game instance
        if (cat.catX === i && cat.catY === j) {
          gridType = 2
          isWalkable = false
        }

        // generate game grid in Game instance
        grid = new Grid(i, j, gridType, isWalkable);

        grid.gridRadius = gridData.gridRadius;
        grid.gridGap = gridData.gridGap;

        // draw game grid in Game instance
        grid.drawGrid(game, context);

        // load game grid 
        gameGrids[i][j] = grid;
      }
    }

    return gameGrids
  }

  // game global init config

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  // game intance
  let game
  // game grid collection
  let gameGrids = [];
  // cat instance
  let cat
  // record node visited
  let isVisited
  // record node depth
  let searchDepth

  /**
 * judge click target point is in path
 * @param {*} x 
 * @param {*} y 
 * @param {*} grid 
 * @returns 
 */
  function isInPath(x, y, grid) {

    context.beginPath();
    context.arc(
      grid.getGridPosition(game).gridPositionX,
      grid.getGridPosition(game).gridPositionY,
      grid.gridRadius,
      0,
      Math.PI * 2,
      true
    );
    context.closePath();

    return context.isPointInPath(x, y)
  }

  /**
   * update game grid view
   * @param {*} x 
   * @param {*} y 
   * @param {*} type 
   * @param {*} isWalkable 
   */
  function updateGameGirdView(x, y, type, isWalkable) {
    gameGrids[x][y].gridType = type;
    gameGrids[x][y].drawGrid(game, context)
    gameGrids[x][y].isWalkable = isWalkable;
  }

  function clearGameGridView(gridRow, gridCol, gridType, isWalkable) {
    var grid = new Grid(gridRow, gridCol, gridType, isWalkable);

    grid.gridRadius = game.getGameGridData().gridRadius;
    grid.gridGap = game.getGameGridData().gridGap;

    context.clearRect(
      grid.getGridPosition(game).gridPositionX - grid.gridRadius,
      grid.getGridPosition(game).gridPositionY - grid.gridRadius,
      grid.gridRadius * 2,
      grid.gridRadius * 2
    );
  }

  /**
   * reset grids visited
   */
  function resetGridVisited() {
    isVisited = [];
    for (var i = 0; i < game.gameGridsRowCount; i++) {
      isVisited[i] = [];
      for (var j = 0; j < game.gameGridsColCount; j++) {
        isVisited[i][j] = false;
      }
    }
  }

  /**
   * reset grids depth
   */
  function resetGridDepth() {
    for (var i = 0; i < game.gameGridsRowCount; i++) {
      for (var j = 0; j < game.gameGridsColCount; j++) {
        if (gameGrids[i][j].isWalkable) {
          gameGrids[i][j].searchDepth = 1;
        }
      }
    }
  }

  /**
  * find current cat surround available grids
  * @param {*} depth 
  * @param {*} catGrid 
  * @returns 
  */
  function getSurroundGrids(depth, catGrid) {
    const surroundGrids = [];

    // even row surround girds relative position
    const evenRowSurroundGridsRelaPos = [
      [-1, -1], [-1, 0],
      [0, -1], [0, 1],
      [1, -1], [1, 0]
    ];
    const oddRowSurroundGridsRelaPos = [
      [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, 0], [1, 1]
    ];

    let rowSurroundGrids = [];

    if (catGrid.gridRow % 2 === 0) {
      // even row
      rowSurroundGrids = evenRowSurroundGridsRelaPos
    } else {
      // odd row
      rowSurroundGrids = oddRowSurroundGridsRelaPos
    }

    // loop surrpund grids
    for (let i = 0; i < rowSurroundGrids.length; i++) {
      const row = rowSurroundGrids[i][0];
      const col = rowSurroundGrids[i][1];

      console.log(catGrid)

      if (
        catGrid.gridRow + row < game.gameGridsRowCount &&
        catGrid.gridCol + col < game.gameGridsColCount &&
        gameGrids[catGrid.gridRow + row][catGrid.gridCol + col].isWalkable
      ) {
        if (!isVisited[catGrid.gridRow + row][catGrid.gridCol + col]) {
          gameGrids[catGrid.gridRow + row][catGrid.gridCol + col].searchDepth = depth + 1;
        }
        surroundGrids.push(gameGrids[catGrid.gridRow + row][catGrid.gridCol + col]);
      }
    }

    return surroundGrids
  }

  /**
   * get current girds surrands search results
   * @param {*} surroundGrids 
   * @returns 
   */
  function getSurrGridsSearchResults(surroundGrids) {
    const results = [];

    for (let i = 0; i < surroundGrids.length; i++) {
      // DFS
      // if (depthFirstSearchPath(surroundGrids[i], 0)) {
      //   results.push({
      //     gridDepth: searchDepth,
      //     grid: surroundGrids[i]
      //   });

      //   resetGridVisited();
      //   resetGridDepth();
      // }

      // BFS 
      if (breadthFirstSearchPath(surroundGrids[i])) {
        results.push({
          gridDepth: searchDepth,
          grid: surroundGrids[i]
        });

        resetGridVisited();
        resetGridDepth();
      }
    }

    return results;
  }

  /**
   * judge search edge
   * @param {*} grid 
   * @returns 
   */
  function isSearchEnd(grid) {
    if (
      grid.gridRow == 0 ||
      grid.gridRow == game.gameGridRowCount - 1 ||
      grid.gridCol == 0 ||
      grid.gridCol == game.gameGridColCount - 1
    ) {
      return true;
    }
  }

  /**
   * DFS
   * @param {*} grid 
   * @param {*} depth 
   */
  function depthFirstSearchPath(grid, depth) {
    if (isSearchEnd(grid)) {
      searchDepth = depth;
      return true;
    }

    // find current gird surround girds
    const currSurroundGrids = getSurroundGrids(depth, grid);


    // loop surround girds
    for (let i = 0; i < currSurroundGrids.length; i++) {
      const currSurroundGrid = currSurroundGrids[i];

      if (
        currSurroundGrid.gridRow < game.gameGridsRowCount &&
        currSurroundGrid.gridCol < game.gameGridsColCount &&
        !isVisited[currSurroundGrid.gridRow][currSurroundGrid.gridCol]
      ) {
        isVisited[currSurroundGrid.gridRow][currSurroundGrid.gridCol] = true;

        if (depthFirstSearchPath(currSurroundGrid, depth + 1)) {
          return true;
        }

        isVisited[currSurroundGrid.gridRow][currSurroundGrid.gridCol] = false;
      }
    }

    return false;

  }

  /**
   * BFS
   * @param {*} grid 
   * @returns 
   */
  function breadthFirstSearchPath(grid) {
    if (isSearchEnd(grid)) {
      searchDepth = grid.searchDepth;
      return true;
    }

    const queue = [];

    queue.push(grid);
    isVisited[grid.gridRow][grid.gridCol] = true;

    while (queue.length) {
      const front = queue.shift();

      const frontSurroundGrids = getSurroundGrids(front.searchDepth, front);

      // loop surround
      for (let i = 0; i < frontSurroundGrids.length; i++) {
        const currSurroundGrid = frontSurroundGrids[i];

        if (isSearchEnd(currSurroundGrid)) {
          searchDepth = currSurroundGrid.searchDepth
          return true
        }

        if (!isVisited[currSurroundGrid.gridRow][currSurroundGrid.gridCol]) {
          queue.push(currSurroundGrid);
          isVisited[currSurroundGrid.gridRow][currSurroundGrid.gridCol] = true
        }
      }
    }
  }

  /**
   * move crazy cat
   */
  function moveCat() {

    // find current cat surround available grids
    const surroundGrids = getSurroundGrids(searchDepth, gameGrids[cat.catX][cat.catY])

    // console.log('surroundGrids', surroundGrids);

    // get surround grids search results
    var surrGridsSearchResult = getSurrGridsSearchResults(surroundGrids);

    console.log('surrGridsSearchResult', surroundGrids, surrGridsSearchResult)

    if (surrGridsSearchResult.length !== 0) {
      var moveGrids = [];

      // loop for min girdDepth
      for (var i = 0; i < surrGridsSearchResult.length; i++) {
        if (surrGridsSearchResult[i].gridDepth === sortSearchDepth(surrGridsSearchResult)) {
          moveGrids.push(surrGridsSearchResult[i].grid);
        }
      }

      const randomMoveGrid = moveGrids[Math.floor(Math.random() * moveGrids.length)];

      clearGameGridView(cat.catX, cat.catY, 2, false);

      updateGameGirdView(cat.catX, cat.catY, 0, true);

      cat.catX = randomMoveGrid.gridRow;
      cat.catY = randomMoveGrid.gridCol;

      updateGameGirdView(cat.catX, cat.catY, 2, false);

      isGameLose()

    } else {
      isGameWin()
    }
  }

  /**
   * bubble sort gird resutl
   * @param {*} gridsSearchResult 
   * @returns 
   */
  function sortSearchDepth(gridsSearchResult) {
    var results = [];

    for (let i = 0; i < gridsSearchResult.length; i++) {
      results.push(gridsSearchResult[i].gridDepth);
    }

    for (var i = 0; i < results.length - 1; i++) {
      for (var j = 0; j < results.length - 1 - i; j++) {
        if (results[j] > results[j + 1]) {
          var temp = results[j];
          results[j] = results[j + 1];
          results[j + 1] = temp;
        }
      }
    }

    return results[0];
  }

  /**
   * is game win
   */
  function isGameWin() {
    const gameData = JSON.parse(window.localStorage.getItem("gameData"));

    if (gameData !== null && gameData !== undefined) {
      if (gameData.gameMinSteps > game.gameSteps) {
        gameData.gameMinSteps = game.gameSteps;
        window.localStorage.setItem("gameData", JSON.stringify(gameData));
      }
    } else {
      const data = {};
      data.gameMinSteps = game.gameSteps;
      window.localStorage.setItem("gameData", JSON.stringify(data));
    }

    alert("You win！Steps：" + game.gameSteps);

    document.location.reload();
  }

  /**
   * is game lose
   */
  function isGameLose() {
    if (
      cat.catX === 0 ||
      cat.catX === game.gameGridRowCount - 1 ||
      cat.catY === 0 ||
      cat.catY === game.gameGridColCount - 1
    ) {
      alert("You lose ! Please try again");
      document.location.reload();
    }
  }

  /**
   * canvas event
   */
  canvas.addEventListener(
    'click',
    function (e) {
      for (let i = 0; i < game.gameGridsRowCount; i++) {
        for (let j = 0; j < game.gameGridsColCount; j++) {
          if (isInPath(e.offsetX, e.offsetY, gameGrids[i][j])) {
            if (gameGrids[i][j].gridType === 0) {

              clearGameGridView(i, j, 1, true);

              // change grid to girrier
              updateGameGirdView(i, j, 1, false);

              resetGridVisited();
              resetGridDepth();

              searchDepth = 0;

              // move cat
              moveCat();

              game.gameSteps++;
              game.setGameSteps(game.gameSteps);
            }
          }
        }
      }
    },
    false
  )

  /**
   * initinal game
   */
  const initGame = function () {
    // init game instance
    game = new Game(true, 0, 0)

    // cache
    const gameData = JSON.parse(window.localStorage.getItem("gameData"));
    if (gameData !== null && gameData !== undefined) {
      game.setGameMinSteps(gameData.gameMinSteps);
    } else {
      game.setGameMinSteps(game.gameMinSteps);
    }

    game.setGameSteps(game.gameSteps);
    game.setGameCanvasSize();

    // init cat instance
    cat = game.initGameCat();

    // init grids instance
    gameGrids = game.initGameGrids(
      game.getGameGridData(),
      game.initGameBarriers(),
      cat
    );
  }

  // init game
  initGame();
}());