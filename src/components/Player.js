import {Playground} from './Playground.js';
import {DotShip} from './Ship.js';
import {LineShip} from './Ship.js';
import {SquareShip} from './Ship.js';
import {TriangleShip} from './Ship.js';
//import {Field} from './Field.js';

import {PLAYGROUND_WIDTH} from './Playground.js';
import {PLAYGROUND_HEIGHT} from './Playground.js';

export const ONE_SHOOT = 100; //incresing cell value for each shoot

//name - player name
//playground - playground according to player
//shoots - log of shoots maden
class Player {
	constructor (name) {
		this.name = name;
		this.playground = '';
		this.shoots = [];//cells that he shooted
	}
	
	initPlayground() {
		this.playground = new Playground(PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT);
		const ship1 = new LineShip(5);
		this.playground.addShip(ship1);
		const ship2 = new TriangleShip();
		this.playground.addShip(ship2);
		const ship3 = new SquareShip();
		this.playground.addShip(ship3);
		
		let threeCellsShipsArr = [];
		for (let i = 0; i < 3; i++) {
			threeCellsShipsArr.push(new LineShip(3));
			this.playground.addShip(threeCellsShipsArr[i]);
		}
		
		let twoCellsShipsArr = [];
		for (let i = 0; i < 4; i++) {
			twoCellsShipsArr.push(new LineShip(2));
			this.playground.addShip(twoCellsShipsArr[i]);
		}
		
		let dotShipsArr = [];
		for (let i = 0; i < 5; i++) {
			dotShipsArr.push(new DotShip());
			this.playground.addShip(dotShipsArr[i]);
		}
		
		if (!this.playground.setShipsOnField()) {
			console.log('No space for Dot Ship');
		}
		return this.playground;
	}
	
	getPlayground() {
		return this.playground;
	}
}


//implemenets logic of bot
export class BotPlayer extends Player{
	constructor (name) {
		super(name);
		this.primaryTargets = [];//shoot them first
		this.secondaryTargets = [];
	}
}


//for human player
export class HumanPlayer extends Player{
	constructor (name) {
		super(name);
	}
	
	makeTurn(player, i0, j0) {
		if (!player) return false;
		
		let data = player.playground.getFieldElement(i0, j0);
		
		//already shoot here
		if (data === ONE_SHOOT) return false;
		
		//it's destroyed ship
		if (data >= ONE_SHOOT * 3) return false;
		
		player.playground.increaseValue(i0, j0, ONE_SHOOT);
		
		player.playground.clearFog(i0, j0);
		
		//check if player missed
		if (data === 1) {
			//console.log('You missed');
			return true;
		}
		
		//determine the ship player shooted
		const shipID = data % ONE_SHOOT - 2;
		const ship = player.playground.getShips()[shipID];
		
		//ship was damaged
		if (data > 0) {
			//hit ship & check it
			if (!ship.hitShip()) {
				//destroy ship
				player.playground.destroyShip(shipID);
				player.playground.clearFogAroundShip(shipID);
			}
			
			//bot skips its turn
			return false;
		}
		return true;
	}
}