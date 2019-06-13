import React, {Component} from 'react';
import './App.css';

const fetchMonitoringData = () => fetch('http://localhost/monitoring').then(res => res.json());

class App extends Component {

    constructor(props) {

        super(props);

        this.state = {
            monitoringData: {requests: []}
        }


    }

    async componentWillMount() {

        let monitoringData = await fetchMonitoringData();

        this.setState({monitoringData})

    }

    render() {
        return (
            <div className="App">

                <h1>Proxer</h1>
                <div>Total Request Count: {this.state.monitoringData.requestCount}</div>
                <div>Error Rate: {(this.state.monitoringData.errorAverage * 100).toFixed(2)}%</div>
                <h2>Requests</h2>

                <div className='RequestData-Container'>
                    {
                        this.state.monitoringData.requests.map((data, i) => {

                            return <div className='RequestData'>
                                <h3>Request #{i + 1}</h3>
                                <span><b>URL:</b></span><span className='RequestData-URL'>{data.url}</span>
                                <br/>
                                <br/>
                                <span><h3>Responses:</h3></span>
                                <div className='RequestData-Responses'>
                                    
                                    {
                                        data.responses.map(responseObj => {

                                            return <div>
                                                <h4>{Object.keys(responseObj)}</h4>
                                                <div>{JSON.stringify(responseObj[Object.keys(responseObj)], null, 3)}</div>
                                            </div>

                                        })
                                    }
                
                                </div>
                            </div>

                        })
                    }
                </div>

            </div>
        );
    }
}

export default App;
