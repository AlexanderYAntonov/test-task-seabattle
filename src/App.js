import React, { Component } from 'react';
import './App.css';
import {Field} from './components/Field.js';

const DOT_SHIP_SIZE = 1;
const SQUARE_SHIP_SIZE = 4;
const TRIANGLE_SHIP_SIZE = 4;

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
	
	getShips(){
		return this.ships;
	}
	
	addShip(ship){
		this.ships.push(ship);
	}
	
	findPlaceForShip(ship){
		return {x:Math.floor(Math.random()*7),y:Math.floor(Math.random()*7)};
	}
	
	cleanField(){
		for (let i = 0; i < this.width; i++) {
			this.field[i] = [];
			for (let j =0; j < this.height; j++) {
				this.field[i][j] = 0;
			}
		}
	}
	
	setShipsOnField(){
		this.cleanField();
		//fix thisplace to forEach
		//for (let s = 0; s < this.ships.length; s++) {
			//const item = this.ships[s];
		this.ships.forEach(item => {
			const {x, y} = this.findPlaceForShip(item);
			
			let width = item.getWidth();
			let height = item.getHeight();
			
			for (let j = 0; j < width; j++) {
				for (let i =0; i < height; i++) {
					if (item.shape[i][j]) {
						this.field[x + i][y + j] += item.shape[i][j];
					}
				}
			}
		});
		//}	
	}
	
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
	
	onClickStartButton = () => {
		const someShip = new TriangleShip();
		const field = new Playground(10, 10);
		field.addShip(someShip);
		const ship2 = new SquareShip();
		field.addShip(ship2);
		const ship3 = new LineShip(3);
		field.addShip(ship3);
		field.setShipsOnField();
		this.setState({field1:field.getField()});
		
		const ship4 = new TriangleShip();
		const field2 = new Playground(10, 10);
		field2.addShip(ship4);
		const ship5 = new DotShip();
		field2.addShip(ship5);
		const ship6 = new LineShip(2);
		field2.addShip(ship6);
		field2.setShipsOnField();
		this.setState({field2:field2.getField()});
		
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
					<Field data={this.state.field1}/>
				}
			</div>
			<div className='App__playground'>
				<div className='App__playerName'>{this.state.name2}</div>
				{this.state.field2 &&
					<Field data={this.state.field2}/>
				}
			</div>
		</div>  
      </div>
    );
  }
}

export default App;
