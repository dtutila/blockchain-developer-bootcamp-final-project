import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../components/Loadable';
//import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../pages/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../pages/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../pages/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../pages/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../pages/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../pages/sample-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',

                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',

                '/sample-page'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    {/*<AuthGuard>*/}
                        <Route path="/dashboard/default" component={DashboardDefault} />


                   {/* </AuthGuard>*/}
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
