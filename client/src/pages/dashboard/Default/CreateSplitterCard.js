import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import {makeStyles} from '@material-ui/styles';
import {
    Avatar, Box,
    Button, Checkbox,
    FormControl, FormControlLabel,
    FormHelperText,
    Grid, IconButton, InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography, useMediaQuery
} from '@material-ui/core';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './../../../components/cards/MainCard';
import SkeletonTotalOrderCard from './../../../components/cards/Skeleton/EarningCard';
import useScriptRef from '../../../hooks/useScriptRef';


import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@material-ui/icons/AddBox';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import * as Yup from 'yup';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {Link} from 'react-router-dom';
import AnimateButton from '../../../components/extended/AnimateButton';
import {Formik} from 'formik';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.primary.light,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
            position: 'relative',
            zIndex: 5
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: theme.palette.primary[50],
            borderRadius: '50%',
            zIndex: 1,
            top: '-85px',
            right: '-95px',
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
            width: '210px',
            height: '210px',
            background: theme.palette.primary[50],
            borderRadius: '50%',
            top: '-125px',
            right: '-15px',
            opacity: 0.5,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '10px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.primary[50],
        color: '#fff',
        marginTop: '8px'
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '14px',
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.primary[200]
    },
    avatarCircle: {
        ...theme.typography.smallAvatar,
        cursor: 'pointer',
        backgroundColor: theme.palette.primary[200],
        color: theme.palette.primary.dark
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    }
}));

//-----------------------|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||-----------------------//

const CreateSplitterCard = ({isLoading, ...others}) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);


    };

    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonTotalOrderCard/>
            ) : (
                <MainCard border={false} className={classes.card} contentClass={classes.content}>
                    <Grid container direction="column">



                            <Formik
                                initialValues={{
                                    nftAddress: '',
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    nftAddress: Yup.string().max(42).required('Address is required'),

                                })}
                                onSubmit={(values, {setErrors, setStatus, setSubmitting}) => {
                                    try {
                                        console.log('sending trx to network...');
                                    } catch (err) {
                                        console.error(err);
                                        if (scriptedRef.current) {
                                            setStatus({success: false});
                                            setErrors({submit: err.message});
                                            setSubmitting(false);
                                        }
                                    }
                                }}
                            >
                                {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                                    <form noValidate onSubmit={handleSubmit} {...others}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12}>
                                                <TextField
                                                    fullWidth
                                                    label="NFT Address"
                                                    margin="normal"
                                                    name="nftAddress"
                                                    id="nftAddress"
                                                    type="text"
                                                    value={values.nftAddress}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}

                                                    error={touched.nftAddress && Boolean(errors.nftAddress)}
                                                />
                                                {touched.nftAddress && errors.nftAddress && (
                                                    <FormHelperText error id="standard-weight-helper-text--register">
                                                        {errors.nftAddress}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                        </Grid>
                                        <Box

                                        >
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Create Splitter
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                        {errors.submit && (
                                            <Box
                                                sx={{
                                                    mt: 3
                                                }}
                                            >
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}


                                    </form>
                                )}
                            </Formik>

                    </Grid>
                </MainCard>
            )}
        </React.Fragment>
    );
};

CreateSplitterCard.propTypes = {
    isLoading: PropTypes.bool
};

export default CreateSplitterCard;
