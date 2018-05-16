import React, { Component } from 'react';


class MessageItem extends Component {
    
    deleteMessage(id){
        this.props.onDelete(id);
    }
    
    render() {
    console.log(this.props);
    return (
      <li className="Messages">
        <strong>{this.props.message.username}: {this.props.message.msg}</strong> <a href="#" onClick={this.deleteMessage.bind(this, this.props.message.id)}>X</a>
      </li>
    );
    }
}


export default MessageItem;