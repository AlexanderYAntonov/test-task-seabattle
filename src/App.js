import React, { Component } from 'react';
import './App.css';
import {Field} from './components/Field.js';
import {Win} from './components/Win.js';
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
		gameStarted: false, 
		turn : '',
		win: ''
	};
	
	checkGameOver(player, name){
		const playgroud = player.getPlayground();
		if (playgroud && name) {
			let ships = playgroud.getShips();
			ships = ships.filter(item => item.getLiveStatus());

			//if player wins stop making turns
			if (!ships.length) {
				this.setState({win: name, gameStarted: false});
			}
		}
	}

	handleOnClickCell = (obj) => {
		const {i0, j0, id} = obj;
		const {player1, player2} = this.state;
		const fieldNumber = Math.floor(id/1000);
		if (fieldNumber !== 1 && fieldNumber !== 2) {
			return false;
		}
		
		if (fieldNumber === 1) {
			//human turn
			const humanResult = player2.makeTurn(player1, i0, j0);
			this.setState({player1:player1});
			
			//check if human wins
			this.checkGameOver(player1, 'Human');
			
			//bot turn
			if (!humanResult) {
				let result = true;
				this.setState({turn:'Bot'});
				while (result){
					result = player1.makeTurn(player2);
						this.setState({player2:player2})
				}
			}
			
			//check if bot wins
			this.checkGameOver(player2, 'Bot');
						
			this.setState({turn : 'Human'});
		}
		return true;
	}

	setNameStatus(name, statusID){
		name = name.trim();
        if (!name) {
            this.setState({[statusID]: false});
        } else {
            this.setState({[statusID]: true});
        }
		return name;
	}
	
	//validate player's names
	validate = () => {
        let {name1, name2} = this.state;
		name1 = this.setNameStatus(name1, 'name1Status');
		name2 = this.setNameStatus(name2, 'name2Status');
       		
		//human turn is first
		if (name1 && name2) {
			this.setState({turn: 'Human', gameStarted: true});
			return true;
		}
		return false;
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
		
		const field2 = player2.initPlayground();
		this.setState({field2: field2.getField()});
		
	}
	
	handleChange = (event) => {
        const {id, value} = event.currentTarget;
        this.setState({[id]: value});
    }
	
	handleClickOK = () => {
		this.setState({name1 : '',
			name1Status: true,
			name2 : '',
			name2Status: true,
			field1 : '',
			field2 : '',
			player1 : '',
			player2 : '',
			gameStarted: false, 
			turn : '',
			win: ''
		});
	}
	
  	render() {
		const {name1, name2, name1Status, name2Status, field1, field2, gameStarted, player1, turn, win} = this.state;
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
		}
			
		return (
		  <div className="App">
			<header className='App__header'>Battleships</header> 
			
			{win === '' && <div onClick={this.onClickStartButton} className='App__start_button'>Start</div>}

			{win === '' &&<div className='App__main'>
					
				<div className='App__playground'>
					<div className={(turn !== 'Bot' && 'App__player_name_block') || ((turn === 'Bot' && 'App__player_name_block App__turn'))}>
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
					<div className={
						(turn === 'Human' && 'App__player_name_block App__turn') || ((turn !== 'Human' && 'App__player_name_block'))}>
						<img src={human} alt='human'/>
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
						{ 
							gameStarted && <div className='App__player_name'>{name2}
							</div>
						}
					 </div>
					{field2 &&
						<Field data={field2} field={2} onClickCell={this.handleOnClickCell}/>
					}
				</div>

			</div>
			}
			{win !== '' && <Win winner={win} onClickOK={this.handleClickOK}/>}
							 
		  </div>
		);
  }
}

export default App;
