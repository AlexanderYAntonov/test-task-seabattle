import React from 'react';
import PropTypes from 'prop-types';
import {ONE_SHOOT} from './Player.js';
/*import normal from '../images/normal.png';
import damaged from '../images/damaged.png';
import broken from '../images/broken.png';
import sea from '../images/sea.png';*/
import missed from '../images/missed.png';
/*import cloud from '../images/cloud.png';
*/

class Element extends React.Component {
		
	handleOnClickCell = () => {
		const {i0, j0, id} = this.props;
		this.props.onClickCell({i0, j0, id});
	}
	
	render(){
		const {data} = this.props;
		return <React.Fragment>
			{data === 0 && 
				<div className='Element Element__fog' onClick={this.handleOnClickCell}>	
					
				</div>
			}

			{data === 1 && 
				<div className='Element Element__water' onClick={this.handleOnClickCell}>			
				
				</div>
			}
			
			{data === ONE_SHOOT+1 && 
				<div className='Element Element__missed' onClick={this.handleOnClickCell}>
					<img src={missed} alt='missed'/>
				</div>
			}

			{data > ONE_SHOOT+1 && data < ONE_SHOOT * 2 && 
				<div className='Element Element__ship' onClick={this.handleOnClickCell}>	
					
				</div>
			}
		
			{data > ONE_SHOOT * 2+1 && data < ONE_SHOOT * 3 &&
				<div className='Element Element__wounded_ship'>		
					
				</div>
			}
		
			{data > ONE_SHOOT * 3+1 && data < ONE_SHOOT * 4 &&
				<div className='Element Element__destroyed_ship'>	
				
				</div>
			}
		
		{/*	{this.props.data > 1000 && 
				<div className='Element Element__item'>			{this.props.data}
				</div>
			}
			*/}
		</React.Fragment>;
	}
}


Element.propTypes = {
    data:PropTypes.number.isRequired,
    i0:PropTypes.number.isRequired,
    j0:PropTypes.number.isRequired,
    id:PropTypes.number.isRequired,
	onClickCell:PropTypes.func.isRequired
}

export {Element};