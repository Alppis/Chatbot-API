import React, { Component } from 'react';
import uuid from 'uuid';
import $ from 'jquery';
import Messages from './Components/Messages';
import AddMessage from './Components/AddMessage';
import Buttons from './Components/Buttons';
import Statistics from './Components/Statistics';
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
        this.setState({messages: []});
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
        

        
        return (
            <div id="parent" className="App">
                <div id="APIButtons">
                    <Buttons buttons />
                </div>
                <div id="APIMessages" style={{marginTop:50, marginLeft:50}}>
                    <AddMessage addMessage={this.handleAddMessage.bind(this)}/>
                    <Messages messages={this.state.messages} onDelete={this.handleDeleteMessage.bind(this)}/>
                </div>
                <div>
                    <Statistics statistics />
                </div>
            </div>
        );
    }
}

export default App;
