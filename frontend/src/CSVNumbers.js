import React, { Component } from 'react'
import { useParams } from 'react-router-dom'   
 

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

function renderPhone(number) {
    if (number.indexOf('x') == -1) return number
    let start = number.replace(/x/g,'0')
    let end = number.replace(/x/g, '9')
    return <div>{start} to {end}</div>
}

class CSVNumbers extends Component {
    constructor(props) {
        super(props);
        this.state = { name: 'NONE', numbers: [] };
    }

    componentDidMount() {
        fetch('http://localhost:3001/numbers?id=' + this.props.params.id).then( async (response) =>  {
            let res = await response.json()
            this.setState(res)
            console.log(res)
        })
    }
 
    render() {
        return <div style={{ textAlign: "center"}}>
                <h1>{ this.state.name }</h1>
                <div>
                    <center>
                        <tbody>
                        {
                            this.state.numbers.map((n) => 
                            <tr key={n._id}>
                                {renderPhone(n.number)}
                            </tr>    
                            )
                        }
                        </tbody>
                    </center>
                </div>

            </div>
    }
}
 
export default withParams(CSVNumbers);