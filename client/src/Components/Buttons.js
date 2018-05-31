import React, { Component } from 'react';
import './ButtonsStyle.css'

class Buttons extends Component {


    
    handleAddKeyword(e){
        console.log('Add keyword');
    }
    
    handleRemoveKeyword(e){
        console.log('Remove keyword');
    }
    
    handleModifyKeyword(e){
        console.log('Modify keyword');
    }
    
    handleAddResponse(e){
        console.log('Add response');
    }
    
    handleRemoveResponse(e){
        console.log('Remove response');
    }
    
    handleModifyResponse(e){
        console.log('Modify response');
    }
    
    render() {
        return (
            <div className="APIButtons">
                
                <button  style={{marginRight: 150}} onClick={this.handleAddKeyword.bind(this)}>
                    ADD KEYWORD
                </button>
                <button  style={{marginRight: 150}} onClick={this.handleRemoveKeyword.bind(this)}>
                    REMOVE KEYWORD
                </button>
                <button  style={{marginRight: 150}} onClick={this.handleModifyKeyword.bind(this)}>
                    MODIFY KEYWORD 
                </button>
                <button  style={{marginRight: 150}} onClick={this.handleAddResponse.bind(this)}>
                    ADD RESPONSE
                </button>
                <button  style={{marginRight: 150}} onClick={this.handleRemoveResponse.bind(this)}>
                    REMOVE RESPONSE
                </button>
                <button  style={{marginRight: 150}} onClick={this.handleModifyResponse.bind(this)}>
                    MODIFY RESPONSE
                </button>
            </div>
        );
    }
}

export default Buttons;