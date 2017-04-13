function markPoints(gridSize, from, to){

    console.log("MarkPoints running...");

    p = gridSize;
    startPoint = [from.x, from.y, from.cellX, from.cellY];
    endPoint = [to.x, to.y, to.cellX, to.cellY];

    markedGridCells = [];

	// switch start & endPoint if startX > endX
	if(from.x > to.x){
        startPoint = [to.x, to.y, to.cellX, to.cellY];
        endPoint = [from.x, from.y, from.cellX, from.cellY];
	}

	var startPointCoords = [startPoint[2], startPoint[3]];
	var endPointCoords = [endPoint[2], endPoint[3]];

    //console.log("Start coords: ", startPointCoords);
    //console.log("End coords: ", endPointCoords);

	/*
	 * Border cases
	 */

	// Vertical line, constant X coord
	if(from.cellX === to.cellX){

        var startY, endY;
        if(from.cellY < to.cellY){ startY = from.cellY; endY = to.cellY; }
        else{ startY = to.cellY; endY = from.cellY; } 

		for(startY ; startY<=endY ; startY++){
            markedGridCells.push({cellX: from.cellX, cellY: startY});
		}
	}
	// Horizontal line, constant Y coord
	else if(from.cellY === to.cellY){
        var startX, endX;
        if(from.cellX < to.cellX){ startX = from.cellX; endX = to.cellX; }
        else{ startX = to.cellX; endX = from.cellX; } 

		for(startX ; startX<=endX ; startX++){
            markedGridCells.push({cellX: startX, cellY: from.cellY});
		}
    
	}
    else{

	// non-border case

	/*
	http://stackoverflow.com/questions/3233522/elegant-clean-special-case-straight-line-grid-traversal-algorithm

	@inproceedings{amanatides1987fast,
	  title={A fast voxel traversal algorithm for ray tracing},
	  author={Amanatides, John and Woo, Andrew and others},
	  booktitle={Proceedings of EUROGRAPHICS},
	  volume={87},
	  pages={3--10},
	  year={1987}
	}

	1. Given two points A and B, determine the intersection points of the line (A, B) with every vertical line of Your grid, that lies within this interval.
	2. Insert two special intersection points inside the cells containing A and B at the start/end of the list from point 1
	3. Interpret every two sequent intersection points as the min and max vectors of a axis aligned rectangle and mark all grid cells that
	   lie inside this rectangle (this is very easy (intersection of two axis aligned rects), especially considering, that the rectangle has a
	   width of 1 and therefore occupies only 1 column of Your grid)

		+------+------+------+------+
		|      |      |      |      |
		|      |      | B    *      |
		|      |      |/     |      |
		+------+------*------+------+
		|      |     /|      |      |
		|      |    / |      |      |
		|      |   /  |      |      |
		+------+--/---+------+------+
		|      | /    |      |      |
		|      |/     |      |      |
		|      *      |      |      |
		+-----/+------+------+------+
		|    / |      |      |      |
		*   A  |      |      |      |
		|      |      |      |      |
		+------+------+------+------+

	*/




	var dx = endPoint[0] - startPoint[0];
	var dy = endPoint[1] - startPoint[1];
	var slope = dy / dx;

	//console.log("dx: " + dx + ", dy: " + dy + ", abs(dx): " + Math.abs(dx));
	//console.log("X shift: " + sign(dx));
	//console.log("Y shift: " + sign(dy));
	//console.log("slope: " + slope);

	var helperPoints = [];

	// first special point
	helperPoints.push([
		startPointCoords[0]*p,
		startPoint[1]
		]);

	// loop all vertical lines between startPoint and endPoint

	// calculate smaller and larger X
	var startXCoord = startPointCoords[0];
	var endXCoord = endPointCoords[0];

	for(startXCoord ; startXCoord < endXCoord ; startXCoord++){
		//console.log("startX: " + startXCoord);

		var currentDx = (startXCoord + 1)*p - startPoint[0];
		var y = (slope * currentDx) + startPoint[1];

		// mark the cells of current rectangle
		var previousYCoord = Math.floor(helperPoints[helperPoints.length - 1][1]/p);
		var currentYCoord = Math.floor(y / p);

		// flip previousY and currentY if current > prev
		if(currentYCoord > previousYCoord){
			var tmp = currentYCoord;
			currentYCoord = previousYCoord;
			previousYCoord = tmp;
		}

		//console.log("Y index range: " + currentYCoord + " -> " + previousYCoord);

		for(currentYCoord ; currentYCoord <= previousYCoord ; currentYCoord++){
			//fillField([startXCoord, currentYCoord]);
            markedGridCells.push({cellX: startXCoord, cellY: currentYCoord});
		}
		//console.log("");

		helperPoints.push([
			(startXCoord+1)*p,
			y
        ]);
	}

	// mark the cells of current rectangle
	var previousYCoord = Math.floor(helperPoints[helperPoints.length - 1][1]/p);
	var currentYCoord = Math.floor(endPoint[1]/p);
	

	// flip previousY and currentY if current > prev
	if(currentYCoord > previousYCoord){
		var tmp = currentYCoord;
		currentYCoord = previousYCoord;
		previousYCoord = tmp;
	}
        //console.log("prev Y: " + previousYCoord + ", current Y: " + currentYCoord);
	for(currentYCoord ; currentYCoord <= previousYCoord ; currentYCoord++){
		//fillField([endXCoord, currentYCoord]);
        markedGridCells.push({cellX: endXCoord, cellY: currentYCoord});
	}
	// last special point
	helperPoints.push([
		(endPointCoords[0]+1)*p,
		endPoint[1]
		]);


	// draw all helper points
	//for(var idx in helperPoints){
	//	drawHelperCircle(helperPoints[idx][0], helperPoints[idx][1]);
	//}
    }

    return markedGridCells
}