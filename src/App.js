import React, { Component } from 'react';
import './App.css';
import {Field} from './components/Field.js';
/*import {Playground} from './components/Playground.js';
import {DotShip} from './components/Ship.js';
import {LineShip} from './components/Ship.js';
import {SquareShip} from './components/Ship.js';
import {TriangleShip} from './components/Ship.js';
*/
//import {Player} from './components/Player.js';
import {BotPlayer} from './components/Player.js';
import {HumanPlayer} from './components/Player.js';
import {PLAYGROUND_WIDTH} from './components/Playground.js';
import {PLAYGROUND_HEIGHT} from './components/Playground.js';
import bot from './images/bot.png';
import human from './images/human.png';


class App extends Component {

	state = {
		name1 : '',
		name1Status: true,
		name2 : '',
		name2Status: true,
		field1 : '',
		field2 : '',
		player1 : '',
		player2 : '',
		gameStarted: false
	};
	
	handleOnClickCell = (obj) => {
		const {i0, j0, id} = obj;
		const {player1, player2} = this.state;
		const fieldNumber = Math.floor(id/1000);
		if (fieldNumber !== 1 && fieldNumber !== 2) {
			return false;
		}
		
		if (fieldNumber === 1) {
			player2.makeTurn(player1, i0, j0);
			this.setState({player1:player1});
		}
		return true;
	}

	//validate player's names
	validate = () => {
		let error = 0;
        let {name1, name2} = this.state;
        name1 = name1.trim();
        name2 = name2.trim();
        
        if (!name1) {
            this.setState({name1Status: false});
            error += 1;
        } else {
            this.setState({name1Status: true});
        }
        
        if (!name2) {
            this.setState({name2Status: false});
            error += 2;
        } else {
            this.setState({name2Status: true});
        }
        //if (error > 0) return false;
		return true;
	}

	//validate names and place ships
	onClickStartButton = () => {
		
		if (!this.validate()) return false;
		
		const player1 = new BotPlayer(this.state.name1);
		const player2 = new HumanPlayer(this.state.name2);
		
		this.setState({player1 : player1});
		this.setState({player2 : player2});
		
		const field1 = player1.initPlayground();
		this.setState({field1: field1.getField()});
		this.setState({gameStarted: true});
		
		const field2 = player2.initPlayground();
		this.setState({field2: field2.getField()});
		this.setState({gameStarted: true});
		
	}
	
	handleChange = (event) => {
        const {id, value} = event.currentTarget;
        this.setState({[id]: value});
    }
	
  	render() {
		const {name1, name2, name1Status, name2Status, field1, field2, gameStarted, player1} = this.state;
		let fieldWithFog = [];
		
		if (player1) {
			
			const playground = player1.getPlayground();
			const fogArea = playground.getFogArea();
			
			for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
				fieldWithFog[i] = [];
				for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
					fieldWithFog[i][j] = field1[i][j] * fogArea[i][j];
				}
			}
		//	console.log('fog', fogArea);
		//	console.log('field1', field1);
		//			console.log('field',fieldWithFog);
		}
		
		//optimize it
		//show water on second playground instead of fog
	/*	if (player1){
			for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
				for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
					if (field2[i][j]===0) field2[i][j] = 1;
				}
			}
		}*/
		
		return (
		  <div className="App">
			<header className='App__header'>Battleships</header> 
			
			<div onClick={this.onClickStartButton} className='App__start_button'>Start</div>
			
			<div className='App__main'>
				<div className='App__playground'>
					<div className='App__player_name_block'>
						<img src={bot} alt='bot'/>
						{!gameStarted &&
							<input 
								type='text'
								id = 'name1'
								className={(name1Status && 'App__player_name_input') || (!name1Status && 'App__player_name_input_error')}
								value = {name1}
								onChange = {this.handleChange}
								autoFocus={true}
								placeholder='Enter bot name'
							/>
						}
						{gameStarted && <div className='App__player_name'>{name1}</div>}
					 </div>
					{field1 &&
						<Field data={fieldWithFog} field={1} onClickCell={this.handleOnClickCell}/>
					}
				</div>
				
				<div className='App__playground'>
					<div className='App__player_name_block'>
						<img src={human} alt='bot'/>
						{!gameStarted &&
							<input 
								type='text'
								id = 'name2'
								className={(name2Status && 'App__player_name_input') || (!name2Status && 'App__player_name_input_error')}
								value = {name2}
								onChange = {this.handleChange}
								placeholder='Enter player name'
							/>
						}
						{gameStarted && <div className='App__player_name'>{name2}</div>}
					 </div>
					{field2 &&
						<Field data={field2} field={2} onClickCell={this.handleOnClickCell}/>
					}
				</div>
			</div>  
		  </div>
		);
  }
}

export default App;
