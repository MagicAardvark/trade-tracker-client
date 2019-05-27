import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    const { email, password } = { ...this.state };
    return email.length > 0 && password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, password } = { ...this.state };
    const { userHasAuthenticated } = { ...this.props };

    this.setState({ isLoading: true });

    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
    } catch (e) {
      // alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { email, password, isLoading } = { ...this.state };

    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="email" bsSize="large">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password" bsSize="large">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </Form.Group>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </Form>
      </div>
    );
  }
}

Login.propTypes = {
  childProps: PropTypes.shape({
    userHasAuthenticated: PropTypes.func,
  }),
};

Login.defaultProps = {
  childProps: {},
};

export default Login;
