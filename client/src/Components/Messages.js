import React, { Component } from 'react';
import MessageItem from './MessageItem'

class Messages extends Component {

    deleteMessage = (id) => {
        this.props.onDelete(id);
    }

    render() {
    let messageItems;
    if(this.props.messages){
        messageItems = this.props.messages.map((message, i) => {
          //console.log(messages);
          return(
            <MessageItem key={i} onDelete={this.deleteMessage} message={message} />
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
