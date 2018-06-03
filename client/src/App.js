import React, { Component } from 'react';
import $ from 'jquery';
import Messages from './Components/Messages';
import AddMessage from './Components/AddMessage';
import Buttons from './Components/Buttons';
import Statistics from './Components/Statistics';
import axios from 'axios';
import './App.css';

class App extends Component {
    constructor(){
        super();
        this.state = {
            messages: [],
            response: ''
        }
    }



    getMessages(){
        this.setState({messages: [


        ]});
    }

    componentWillMount(){
        this.getMessages();

    }

    componentDidMount(){
        axios.get('/api/keywords')
        .then((res) => {
            console.log(res.data.payload["@namespaces"].items)
        })
        .catch((err) => {
            console.log(err)
        })


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
                <br />
                <div id="APIMessages" style={{marginTop:350, marginLeft:50}}>
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
