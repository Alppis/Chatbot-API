import React, { Component } from 'react';
import uuid from 'uuid';
import $ from 'jquery';
import Messages from './Components/Messages';
import AddMessage from './Components/AddMessage';
import Todos from './Components/Todos'
import './App.css';

class App extends Component {
    constructor(){
        super();
        this.state = {
            messages: [],
            todos: []
        }
    }
    
    
    getTodos(){
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/todos',
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({todos: data}, function(){
                    console.log(this.state);
                });
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    }
    
    getMessages(){
        this.setState({messages: [
        {
            id:uuid.v4(),
            username: 'Anynymous',
            msg: 'Test message'
        },
        {
            id:uuid.v4(),
            username: 'The one',
            msg: 'MyWords'
        },
        {
            id:uuid.v4(),
            username: 'LinuxPenquin',
            msg: 'Tux'
        }
        ]});
    }
    
    componentWillMount(){
        this.getMessages();
        this.getTodos();

    }
  
    componentDidMount(){
        this.getTodos();
    }
    
    handleAddMessage(message){
        let messages = this.state.messages;
        messages.push(message);
        this.setState({messages:messages});
    }
    
    handleDeleteMessage(id){
        let messages = this.state.messages;
        let index = messages.findIndex(x => x.id === id); 
        messages.splice(index, 1);
        this.setState({messages:messages});
    }
    
    render() {
        
        const CSSStyle:any = {
        textAlign: 'center',
        border: '1px solid aquamarine'
        };
        
        return (
          <div className="App" style={CSSStyle}>
            <AddMessage addMessage={this.handleAddMessage.bind(this)}/>
            <Messages messages={this.state.messages} onDelete={this.handleDeleteMessage.bind(this)}/>
          </div>
        );
    }
}

export default App;
