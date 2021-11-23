
import web3 from './web3';
import factory from './nftsplitter-factory';
import React from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, StyledEngineProvider } from '@material-ui/core';



// defaultTheme
import theme from './themes';
import MainCard from './components/cards/MainCard';
import { Typography } from '@material-ui/core';
import MainLayout from './layout/MainLayout';
// routing
import Routes from './routes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

/*class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: ''
        }
    }
    async componentDidMount() {
        const settings = await factory.methods.getNFTSplitterBase().call();
        this.setState( {settings});
    }

    render() {
        const customization = useSelector((state) => state.customization);
        console.log(web3.version);
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                </ThemeProvider>
            </StyledEngineProvider>


        );
    }
}*/

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;