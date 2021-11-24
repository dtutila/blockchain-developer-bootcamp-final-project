import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
 import TotalOrderLineChartCard from './TotalOrderLineChartCard';
 import CreateSpitterCard from './CreateSplitterCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import TotalIncomeLightCard from './TotalIncomeLightCard';

//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>

                <Grid container spacing={gridSpacing}>

                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <CreateSpitterCard isLoading={isLoading} />
                        {/*<EarningCard isLoading={isLoading} />*/}
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>

                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                {/*<TotalIncomeDarkCard isLoading={isLoading} />*/}
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        {/*<TotalGrowthBarChart isLoading={isLoading} />*/}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/*<PopularCard isLoading={isLoading} />*/}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
