let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let canvasWidthPx = canvas.offsetWidth;
let canvasHeightPx = canvas.offsetHeight;

let GRID_PRIMARY = 1;
let GRID_SECONDARY = 2;

let gridsize = 50;
let pointRadius = 5;
let lineWidth = 2;

let prevPoint = null;
let colors = [ "rgb(187, 143, 206)" ];
let grid_colors = [ "rgba(187, 143, 206, .3)" ]


// Draw primary grid
drawGrid(gridsize, GRID_PRIMARY);

let trajectory = [];
let markedCells = [];

canvas.onclick = function(evt, target){
    let point = { 
        x: evt.offsetX, 
        y: evt.offsetY,
        cellX: Math.floor(evt.offsetX / gridsize),
        cellY: Math.floor(evt.offsetY / gridsize)
    };
    trajectory.push(point);

    // Draw a point
    drawPoint(point, colors[0]);
    
    // If it's not the first point, draw a line from the previous one and fill the cells under it
    if(trajectory.length > 1){
        drawLine(trajectory[trajectory.length-2], trajectory[trajectory.length-1], colors[0]);
        
        // Get all grid cells that are crossed by the line 
        let gridCells = markPoints(gridsize, trajectory[trajectory.length-2], trajectory[trajectory.length-1]);
        //console.log("Marked cells: ", gridCells);

        // Mark the new cells (not crossed by previous lines)
        for(var idx in gridCells){
            // Add to 'markedCells' and draw if it wasn't there
            if(!is_marked(markedCells, gridCells[idx])){
               markedCells.push(gridCells[idx]);

                let gridCoords = {
                    x: gridCells[idx].cellX * (gridsize),
                    y: gridCells[idx].cellY * (gridsize)
                }
                drawRect(gridCoords, gridsize, grid_colors[0]);
            }
        }
    }
}

// Checks if a cell is already marked
function is_marked(marked_cells, new_cell){
    // check existing cells
    for(var idx in marked_cells){
        if(marked_cells[idx].cellX === new_cell.cellX && marked_cells[idx].cellY === new_cell.cellY){
            // the cell is already marked, nothing to do
            return true;
        }
    }

    return false;
}

function drawRect(cornerCoords, side, color){
    ctx.fillStyle = color;
    ctx.fillRect(cornerCoords.x, cornerCoords.y, side, side);
}

function drawLine(from, to, color){
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawPoint(pointCoords, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pointCoords.x, pointCoords.y, pointRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawGrid(gridsize, which){

    if(which == undefined){ which = GRID_PRIMARY; }

    let gridOffset = (which == 1) ? 0 : gridsize/2;

    ctx.strokeStyle = "#ddd";

    if(which == GRID_SECONDARY){
        ctx.setLineDash([10, 10]);
    }

    ctx.beginPath();
    
    // Vertical lines (sweep X coord)
    let x = gridOffset;
    while(x < canvasWidthPx){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeightPx);
        x += gridsize;
    }
    // Horizontal lines (sweep Y coord)
    let y = gridOffset;
    while(y < canvasHeightPx){
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidthPx, y);
        y += gridsize;
    }
    ctx.stroke();
}