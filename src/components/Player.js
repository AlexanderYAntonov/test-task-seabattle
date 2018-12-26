import {Playground} from './Playground.js';
import {DotShip} from './Ship.js';
import {LineShip} from './Ship.js';
import {SquareShip} from './Ship.js';
import {TriangleShip} from './Ship.js';
//import {Field} from './Field.js';

import {PLAYGROUND_WIDTH} from './Playground.js';
import {PLAYGROUND_HEIGHT} from './Playground.js';

class Player {
	constructor (name) {
		this.name = name;
		this.playground = '';
		this.shoots = [];//cells that he shooted
	}
	
	initPlayground() {
		const field = new Playground(PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT);
		const ship1 = new LineShip(5);
		field.addShip(ship1);
		const ship2 = new TriangleShip();
		field.addShip(ship2);
		const ship3 = new SquareShip();
		field.addShip(ship3);
		
		let threeCellsShipsArr = [];
		for (let i = 0; i < 3; i++) {
			threeCellsShipsArr.push(new LineShip(3));
			field.addShip(threeCellsShipsArr[i]);
		}
		
		let twoCellsShipsArr = [];
		for (let i = 0; i < 4; i++) {
			twoCellsShipsArr.push(new LineShip(2));
			field.addShip(twoCellsShipsArr[i]);
		}
		
		let dotShipsArr = [];
		for (let i = 0; i < 5; i++) {
			dotShipsArr.push(new DotShip());
			field.addShip(dotShipsArr[i]);
		}
		
		if (!field.setShipsOnField()) {
			console.log('No space for Dot Ship');
		}
		return field;
	}
}

export class BotPlayer extends Player{
	constructor (name) {
		super(name);
		this.primaryTargets = [];//shoot them first
		this.secondaryTargets = [];
	}
}

export class HumanPlayer extends Player{
	constructor (name) {
		super(name);
		this.primaryTargets = [];//shoot them first
		this.secondaryTargets = [];
	}
}