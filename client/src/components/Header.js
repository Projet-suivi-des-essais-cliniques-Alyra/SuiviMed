import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div className="ui inverted brown clearing segment">
                <h4 className="ui right floated header">
                    <strong> {this.props.account.toLowerCase()} </strong>
                </h4>
                <h4 className="ui left floated header">
                    <strong> {`${this.props.balance} ETH`} </strong>
                </h4>                
            </div>
        );
    }
}

export default Header;