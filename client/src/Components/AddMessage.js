import React, { Component } from 'react';

class AddMessage extends Component {
    constructor(){
        super();
        this.state = {
            newMessage:{}
        }
    }


    handleChannels(e){  
        console.log('Channels');
    }
    
    handleSubmit(e){
        if(this.refs.message.value === ''){
            alert('Message is required');
        }else if(this.refs.username.value === ''){
            this.setState({newMessage:{
                username: 'Anonymous',
                msg: this.refs.message.value
            }}, function(){
                //console.log(this.state);
                this.props.addMessage(this.state.newMessage);
            });
        }else {
            this.setState({newMessage:{
                username: this.refs.username.value,
                msg: this.refs.message.value
            }}, function(){
                //console.log(this.state);
                this.props.addMessage(this.state.newMessage);
            });
        }        
        e.preventDefault();
    }
  
  render() {
    return (
        <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
            <div>
                <label>Username</label><br />
                <input type="text" ref="username" />
            </div>
            <div>
                <label>Message</label><br />
                <input type="text" ref="message" />
                <button  style={{marginLeft: 20}} onClick={this.handleChannels.bind(this)}>
                    Channels
                </button>
            </div>
            <br />
            <input type="submit" value="Submit" />
            <br />
        </form>
      </div>
    );
  }
}

export default AddMessage;