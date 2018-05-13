import React, { Component } from 'react';
import MessageItem from './MessageItem'

class Messages extends Component {

    deleteMessage(id){
        this.props.onDelete(id);
    }

    render() {
    let messageItems;
    if(this.props.messages){
        messageItems = this.props.messages.map(messages => {
          //console.log(messages);
          return(
            <MessageItem onDelete={this.deleteMessage.bind(this)} key={messages.msg} message={messages} />
            );
        });
    }
    console.log(this.props);
    return (
      <div className="Messages">
        {messageItems}
      </div>
    );
    }
}

export default Messages;