import {ONE_SHOOT} from './Player.js';

export const PLAYGROUND_WIDTH = 10;
export const PLAYGROUND_HEIGHT = 10;

export class Playground {
	constructor (width, height) {
		this.width = width;
		this.height = height;
		this.ships = [];
		this.field = [];
		this.fogArea = [];
		for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
			this.fogArea[i] = [];
			for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
				this.fogArea[i][j] = 0;
			}
		}
	}
	
	getWidth(){
		return this.width;
	}
	
	getHeight(){
		return this.height;
	}
	
	getShips(){
		return this.ships;
	}
	
	addShip(ship){
		this.ships.push(ship);
	}
	
	destroyShip(shipID){
		for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
			for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
				if (this.field[i][j] % ONE_SHOOT -2 === shipID) {
					//found destoyed ship
					if (this.field[i][j] < ONE_SHOOT*3){
						this.field[i][j] += ONE_SHOOT;
					}
				}
			}
		}
	}
	
	getFogArea() {
		return this.fogArea;
	}
	
	//clear fog in one cell
	clearFog(i0, j0) {
		if (i0 < 0 || i0 >= PLAYGROUND_WIDTH 
			|| j0 < 0 || j0 >= PLAYGROUND_HEIGHT ) {
			return false;
		}
		this.fogArea[i0][j0] = 1;
	}
	
	//clears fog around destroyed ship
	clearFogAroundShip(shipID) {
		for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
			for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
				if (this.field[i][j] % ONE_SHOOT -2 === shipID) {
					//found destoyed ship
					//lets clear fog around it
					if (i > 0) {
						this.fogArea[i - 1][j] = 1;
					}
					if (i < PLAYGROUND_HEIGHT-1) {
						this.fogArea[i + 1][j] = 1;
					}
					if (j > 0) {
						this.fogArea[i][j - 1] = 1;
					}
					if (j < PLAYGROUND_WIDTH-1) {
						this.fogArea[i][j + 1] = 1;
					}
				}
			}
		}
	}
	
	//returns true if there is something
	//in nearby cells
	checkArea(y, x){
		let i = 0;
		let j = 0;
		
		if (y < 0 || y > this.height || x < 0 || x > this.width) {
			//out of field
			return true;
		}
		
		j = x;
		for (i = y-1; i <= y+1; i++) {
			if (i >= 0 && i < this.height){ 
				if (this.field[i][j] !== 1) {
					return true;
				}
			}
		}
		
		i = y;
		
		for (j = x-1; j <= x+1; j++) {
			if (j >= 0 && j < this.width 
				&& this.field[i][j] !== 1) {
				return true;
			}
		}
		return false;
	}
	
	//check if can place ship
	//with left-top corner coordinates x,y
	checkCell(ship, y, x){
		//ship parameters
		const shipShape = ship.getShape();
		const shipWidth = ship.getWidth();
		const shipHeight = ship.getHeight();
		
		for (let i = 0; i < shipHeight; i++) {
			for (let j = 0; j < shipWidth; j++) {
				if (shipShape[i][j] !== 0 &&
					this.checkArea(i + y, j + x)) {
					return false;
				}
			}
		}
		return true;
	}
	
	//find random good place to set ship
	//if there is no enough space - returns {i:-1;j:-1}
	
	findPlaceForShip(ship){
		const width = ship.getWidth();
		const height = ship.getHeight();
		//max possible value for left-top ship corner
		const maxX = this.getWidth() - width + 1;
		const maxY = this.getHeight() - height + 1;
		let goodCells = [];
		
		//get all good cells for setting ship
		for (let i =0; i < maxY; i++){
			for (let j = 0; j < maxX; j++){
				if (this.checkCell(ship, i, j)) {
					goodCells.push({i:i, j:j});
				}
			}
		}
		
		//default value for bad result
		let randomCell = {i:-1, j:-1};
		
		if (goodCells.length) {
			randomCell = goodCells[
				Math.floor(Math.random()*
				goodCells.length)];
		}
		//console.log(goodCells);
		
		return randomCell;
	}
	
	cleanField(){
		for (let i = 0; i < this.width; i++) {
			this.field[i] = [];
			for (let j =0; j < this.height; j++) {
				this.field[i][j] = 1;//water
			}
		}
	}
	
	getFieldElement(i0, j0){
		if (i0 < 0 || i0 >= PLAYGROUND_WIDTH 
			|| j0 < 0 || j0 >= PLAYGROUND_HEIGHT ) {
			return false;
		}
		return this.field[i0][j0];
	}
	
	//set all ships from ships[] on field
	//if there is no good way - returns false
	//if ships set OK - returns true
	setShipsOnField(){
		this.cleanField();
		let counter = 1;//ship counter
		
		this.ships.forEach(item => {
			counter++;
			//rotate ship random times (0-3)
			let rotateCount = Math.floor(Math.random() * 4);
			for (let i = 0; i < rotateCount; i++){
				item.rotate();
			}
			
			//find place for ship
			const {i, j} = this.findPlaceForShip(item);
			if (i === -1 || j === -1) return false;
			
			let width = item.getWidth();
			let height = item.getHeight();
			
			//place ship
			for (let j1 = 0; j1 < width; j1++) {
				for (let i1 =0; i1 < height; i1++) {
					if (item.shape[i1][j1] !== 0) {
						this.field[i + i1][j + j1] = item.shape[i1][j1] * 100 + counter;
					}
				}
			}
		});
		return true;
	}
	
	getField(){
		return this.field;
	}
	
	//increase one cell value
	increaseValue(i0, j0, value) {
		if (i0 < 0 || i0 >= PLAYGROUND_WIDTH 
			|| j0 < 0 || j0 >= PLAYGROUND_HEIGHT ) {
			return false;
		}
		this.field[i0][j0] += value;
	}	
}