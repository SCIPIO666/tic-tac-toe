//dom module that renders various dom views 
//game logic module: tracks win/loose criteria and state tracking
//
generateSketch();


function generateSketch(){
    createFrame();
    createSquares(16);
    changeColorsOnHover();
    resetAllColors();
    changeGridSize();

}
