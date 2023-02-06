import React, { Component } from 'react'
 
class PhoneForm extends Component {

    constructor(props) {
        super(props);
        this.state = { csv: [] };
    }

    componentDidMount() {
        fetch('http://localhost:3001/csv').then( async (response) =>  {
            let res =  await response.json()
            this.setState({csv: res})
        })
    }
 
 
    handleSubmit = (event) => {
        return
        alert('A form was submitted: ' + this.state);
        const inputCSV = document.getElementById('inputCSV');
        fetch('http://localhost:3001/api/csv/upload', {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            body: inputCSV.files[0],
        }).then(function(response) {
            console.log(response)
            return response.json();
        });
 
        event.preventDefault();
    }
 
    render() {
        return <div style={{ textAlign: "center"}}>
                <div>
                    <form action="http://localhost:3001/store-data" enctype="multipart/form-data" method="post">
                        <label>
                        Phone numbers:
                            <input type={"file"} accept={".csv"}  name="inputCSV" id="inputCSV" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div>
                    <h2>CSV list:</h2>
                    <center>
                        <tbody>
                        {
                            this.state.csv.map(c => 
                            <tr key={c._id}>
                                <a href={'http://localhost:3000/numbers/'+c._id}>{c.name}</a>
                            </tr>    
                            )
                        }
                        </tbody>
                    </center>
                </div>

            </div>
    }
}
 
export default PhoneForm;