import React, { Component } from 'react';

class Statistics extends Component {

    handleStatstics(e){
        console.log('Statistics');
    }

    render() {
        return (
            <div className="StatisticsButton">
                <button  style={{position: "absolute", bottom: 400, right: 20}} onClick={this.handleStatstics.bind(this)}>
                    Statistics
                </button>
            </div>
        );
    }
}

export default Statistics    