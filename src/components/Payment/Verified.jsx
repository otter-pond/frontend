import React, {Component} from 'react';
class Verified extends Component {

    render() {
        return (
            <div>
                <div className="text-center">
                    <h3 style={{"textDecoration": "underline"}}>Account Verified</h3>
                    <p>You're all setup! Head over to Reporting and select the most recent Finances report to complete a payment.</p>
                </div>
            </div>
        );
    }
}

export default Verified;