import React, { Component } from 'react';
import uuid from 'uuid';

class AddMessage extends Component {
    constructor(){
        super();
        this.state = {
            newMessage:{}
        }
    }


  handleSubmit(e){
    if(this.refs.msg.value === ''){
        alert('Message is required');
    }else if(this.refs.username.value === ''){
        this.setState({newMessage:{
            id: uuid.v4(),
            username: 'Anonymous',
            msg: this.refs.msg.value
        }}, function(){
            //console.log(this.state);
            this.props.addMessage(this.state.newMessage);
        });
    }else {
        this.setState({newMessage:{
            id: uuid.v4(),
            username: this.refs.username.value,
            msg: this.refs.msg.value
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
        <h3>Add Message</h3>
        <form onSubmit={this.handleSubmit.bind(this)}>
            <div>
                <label>Username</label><br />
                <input type="text" ref="username" />
            </div>
            <div>
                <label>Msg</label><br />
                <input type="text" ref="msg" />
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