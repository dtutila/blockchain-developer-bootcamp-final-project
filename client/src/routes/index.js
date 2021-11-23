import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
// import LoginRoutes from './LoginRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';

// project imports
import config from './../config/config';

//-----------------------|| ROUTING RENDER ||-----------------------//

const Routes = () => {
    return (
        <Switch>
            <Redirect exact from="/" to={config.defaultPath} />
            <React.Fragment>
                {/* Routes for authentication pages */}


                {/* Routes for main layouts */}
                <MainRoutes />
            </React.Fragment>
        </Switch>
    );
};

export default Routes;
