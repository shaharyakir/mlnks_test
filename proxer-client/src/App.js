import React, {Component} from 'react';
import './App.css';

const fetchMonitoringData = () => fetch('http://localhost/monitoring').then(res => res.json());

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      monitoringData: { requests: [] }
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
          <div>Total Request Count {this.state.monitoringData.requestCount}</div>
          <div>Error Rate {this.state.monitoringData.errorAverage * 100}%</div>
          <h2>Requests</h2>

          <div className='RequestData-Container'>
          {
            this.state.monitoringData.requests.map(data => {

              return <span className='RequestData'>
                <div className='RequestData-URL'>{data.url}</div>
                <div className='RequestData-Responses'>{JSON.stringify(data.responses)}</div>
              </span>

            })
          }
          </div>

        </div>
    );
  }
}

export default App;
