import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomePromoter from "../pages/PROMOTER/HomePromoter";
import ProtocolPage from '../pages/PROMOTER/ProtocolPage';
import ProjectPage from '../pages/PROMOTER/ProjectPage';
import ReadDataPromoter from '../pages/PROMOTER/ReadDataPromoter';
import PeoplePagePromoter from '../pages/PROMOTER/PeoplePagePromoter';

class Promoter extends React.Component {

    render() {
        
        return ( 
            <BrowserRouter>
            <Redirect to="/PROMOTER/" />
            <Switch>
                <Route exact path="/PROMOTER/">
                    <HomePromoter contract={this.props.contract}/>
                </Route> 
                <Route exact path="/PROMOTER/ProtocolPage">
                    <ProtocolPage  contract={this.props.contract}/>
                </Route>
                <Route exact path="/PROMOTER/ProjectPage">
                    <ProjectPage  contract={this.props.contract}/>
                </Route>
                <Route exact path="/PROMOTER/ReadDataPromoter">
                    <ReadDataPromoter contract={this.props.contract}/>
                </Route>
                <Route exact path="/PROMOTER/PeoplePagePromoter">
                    <PeoplePagePromoter  contract={this.props.contract}/>
                </Route>
            </Switch>
            </BrowserRouter>

        );
    }
}

export default Promoter;












//  <div>
//     <Header
//         role={this.props.role}
//         account={this.props.account}
//     />

//     <h1>Protocol file description</h1>
//     <h4> {this.state.protocoleCID} </h4>
//     <textarea
//         rows="6"
//         cols="60"
//         onChange={e => this.setState({ protocolDescription: e.target.value })}
//     />

//     <h1>Confidential treatment list</h1>
//     <h4> {this.state.listCID} </h4>
//     <textarea
//         rows="6"
//         cols="60"
//         onChange={e => this.setState({ protocolTreatmentList: e.target.value })}
//     /> 
    
//     <p></p>

//     <p>
//         <button className="positive ui button" onClick={this.onButtontreatmentListClick}>
//             Encrypt and upload to IPFS
//         </button>
//     </p>

//     <h2> Protocols Data fetched from Ethereum Blockchain </h2>
//     <div className="table">
//         <table className="ui tablet stackable table">
//         <thead>
//             <tr>
//                 <th>Protocol type</th>
//                 <th className="right aligned">Data</th>
//             </tr>
//         </thead>
//             <tbody>
//             {
//             Object.entries(data).map(([key, value]) => 
//                 <tr key={key}>
//                 <td>{key}</td>
//                 <td className="right aligned">{value}</td>
//                 </tr>
//             )}         
//         </tbody>
//         </table>
//     </div>

// </div>
