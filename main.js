import './index.less'

(function () {

  /**
   * Game class
   * @param {*} gameStart 
   * @param {*} gameSteps 
   * @param {*} gameMinSteps 
   */
  function Game(gameStart, gameSteps, gameMinSteps) {
    this.gameStart = gameStart;
    this.gameSteps = gameSteps;
    this.gameMinSteps = gameMinSteps;
  }

  Game.prototype.gameGridsRowCount = 9
  Game.prototype.gameGridsColCount = 9;
  Game.prototype.gameCanvasWidth = 0;
  Game.prototype.gameCanvasHeight = 0;
  Game.prototype.gameBarriersCount = 6;

  /**
   * set game min steps
   * @param {*} gameMinSteps 
   */
  Game.prototype.setGameMinSteps = (gameMinSteps) => {
    document.getElementById('minSteps').innerHTML = gameMinSteps
  }

  /**
   * set game current steps
   * @param {*} gameSteps 
   */
  Game.prototype.setGameSteps = (gameSteps) => {
    document.getElementById('steps').innerHTML = gameSteps
  }

  /**
   * get game gird's radius and gap
   * @returns 
   */
  Game.prototype.getGameGridsData = () => {
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
    const gridsData = this.getGameGridsData()

    // adapt canvas width 
    this.gameCanvasWidth = gridsData.gridRadius * 2 * this.gameGridsRowCount + gridsData.gridGap * (this.gameGridsRowCount - 1)
    // adapt canvas height
    this.gameCanvasHeight = gridsData.gridRadius * 2 * this.gameGridsColCount + gridsData.gridGap * (this.gameGridsColCount - 1)

    // set canvas wight
    document.getElementById('canvas').setAttribute('width', this.gameCanvasWidth);
    // set canvas height
    document.getElementById('canvas').setAttribute('height', this.gameCanvasHeight)
  }

  /**
   * initinal game
   */
  const initGame = () => {
    // init game instance
    const game = new Game(true, 0, 0)

    game.setGameMinSteps(game.gameMinSteps);
    game.setGameSteps(game.gameSteps);
    game.setGameCanvasSize();

    // init cat instance
    // const cat = game.initGameCat();

    // init grids instance
    // const gameGrids = game.initGameGrids(
    //   game.getGameGridsData(),
    //   game.initGameBarriers(),
    //   cat
    // );
  }

  // init game
  initGame();
}());