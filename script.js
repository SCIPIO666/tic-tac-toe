//dom module that renders various dom views 
//game logic module: tracks win/loose criteria and state tracking
//
const player1={
name: "PLAYER 1",
playedMoves: [],
lastMove: null,
score: 0,
}
const player2={
name: "PLAYER 2",
playedMoves: [],
lastMove: null,
score: 0,
}
const player3_cpu={
name: "COMPUTER",
playedMoves: [],
lastMove: null,
score: 0,
}
gameBoard=[
    null,null,null,
    null,null,null,
    null,null,null
];