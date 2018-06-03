import React, { Component } from 'react';
import './ButtonsStyle.css';
import axios from 'axios';

class Buttons extends Component {
  constructor(){
      super();
      this.state = {
          addKeyword: 'undefined',
          removeKeyword: 'undefined',
          modifiedNewKeyword: 'undefined',
          modifiedKeyword: 'undefined',
          caseSensitivy: false,
          caseSensitivyModify: false,
          responseAdd: 'undefined',
          responseKeyword: 'undefined',
          responseUsername: 'undefined',
          responseHeader: 'undefined',
          responseRemove: 'undefined',
          responseModify: 'undefined',
          responseNewModify: 'undefined',
          responseKeywordModify: 'undefined',
          responseHeaderModify: 'undefined',
          responseUsernameModify: 'undefined'
      }
  }


    handleAddKeyword = () => {
        console.log('Add keyword');
        if(this.state.addKeyword) {
            let caseSen = 0;
            if (this.state.caseSensitivy){
              caseSen = 1;
            }
            axios.post('/api/keywords', {keyword: this.state.addKeyword, cases: caseSen})
            .then((res) => {
                console.log(res.data.info);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    handleRemoveKeyword = () => {
        console.log('Remove keyword');
        if(this.state.removeKeyword) {
          axios.get('/api/keywords')
          .then((res) => {
              for (const keyword of res.data.payload["@namespaces"].items){
                if (keyword.keyword === this.state.removeKeyword) {
                  axios.delete('/api/keywords/' + keyword.keywordid)
                  .then((res) => {
                    console.log('Keyword removed');
                  })
                  .catch((err) => {
                      console.log(err);
                  })
                }
              }
          })
          .catch((err) => {
              console.log(err)
          })
        }

    }

    handleModifyKeyword = () => {
        console.log('Modify keyword');
        if(this.state.modifiedKeyword && this.state.modifiedNewKeyword) {
          let caseSen = 0;
          if (this.state.caseSensitivyModify){
            caseSen = 1;
          }
          axios.get('/api/keywords')
          .then((res) => {
              for (const keyword of res.data.payload["@namespaces"].items){
                if (keyword.keyword === this.state.modifiedKeyword) {
                  axios.patch('/api/keywords/' + keyword.keywordid, {
                    'keyword': this.state.modifiedNewKeyword,
                    'cases': caseSen

                  })
                  .then((res) => {
                    console.log('Keyword modified');
                  })
                  .catch((err) => {
                      console.log(err);
                  })
                }
              }
          })
          .catch((err) => {
              console.log(err)
          })
        }

    }

    handleAddResponse = () => {
        console.log('Add response');
        if(!this.state.responseUsername) {
          this.setState({
              responseUsername: 'Anonymous'
          });
        }

        if(this.state.responseAdd && this.state.responseKeyword) {
            axios.post('/api/responses/', {response: this.state.responseAdd, keyword: this.state.responseKeyword,
              header: this.state.responseHeader, username: this.state.responseUsername})
            .then((res) => {
                console.log(res.data.info);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    handleRemoveResponse = () => {
        console.log('Remove response');
        if(this.state.responseRemove) {
          axios.get('/api/responses')
          .then((res) => {
              for (const response of res.data["@namespaces"].items){
                if (response.response === this.state.responseRemove) {
                  axios.delete('/api/responses/' + response.responseid)
                  .then((res) => {
                    console.log('Response removed');
                  })
                  .catch((err) => {
                      console.log(err);
                  })
                }
              }
          })
          .catch((err) => {
              console.log(err)
          })
        }

    }

    handleModifyResponse = () => {
        console.log('Modify response');
        if(!this.state.responseUsernameModify) {
          this.setState({
              responseUsername: 'Anonymous'
          });
        }
        if(this.state.responseModify && this.state.responseNewModify) {
          axios.get('/api/responses')
          .then((res) => {
              for (const response of res.data["@namespaces"].items){
                if (response.response === this.state.responseModify) {
                  axios.patch('/api/responses/' + response.responseid, {
                    'response': this.state.responseNewModify,
                    'keyword': this.state.responseKeywordModify,
                    'header': this.state.responseHeaderModify,
                    'username': this.state.responseUsernameModify

                  })
                  .then((res) => {
                    console.log('Response modified');
                  })
                  .catch((err) => {
                      console.log(err);
                  })
                }
              }
          })
          .catch((err) => {
              console.log(err)
          })
        }
    }

    setAddKeyword = (e) => {
      this.setState({
        addKeyword: e.target.value
      });
    }

    setRemoveKeyword = (e) => {
      this.setState({
        removeKeyword: e.target.value
      });
    }

    setModifiedKeyword = (e) => {
      this.setState({
          modifiedKeyword: e.target.value
      });
    }

    setNewModifiedKeyword = (e) => {
      this.setState({
          modifiedNewKeyword: e.target.value
      });
    }

    setResponseAdd = (e) => {
      this.setState({
          responseAdd: e.target.value
      });
    }

    setResponseKeyword = (e) => {
      this.setState({
          responseKeyword: e.target.value
      });
    }

    setResponseHeader = (e) => {
      this.setState({
          responseHeader: e.target.value
      });
    }

    setResponseUsername = (e) => {
      this.setState({
          responseUsername: e.target.value
      });
    }

    setResponseRemove = (e) => {
      this.setState({
          responseRemove: e.target.value
      });
    }


    setResponseModify = (e) => {
      this.setState({
          responseModify: e.target.value
      });
    }

    setResponseNewModify = (e) => {
      this.setState({
          responseNewModify: e.target.value
      });
    }

    setResponseHeaderModify = (e) => {
      this.setState({
          responseHeaderModify: e.target.value
      });
    }

    setResponseKeywordModify = (e) => {
      this.setState({
          responseKeywordModify: e.target.value
      });
    }

    setResponseUsernameModify = (e) => {
      this.setState({
          responseUsernameModify: e.target.value
      });
    }

    toggleCaseSensitivity = (e) => {
      this.setState({
        caseSensitivy: e.target.checked
      })
    }

    toggleCaseSensitivityModify = (e) => {
      this.setState({
        caseSensitivyModify: e.target.checked
      })
    }

    getKeywords = () => {
      return axios.get('/api/keywords');
    }

    render() {
        return (
            <div className="APIButtons">
                <div className="ButtonStyle">
                  <label>Keyword to add</label><br />
                  <input id="addKeyword" type="text" onChange={this.setAddKeyword}/><br />
                  <input id="checkCases" type="checkbox" onChange={this.toggleCaseSensitivity}/>
                  <label htmlFor="checkCases">Case sensitivity</label>
                  <button  onClick={this.handleAddKeyword}>
                      ADD KEYWORD
                  </button>
                </div>
                <div className="ButtonStyle">
                  <label>Keyword to Remove</label><br />
                  <input id="removeKeyword" type="text" onChange={this.setRemoveKeyword}/>
                  <button onClick={this.handleRemoveKeyword}>
                      REMOVE KEYWORD
                  </button>
                </div>
                <div className="ButtonStyle">
                  <label>Keyword to modify</label><br />
                  <input id="modifiedKeyword" type="text" onChange={this.setModifiedKeyword}/><br />
                  <label>New keyword</label><br />
                  <input id="newModifiedKeyword" type="text" onChange={this.setNewModifiedKeyword}/><br />
                  <input id="checkCasesModify" type="checkbox" onChange={this.toggleCaseSensitivityModify}/>
                  <label htmlFor="checkCases">Case sensitivity</label>
                  <button onClick={this.handleModifyKeyword}>
                      MODIFY KEYWORD
                  </button>
                </div>
                <div className="ButtonStyle">
                  <label>Response to add</label><br />
                  <input id="responseAdd" type="text" onChange={this.setResponseAdd}/><br />
                  <label>Response keyword</label><br />
                  <input id="responseKeyword" type="text" onChange={this.setResponseKeyword}/><br />
                  <label>Header (optional)</label><br />
                  <input id="responseHeader" type="text" onChange={this.setResponseHeader}/><br />
                  <label>Username (optional)</label><br />
                  <input id="responseUsername" type="text" onChange={this.setResponseUsername}/>
                  <button onClick={this.handleAddResponse}>
                      ADD RESPONSE
                  </button>
                </div>
                <div className="ButtonStyle">
                  <label>Response to remove</label><br />
                  <input id="responseRemove" type="text" onChange={this.setResponseRemove}/>
                  <button  onClick={this.handleRemoveResponse}>
                      REMOVE RESPONSE
                  </button>
                </div>
                <div className="ButtonStyle">
                  <label>Response to modify</label><br />
                  <input id="responseModify" type="text" onChange={this.setResponseModify}/><br />
                  <label>New response</label><br />
                  <input id="responseNewModify" type="text" onChange={this.setResponseNewModify}/><br />
                  <label>Response keyword</label><br />
                  <input id="responseKeywordModify" type="text" onChange={this.setResponseKeywordModify}/><br />
                  <label>Header (optional)</label><br />
                  <input id="responseHeaderModify" type="text" onChange={this.setResponseHeaderModify}/><br />
                  <label>Username (optional)</label><br />
                  <input id="responseUsernameModify" type="text" onChange={this.setResponseUsernameModify}/><br />
                  <button  onClick={this.handleModifyResponse}>
                      MODIFY RESPONSE
                  </button>
                </div>

            </div>
        );
    }
}

export default Buttons;
