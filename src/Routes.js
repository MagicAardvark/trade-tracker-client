import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewTrade from './containers/NewTrade';
import Trades from './containers/Trades';
import Settings from './containers/Settings';
import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

const Routes = ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/settings" exact component={Settings} props={childProps} />
    <AuthenticatedRoute path="/trades/new" exact component={NewTrade} props={childProps} />
    <AuthenticatedRoute path="/trades/:id" exact component={NewTrade} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
);

Routes.propTypes = {
  childProps: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    userHasAuthenticated: PropTypes.func.isRequired,
  }).isRequired,
};

export default Routes;
