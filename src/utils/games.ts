class Game {
    intervals: {};
    games: {};
    lobby:any[]
    constructor() {
      this.intervals = {}; // Object to store game intervals
      this.games = {}; // Object to store game data (keyed by game ID
      this.lobby = []; // Object to store game data (keyed by game ID
    }
  }
const game = new Game()  
export default game;  
  