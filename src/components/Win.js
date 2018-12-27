import React from 'react';
import PropTypes from 'prop-types';
import bot from '../images/bot.png';
import human from '../images/human.png';

class Win extends React.Component {
	
	render(){
		const {winner, onClickOK} = this.props;
        return (
            <div className='Win'>
				<div className='Win__text'>
					{winner === 'Human' && <img src={human} alt='human'/>}
					{winner === 'Bot' && <img src={bot} alt='bot'/>}
					{winner} wins!
				</div>
				<div
					className='Win__ok_btn' 
					onClick={onClickOK}>
					OK
				</div>
            </div>
        )
	}
}

Win.propTypes = {
	winner: PropTypes.string.isRequired,
    onClickOK: PropTypes.func.isRequired
}

export {Win};