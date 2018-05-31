import React, { Component } from 'react';
import axios from 'axios';

class AddMessage extends Component {
    constructor(){
        super();
        this.state = {
            newMessage:{},
            username: undefined,
            keyword: undefined
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

  setUsername = (e) =>
  {
    this.setState({
        username: e.target.value
    });
  }

  setKeyword = (e) => {
    this.setState({
        keyword: e.target.value
    });
  }

  postNewKeyword = () => {
    if(this.state.keyword)
    {
        axios.post('/api/keywords', {keyword: this.state.keyword, cases: 0})
        .then((res) => {
            console.log(res.data.info);
            this.setState({
                keyword: undefined
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
  }




  
  render() {
    return (
        <div>

        <div>
                
                <label>Keyword</label><br />
                <input type="text" onChange={this.setKeyword}  />
                <button onClick={this.postNewKeyword} >Post new Keyword</button>
            </div>

        <form onSubmit={this.handleSubmit.bind(this)}>



            <div>
                
                <label>Username</label><br />
                <input type="text" onChange={this.setUsername} />
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