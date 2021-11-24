import React, { useState } from 'react';
// import factory from '../../../../abi/factory';
// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    OutlinedInput,
    Popper
} from '@material-ui/core';
import {useSplitterFactory} from '../../../../hooks/useSplitterFactory';

// third-party
// import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
// import Transitions from '../../../../components/extended/Transitions';

// assets
// import {IconAdjustmentsHorizontal, IconListSearch,  IconX} from '@tabler/icons';
// import web3 from '../../../../web3';

// style constant
const useStyles = makeStyles((theme) => ({
    searchControl: {
        width: '434px',
        marginLeft: '16px',
        paddingRight: '16px',
        paddingLeft: '16px',
        '& input': {
            background: 'transparent !important',
            paddingLeft: '5px !important'
        },
        [theme.breakpoints.down('lg')]: {
            width: '250px'
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginLeft: '4px',
            background: '#fff'
        }
    },
    searchButton: {

        marginLeft: '16px',
        paddingRight: '16px',
        paddingLeft: '16px'
    },
    startAdornment: {
        fontSize: '1rem',
        color: theme.palette.grey[500]
    },
    headerAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.dark,
        '&:hover': {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light
        }
    },
    closeAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        background: theme.palette.orange.light,
        color: theme.palette.orange.dark,
        '&:hover': {
            background: theme.palette.orange.dark,
            color: theme.palette.orange.light
        }
    },
    popperContainer: {
        zIndex: 1100,
        width: '99%',
        top: '-55px !important',
        padding: '0 12px',
        [theme.breakpoints.down('sm')]: {
            padding: '0 10px'
        }
    },
    cardContent: {
        padding: '12px !important'
    },
    card: {
        background: '#fff',
        [theme.breakpoints.down('sm')]: {
            border: 0,
            boxShadow: 'none'
        }
    }
}));

//-----------------------|| CREATE SPLITTER INPUT ||-----------------------//

const CreateSplitterSection = () => {
    const classes = useStyles();
    const [value, setValue] = useState('');
    const { createSplitter } = useSplitterFactory();
    const createHandler = async (event) => {
        console.log('creating...', event);
        console.log('creating...', value);
        await createSplitter(value);
/*
        const accounts = await web3.eth.getAccounts();
        await factory.methods
            .createNFTSplitter(value)
            .send({
                from: accounts[0],
            });
*/

    };

    return (
        <React.Fragment>

            <Box >
                <OutlinedInput
                    className={classes.searchControl}
                    id="input-search-header"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="NFT Address"
                    aria-describedby="search-helper-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                />


            </Box>
            <Box >
                <Button variant="contained" className={classes.searchButton} onClick={createHandler}>Create Splitter</Button>
            </Box>
        </React.Fragment>
    );
};

export default CreateSplitterSection;
