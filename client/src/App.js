import React from 'react';
import {Web3ReactProvider} from '@web3-react/core';
import {ethers} from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import Header from './components/Header';
import {AppContextProvider} from './AppContext';
import Splitter from './pages/Splitter';
import NFT from './pages/NFT';

function getLibrary(provider) {
    return new ethers.providers.Web3Provider(provider);
}

const App = () => {
    return (
        <AppContextProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
                <div>
                    <Header/>
                    <Switch>
                        <Route exact path="/" component={Splitter}/>
                        <Route exact path="/nft/:nftAddress/:tokenId" component={NFT} />
                        {/*<Route path={'/'}>*/}
                        {/*    <Redirect to="/split"/>*/}
                        {/*</Route>*/}
                    </Switch>
                </div>
            </Web3ReactProvider>
        </AppContextProvider>
    );
};

export default App;
