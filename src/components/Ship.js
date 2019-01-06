const DOT_SHIP_SIZE = 1;
const SQUARE_SHIP_SIZE = 4;
const TRIANGLE_SHIP_SIZE = 4;

export class Ship {
    constructor(size) {
        this.size = size;//size in cells
		this.shape = [];//shape array
		this.shape[0] = [];//shape of ship
		this.isAlive = true;//true while ship is alive
		this.xCoordinate = 0;//X coordinate at field
		this.yCoordinate = 0;//Y coordinate at field
		this.lives = size;//will reduce until destroy
    }
    
	//how much cells does it contains
    getSize () {
        return this.size;
    }
	
	//if someone wounded ship
	//returns alive status of ship
	hitShip() {
		//console.log(this.lives);
		if (!--this.lives) {
			//console.log(this.lives);
			this.isAlive = false;
		}
		return this.isAlive;
	}
	
	//is ship still alive
	getLiveStatus() {
		return this.isAlive;
	}
	
	getShape() {
		return this.shape;
	}
	
	getHeight() {
		return this.shape.length;
	}
	
	getWidth() {
		return this.shape[0].length;
	}
	
	setCoordinates(x, y) {
		this.xCoordinate = x;
		this.yCoordinate = y;
	}
	
	getXCoordinate() {
		return this.xCoordinate;
	}
	
	getYCoordinate() {
		return this.yCoordinate;
	}
	
	//rotate ship counter-clockwise for 90 degrees
	rotate() {
		let width = this.getWidth();
		let height = this.getHeight();
		
		//make a rotate copy of shape
		let arr = [];
		for (let i = 0; i < width; i++) {
			arr[i] = [];
			for (let j = 0; j < height; j++) {
				arr[i][j] = this.shape[j][width-i-1];
			}
		}
		
		//set shape to new state
		this.shape = arr;
	}
}

//minimal ship
export class DotShip extends Ship {
	constructor() {
        super(DOT_SHIP_SIZE);
		this.shape = [[1]];		
    }	
}

//line ship
//for size 3 - ***
export class LineShip extends Ship {
	constructor(size) {
        super(size);
		this.shape[0] = [];
		for (let i = 0; i < size; i++) {
			this.shape[0][i] = 1;		
		}
    }	
}

//square ship
// **
// **
export class SquareShip extends Ship {
	constructor() {
        super(SQUARE_SHIP_SIZE);
		this.shape[0] = [];
		this.shape[1] = [];
		
		for (let i = 0; i < 2; i++) {
			this.shape[0][i] = 1;
			this.shape[1][i] = 1;			
		}
    }	
}

//triangle ship
//  *
// ***
export class TriangleShip extends Ship {
	constructor() {
        super(TRIANGLE_SHIP_SIZE);
		this.shape[0] = [];
		this.shape[1] = [];
		
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 3; j++) {
				this.shape[i][j] = 1;		
			}
		}
		this.shape[0][0] = 0;
		this.shape[0][2] = 0;

    }	
}
