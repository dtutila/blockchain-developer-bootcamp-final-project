import React,{ useEffect, useState } from 'react';
import Web3 from 'web3';
import {useDispatch, useSelector} from 'react-redux';
import { injected } from '../../../../connectors';

// material-ui
import {makeStyles, useTheme} from '@material-ui/styles';
import {Avatar, Chip} from '@material-ui/core';

// third-party

// project imports

//import {METAMASK_CONNECT} from './../../../../store/actions';

// assets
import MetamaskSVG from './../../../../assets/images/metamask-fox.svg';
import {useWeb3React} from '@web3-react/core';


// style const
const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '100%',
        maxWidth: '350px',
        minWidth: '300px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            minWidth: '100%'
        }
    },
    headerAvatar: {
        cursor: 'pointer',
        ...theme.typography.mediumAvatar,
        margin: '8px 0 8px 8px !important'
    },
    profileChip: {
        height: '48px',
        alignItems: 'center',
        borderRadius: '27px',
        transition: 'all .2s ease-in-out',
        borderColor: theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light,
        '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: theme.palette.primary.main + '!important',
            color: theme.palette.primary.light,
            '& svg': {
                stroke: theme.palette.primary.light
            }
        }
    },
    profileLabel: {
        lineHeight: 0,
        padding: '12px',
        fontWeight: 'bold'
    },
    listItem: {
        marginTop: '5px'
    },
    cardContent: {
        padding: '16px !important'
    },
    card: {
        backgroundColor: theme.palette.primary.light,
        marginBottom: '16px',
        marginTop: '16px'
    },
    searchControl: {
        width: '100%',
        paddingRight: '8px',
        paddingLeft: '16px',
        marginBottom: '16px',
        marginTop: '16px'
    },
    startAdornment: {
        fontSize: '1rem',
        color: theme.palette.grey[500]
    },
    flex: {
        display: 'flex'
    },
    name: {
        marginLeft: '2px',
        fontWeight: 400
    },
    ScrollHeight: {
        height: '100%',
        maxHeight: 'calc(100vh - 250px)',
        overflowX: 'hidden'
    },
    badgeWarning: {
        backgroundColor: theme.palette.warning.dark,
        color: '#fff'
    }
}));

//-----------------------|| METAMASK CONNECTION ||-----------------------//

const MetamaskSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const userAccount = useSelector((state) => state.account);
    const dispatcher = useDispatch();
    userAccount.address = '';
    const [address, setAddress] = React.useState(userAccount.address);
    const { activate, active, account, deactivate } = useWeb3React();
    const [connected, setConnected] = React.useState(false);
    const anchorRef = React.useRef(null);

    useEffect(() => {
        const metamaskActivate = async () => {
            await activate(injected, (e) => {
                setConnected(true);
                console.log('activated :|', e);
            });
            setConnected(true);
            setAddress(account);
            console.log('activated :^', account);
        };
        metamaskActivate();
    }, []);

    const connectWallet = () => {
        // Check if MetaMask is installed on user's browser
        activate(injected).then(() =>{
            setAddress(account);
            console.log('account :^', account);
        }).catch(e => {
            console.log(e);
        })


        console.log('active', active);
    };

    const handleToggle = () => {
        console.log('connecting');
        connectWallet();
    };

    return (
        <React.Fragment>
            <Chip
                classes={{label: classes.profileLabel}}
                className={classes.profileChip}
                icon={
                    <Avatar
                        src={MetamaskSVG}
                        className={classes.headerAvatar}
                        ref={anchorRef}
                        color="inherit"
                    />
                }
                label={account ? account : 'Connect'}
                variant="outlined"
                ref={anchorRef}
                onClick={connectWallet}
                color="primary"
            />

        </React.Fragment>
    );
};

export default MetamaskSection;
