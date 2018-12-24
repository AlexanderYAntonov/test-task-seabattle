import React from 'react';
import PropTypes from 'prop-types';
import {Element} from './Element.js';

class Field extends React.Component {
	
	renderField = () => {
		const {data} = this.props;
		
		let fieldTemplate = [];
		
		if (data.length) {
			const width = data[0].length;
			const height = data.length;
			for (let i =0; i < height; i++)
			{
				fieldTemplate[i] = [];
				for (let j = 0; j < width; j++) {
					fieldTemplate[i][j] = <Element data={data[i][j]} /> 
				}
			}
		} else {
			fieldTemplate = <p>No data</p>;
		}
		return fieldTemplate;
	}
	
	render(){
		return <div className='Field'>
			{this.renderField()}
		</div>;
	}
}


Field.propTypes = {
    data:PropTypes.array.isRequired
}

export {Field};