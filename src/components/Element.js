import React from 'react';
import PropTypes from 'prop-types';

class Element extends React.Component {
		
	render(){
		return <React.Fragment>
			{this.props.data === 0 && 
				<div className='Element Element__water'>			
				</div>
			}
			
			{this.props.data === 1 && 
				<div className='Element Element__ship'>			
				</div>
			}
		
			{this.props.data === 2 && 
				<div className='Element Element__collision'>			
				</div>
			}
		
			{this.props.data > 2 && 
				<div className='Element Element__item'>			{this.props.data}
				</div>
			}
		</React.Fragment>;
	}
}


Element.propTypes = {
    data:PropTypes.number.isRequired
}

export {Element};