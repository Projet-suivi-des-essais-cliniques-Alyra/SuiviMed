import React from 'react';
import RoleContext from '../contexts/RoleContext';
import AccountContext from '../contexts/AccountContext';

class Header extends React.Component {
    render() {
        return (
            <div className="ui inverted brown clearing segment">
                <h4 className="ui right floated header">
                <AccountContext.Consumer>
                    {(value) => <strong> {value.toLowerCase()} </strong>}
                    </AccountContext.Consumer>  
                </h4>
                <h4 className="ui left floated header">
                    <RoleContext.Consumer>
                    {/* <strong> {`${this.props.balance} ETH`} </strong> */}
                    {(value) => <strong> {`${value}`} </strong>}
                    </RoleContext.Consumer>
                </h4>
            </div>
        );
    }
}

export default Header;