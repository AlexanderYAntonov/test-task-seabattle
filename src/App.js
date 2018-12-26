import React, { Component } from 'react';
import './App.css';
import {Field} from './components/Field.js';
import {Playground} from './components/Playground.js';
import {DotShip} from './components/Ship.js';
import {LineShip} from './components/Ship.js';
import {SquareShip} from './components/Ship.js';
import {TriangleShip} from './components/Ship.js';
import {BotPlayer} from './components/Player.js';
import {HumanPlayer} from './components/Player.js';

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
        if (error > 0) return false;
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
		
		const field2 = player1.initPlayground();
		this.setState({field2: field2.getField()});
		this.setState({gameStarted: true});
		
	}
	
	handleChange = (event) => {
        const {id, value} = event.currentTarget;
        this.setState({[id]: value});
    }
	
  	render() {
		const {name1, name2, name1Status, name2Status, field1, field2, gameStarted} = this.state;
		return (
		  <div className="App">
			<header className='App__header'>Battleships</header> 
			
			<div onClick={this.onClickStartButton} className='App__start_button'>Start</div>
			
			<div className='App__main'>
				<div className='App__playground'>
					{!gameStarted &&
						<input 
							type='text'
							id = 'name1'
							className={(name1Status && 'App__player_name_input') || (!name1Status && 'App__player_name_input_error')}
							value = {name1}
							onChange = {this.handleChange}
							autoFocus={true}
							placeholder='Bot name'
						/>
					}
					{gameStarted && <div className='App__player_name'>{name1}</div>}
					{field1 &&
						<Field data={field1} field={1}/>
					}
				</div>
				
				<div className='App__playground'>
					{!gameStarted &&
						<input 
							type='text'
							id = 'name2'
							className={(name2Status && 'App__player_name_input') || (!name2Status && 'App__player_name_input_error')}
							value = {name2}
							onChange = {this.handleChange}
							placeholder='Player name'
						/>
					}
					{gameStarted && <div className='App__player_name'>{name2}</div>}
					{field2 &&
						<Field data={field2} field={2}/>
					}
				</div>
			</div>  
		  </div>
		);
  }
}

export default App;
