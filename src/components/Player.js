import {Playground} from './Playground.js';
import {DotShip} from './Ship.js';
import {LineShip} from './Ship.js';
import {SquareShip} from './Ship.js';
import {TriangleShip} from './Ship.js';

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
		//target - {iTarget: value, jTarget: value}
		this.primaryTargets = [];//shoot them first
		this.secondaryTargets = [];//other targets
		//shoots - {iShoot: coordinate, jShoot: coordinate, result: shipID || 0 - shoot result}
		this.shoots = [];//shoots stack for hunting ship
		this.targetedShip = 0;//ship for hunting
		//fill targets arrays
		for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
			for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
				let k = Math.abs(i - j) % 3;
				if (!k){
					//this is a primary target
					this.primaryTargets.push({iTarget: i, jTarget: j});
				} else {
					//this is a secondary target
					this.secondaryTargets.push({iTarget: i, jTarget: j});
				}
			}
		}
	}
	
	checkNearbyCellsForTarget(obj){
		let id = 0;
		for (id = 0; id < this.primaryTargets.length; id++)
		{
			let {iTarget, jTarget} = this.primaryTargets[id];
			if (iTarget === obj.iTarget && jTarget === obj.jTarget) {
				break;
			}
		}
		
		if (id < this.primaryTargets.length){
			this.primaryTargets.splice(id, 1);
			return true;
		}
		
		for (id = 0; id < this.secondaryTargets.length; id++)
		{
			let {iTarget, jTarget} = this.secondaryTargets[id];
			if (iTarget === obj.iTarget && jTarget === obj.jTarget) {
				break;
			}
		}
		
		if (id < this.secondaryTargets.length){
			this.secondaryTargets.splice(id, 1);
			return true;
		}
		
		return false;
	}
	
	findTarget() {

		let objTarget = [{iTarget: -1, jTarget: -1}];
		
		//check if there is a targeted ship
		if (this.targetedShip) {
			//hunt wounded ship
			//get all cells that was shooted
			let cells = this.shoots.filter(item => {
				if (item.result === this.targetedShip) {
					return true;
				}
				return false;
			});
			
			//find nearby cells that was not shooted
			for (let i = 0; i < cells.length; i++){
				let {iTarget, jTarget} = cells[i];
				//check top cell
				if (iTarget > 0) {
					let obj = {iTarget: iTarget - 1, jTarget: jTarget};
					if (this.checkNearbyCellsForTarget(obj)){
						return obj;
					}
				}
				//check bottom cell
				if (iTarget < PLAYGROUND_HEIGHT - 1) {
					let obj = {iTarget: iTarget + 1, jTarget: jTarget};
					if (this.checkNearbyCellsForTarget(obj)){
						return obj;
					}
				}
				//check left cell
				if (jTarget > 0) {
					let obj = {iTarget: iTarget, jTarget: jTarget - 1};
					if (this.checkNearbyCellsForTarget(obj)){
						return obj;
					}
				}
				//check rightt cell
				if (jTarget < PLAYGROUND_WIDTH - 1) {
					let obj = {iTarget: iTarget, jTarget: jTarget + 1};
					if (this.checkNearbyCellsForTarget(obj)){
						return obj;
					}
				}
			}
		}
		
		//select one of primary targets
		if (this.primaryTargets.length) {
			const randomTarget = Math.floor(Math.random * this.primaryTargets.length);
			objTarget = this.primaryTargets.splice(randomTarget, 1);
			return objTarget[0];
		}
		
		//select one of secondary targets
		if (this.secondaryTargets.length) {
			const randomTarget = Math.floor(Math.random * this.secondaryTargets.length);
			objTarget = this.secondaryTargets.splice(randomTarget, 1);
			return objTarget[0];
		}
		
		//if no targets return error
		return objTarget[0];
	}
	
	//clear all shoots on this ship 
	//ship destroyed
	clearShoots(shipID) {
		this.shoots = this.shoots.map(item => {
			if (item.result === shipID) {
				item.result = 0;
			}
			return item;
		});
	}
	
	clearTargetsArray(arr, i, j){
		return arr.filter(item => {
			//top cell
			if (item.iTarget === i - 1 && item.jTarget === j) {
				return false;
			} 

			//right cell
			if (item.iTarget === i && item.jTarget === j + 1) {
				return false;
			} 

			//bottom cell
			if (item.iTarget === i + 1 && item.jTarget === j) {
				return false;
			} 

			//left cell
			if (item.iTarget === i && item.jTarget === j - 1) {
				return false;
			} 
			return true;
		});	
	}
	
	//remove near cells from targets arrays
	//ship destroyed
	clearVisibleAreaAroundShip(ship){
		//get shape
		const shape = ship.getShape();
		const width = ship.getWidth();
		const height = ship.getHeight();
		
		for (let i = 0; i < height; i++){
			for (let j = 0; j < width; j++){
				if (shape[i][j] === 1) {
					//clear primaryTargets
					this.primaryTargets = this.clearTargetsArray(this.primaryTargets, i, j);
					
					//clear secondaryTargets
					this.secondaryTargets = this.clearTargetsArray(this.secondaryTargets, i, j);
				}
			}
		}
	}
	
	//main turn procedure
	makeTurn(player) {
		if (!player) return false;
		//find target and decrease targets stack
		const {iTarget, jTarget} = this.findTarget();
		
		//check that has target 
		if (iTarget === -1 || jTarget === -1) {
			return false;
		}
		
		//make shoot
		player.playground.increaseValue(iTarget, jTarget, ONE_SHOOT);
		
		//recognize target
		let data = player.playground.getFieldElement(iTarget, jTarget);
		
		//check if missed
		if (data === 1 + ONE_SHOOT) {
			//remember shoot
			this.shoots.unshift({iTarget: iTarget, jTarget: jTarget, result: 0});
			return false;
		}
		
		
		//check if it is ship
		if (data > 1 + ONE_SHOOT*2 && data < ONE_SHOOT * 3) {
			//get wounded ship ID
			const shipID = data % ONE_SHOOT - 2;
			//get wounded ship
			const ship = player.playground.getShips()[shipID];
			
			//remember good shoot for hunting
			this.shoots.unshift({iTarget: iTarget, jTarget: jTarget, result: shipID});
			this.targetedShip = shipID;

			
			if (!ship.hitShip()) {
				//clear all shoots on this ship 
				//ship destroyed
				this.clearShoots(shipID);
				
				this.targetedShip = 0;
				
				//destroy ship
				player.playground.destroyShip(shipID);
				
				//remove near cells from targets arrays
				this.clearVisibleAreaAroundShip(ship);
			}
			return true;//human miss it's turn
		}
		
		return false;
	}
	
}


//for human player
export class HumanPlayer extends Player{
	//main turn procedure
	makeTurn(player, i0, j0) {
		if (!player) return false;
		
		let data = player.playground.getFieldElement(i0, j0);
		
		//already shoot here
		if (data === ONE_SHOOT) return true;
		
		//it's destroyed ship
		if (data >= ONE_SHOOT * 3) return true;
		
		player.playground.increaseValue(i0, j0, ONE_SHOOT);
		
		player.playground.clearFog(i0, j0);
		
		//check if player missed
		if (data === 1) {
			return false;
		}
		
		//determine the ship player shooted
		const shipID = data % ONE_SHOOT - 2;
		const ship = player.playground.getShips()[shipID];
		
		//ship was damaged
		if (data > 0) {
			//hit ship & check it
			if (!ship) return false;
			if (!ship.hitShip()) {
				//destroy ship
				player.playground.destroyShip(shipID);
				player.playground.clearFogAroundShip(shipID);
			}
			
			//bot skips its turn
			return true;
		}
		return false;
	}
}