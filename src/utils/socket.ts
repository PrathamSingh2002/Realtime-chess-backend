import game from "./games";
import { io } from "..";
import User from "../models/userModel";
const { v4: uuidv4 } = require('uuid');
function generateRandomId() {
    const uuid = uuidv4().replace(/-/g, '');
    return uuid.slice(0, 10);
}
function calculateDeltaRating(currentRating, opponentRating, result) {
    // Constants used in the Glicko-2 rating system (adjust if needed)
    const K = 32; // Rating volatility
    const g = 0.06; // Rating system constant
  
    // Score based on game result (win: 1, loss: 0, draw: 0.5)
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    let actualScore;
    if (result === "win") {
      actualScore = 1;
    } else if (result === "loss") {
      actualScore = 0;
    } else {
      actualScore = 0.5;
    }
  
    // Calculate delta rating
    const deltaRating = K * (actualScore - expectedScore);
  
    return Math.round(deltaRating);
  }
  async function updateRatings(newGame, result) {
    // Function to call the server endpoint to update rating
    // Calculate delta ratings based on result
    const whiteDelta = calculateDeltaRating(newGame.whiteRating, newGame.blackRating, result);
    const blackDelta = -whiteDelta; // Opponent's delta is negative of winner's
    io.to(newGame.id).emit('gameOver', newGame, whiteDelta);
    const inc1 = {games:1, wins:0}
    const inc2 = {games:1, wins:0}        
    if(result == 'win'){
        inc1.wins = 1
    }if(result == 'loss'){
        inc2.wins = 1
    }        
    // Update ratings on server (assuming updateRatingUrl points to a valid endpoint)
    try {
      await User.updateOne({username: newGame.whiteName},{$set:{rating:newGame.whiteRating+whiteDelta}, $inc:inc1})
      await User.updateOne({username: newGame.blackName},{$set:{rating:newGame.blackRating+blackDelta}, $inc:inc2})
    } catch (error) {
      console.error("Error updating ratings:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  }

function updateScreens(roomId:string, turn:string){
    clearInterval(game.intervals[roomId])
    game.intervals[roomId] = setInterval(()=>{
        if(turn == 'w'){
            game.games[roomId].whiteTimer-=1;
        }else{
            game.games[roomId].blackTimer-=1;
        }
        if(game.games[roomId].whiteTimer<=0){
            game.games[roomId].gameOver = 'loss';
            updateRatings(game.games[roomId], 'loss')
            clearInterval(game.intervals[roomId])
        }
        else if(game.games[roomId].blackTimer<=0){
            game.games[roomId].gameOver = 'win';
            updateRatings(game.games[roomId], 'win')
            clearInterval(game.intervals[roomId])
        }
        if(game.games[roomId].gameOver != 'nill'){
            updateRatings(game.games[roomId], game.games[roomId].gameOver)
            clearInterval(game.intervals[roomId])
        }
        io.to(roomId).emit('updateScreen', game.games[roomId]);
    },100)
}

module.exports = (socket) => {
    socket.on('joinRoom',(roomName:string)=>{
        socket.join(roomName)
    })
    socket.on("move", (roomName:string,fen:string, turn:string, gameOver:boolean)=>{
        game.games[roomName].game = fen
        game.games[roomName].gameOver = gameOver
        updateScreens(roomName,turn)
    })
    socket.on("join",function(obj){
        const opp = game.lobby.find((temp:any)=>{
            return temp.variant = obj.variant
        })
        if(opp){
            const newGame = {
                id:generateRandomId(),
                variant: obj.variant,
                whiteName: obj.username,
                whiteRating: obj.rating,
                blackName: opp.username,
                blackRating: opp.rating,
                gameOver: "nill",
                whiteTimer: 600,
                game:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                blackTimer: 600,
            }
            game.games[newGame.id] = newGame
            io.emit('joined/'+newGame.whiteName, newGame)
            io.emit('joined/'+newGame.blackName, newGame)
            game.lobby = game.lobby.filter(item => item.username !== opp.username);
        }else{
            game.lobby.push({username:obj.username, variant:obj.variant, rating:obj.rating})
        }
        console.log(game.games)
    })
    // Socket event listeners and logic (e.g., message handling, room management
};