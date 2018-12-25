import React, { Component } from 'react';
import './App.css';
import {Field} from './components/Field.js';

const DOT_SHIP_SIZE = 1;
const SQUARE_SHIP_SIZE = 4;
const TRIANGLE_SHIP_SIZE = 4;
const PLAYGROUND_WIDTH = 10;
const PLAYGROUND_HEIGHT = 10;


class Ship {
    constructor(size) {
        this.size = size;//size in cells
		this.shape = [];//shape array
		this.shape[0] = [];
		this.isAlive = true;//true while ship is alive
		this.xCoordinate = 0;//X coordinate at field
		this.yCoordinate = 0;//Y coordinate at field
    }
    
	//how much cells does it contains
    getSize () {
        return this.size;
    }
	
	//set ship alive status to false
	destroyShip() {
		this.isAlive = false;
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
	
}

//minimal ship
class DotShip extends Ship {
	constructor() {
        super(DOT_SHIP_SIZE);
		this.shape = [[1]];		
    }	
}

//line ship
//for size 3 - ***
class LineShip extends Ship {
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
class SquareShip extends Ship {
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
class TriangleShip extends Ship {
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

class Playground {
	constructor (width, height) {
		this.width = width;
		this.height = height;
		this.ships = [];
		this.field = [];
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
				if (this.field[i][j] !== 0) {
					return true;
				}
			}
		}
		
		i = y;
		
		for (j = x-1; j <= x+1; j++) {
			if (j >= 0 && j < this.width 
				&& this.field[i][j] !== 0) {
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
				this.field[i][j] = 0;
			}
		}
	}
	
	//set all ships from ships[] on field
	//if there is no good way - returns false
	//if ships set OK - returns true
	setShipsOnField(){
		this.cleanField();
		
		this.ships.forEach(item => {
			//find place for ship
			const {i, j} = this.findPlaceForShip(item);
			if (i === -1 || j === -1) return false;
			
			let width = item.getWidth();
			let height = item.getHeight();
			
			//place ship
			for (let j1 = 0; j1 < width; j1++) {
				for (let i1 =0; i1 < height; i1++) {
					if (item.shape[i1][j1] !== 0) {
						this.field[i + i1][j + j1] += item.shape[i1][j1];
					}
				}
			}
		});
		return true;
	}
	
	//test only
	//-------------------------------
	placeShipXY(ship, x, y){
		let width = ship.getWidth();
		let height = ship.getHeight();
		
		this.cleanField();
		
		if (this.checkCell(ship, y, x)) {
		
			for (let i = 0; i < height; i++) {
				for (let j = 0; j < width; j++) {
					this.field[i+y][j+x] = ship.shape[i][j]; 
				}
			}
		}
			
	}
	
	checkDotShipAddition() {
		const ship = new DotShip();
		this.placeShipXY(ship, 3, 3);
		const ship2 = new DotShip();
		console.log('up-left ',this.checkCell(ship2, 2, 2));
		console.log('up ',this.checkCell(ship2, 2, 3));
		console.log('up-right ',this.checkCell(ship2, 2, 4));
		console.log('left ',this.checkCell(ship2, 3, 2));
		console.log('center ',this.checkCell(ship2, 3, 3));
		console.log('right ',this.checkCell(ship2, 3, 4));
		console.log('down-left ',this.checkCell(ship2, 4, 2));
		console.log('down ',this.checkCell(ship2, 4, 3));
		console.log('down-right ',this.checkCell(ship2, 4, 4));
		
	}
	//-----------------------------
	getField(){
		return this.field;
	}
}


class App extends Component {

	state = {
		name1 : 'T-800',
		name2 : 'Human',
		field1 : '',
		field2 : ''
	};
	
	initPlayground(field){
		
	}
	

	onClickStartButton = () => {
		const field1 = new Playground(PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT);
		const ship1 = new LineShip(5);
		field1.addShip(ship1);
		const ship2 = new TriangleShip();
		field1.addShip(ship2);
		const ship3 = new SquareShip();
		field1.addShip(ship3);
		
		let threeCellsShipsArr = [];
		for (let i = 0; i < 3; i++) {
			threeCellsShipsArr.push(new LineShip(3));
			field1.addShip(threeCellsShipsArr[i]);
		}
		
		let twoCellsShipsArr = [];
		for (let i = 0; i < 4; i++) {
			twoCellsShipsArr.push(new LineShip(2));
			field1.addShip(twoCellsShipsArr[i]);
		}
		
		let dotShipsArr = [];
		for (let i = 0; i < 5; i++) {
			dotShipsArr.push(new DotShip());
			field1.addShip(dotShipsArr[i]);
		}
		
		if (!field1.setShipsOnField()) {
			console.log('No space for Dot Ship');
		}
		this.setState({field1:field1.getField()});
		
		
		
	}
	
	
  render() {
    return (
      <div className="App">
		<header className='App__header'>Battleships</header>  
        <div onClick={this.onClickStartButton} className='App__start_button'>Start</div>
		
		<div className='App__main'>
			<div className='App__playground'>
				<div className='App__player_name'>{this.state.name1}</div>
				{this.state.field1 &&
					<Field data={this.state.field1} field={1}/>
				}
			</div>
			<div className='App__playground'>
				<div className='App__playerName'>{this.state.name2}</div>
				{this.state.field2 &&
					<Field data={this.state.field2} field={2}/>
				}
			</div>
		</div>  
      </div>
    );
  }
}

export default App;
