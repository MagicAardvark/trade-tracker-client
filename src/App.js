import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated(authenticated) {
    this.setState({ isAuthenticated: authenticated });
  }

  async handleLogout() {
    const { history } = { ...this.props };
    await Auth.signOut();
    this.userHasAuthenticated(false);
    history.push('/login');
  }

  render() {
    const { isAuthenticated, isAuthenticating } = { ...this.state };

    const childProps = {
      isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
    };

    return (
      !isAuthenticating && (
        <div className="App">
          <Navbar className="navbar navbar-expand-lg">
            <Navbar.Brand>
              <Link to="/">Trade Tracker</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                {
                  isAuthenticated
                    ? (
                      <Fragment>
                        <LinkContainer
                          key="new"
                          to="/trades/new"
                        >
                          <Nav.Link className="">
                            <b>{'\uFF0B'}</b>
                            {' '}
                            Add Trade
                          </Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                      </Fragment>
                    )
                    : (
                      <Fragment>
                        <LinkContainer to="/signup">
                          <Nav.Link>Signup</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/login">
                          <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                      </Fragment>
                    )
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <div className="">
            <Routes childProps={childProps} />
          </div>
        </div>
      )
    );
  }
}

export default withRouter(App);
