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
    // + gridData.gridGap / 2

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
   * change game gird to girrer
   * @param {*} x 
   * @param {*} y 
   * @param {*} type 
   * @param {*} isWalkable 
   */
  function updateGameGird(x, y, type, isWalkable) {
    gameGrids[x][y].gridType = type;
    gameGrids[x][y].drawGrid(game, context)
    gameGrids[x][y].isWalkable = isWalkable;
  }

  canvas.addEventListener(
    'click',
    function (e) {
      for (let i = 0; i < game.gameGridsRowCount; i++) {
        for (let j = 0; j < game.gameGridsColCount; j++) {
          if (isInPath(e.offsetX, e.offsetY, gameGrids[i][j])) {
            if (gameGrids[i][j].gridType === 0) {
              // change grid to girrier
              updateGameGird(i, j, 1, false);
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

    game.setGameMinSteps(game.gameMinSteps);
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