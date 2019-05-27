import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {
  Form,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Signup.scss';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  validateForm() {
    const { email, password, confirmPassword } = { ...this.state };
    return (
      email.trim().length > 0
      && password.trim().length > 0
      && password === confirmPassword
    );
  }

  validateConfirmationForm() {
    const { confirmationCode } = { ...this.state };
    return confirmationCode.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const { email, password } = { ...this.state };
    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
      });

      this.setState({
        newUser,
      });
    } catch (e) {
      if (e.code === 'UsernameExistsException') {
        this.signUpFailure();
      } else alert(e.message);
    }

    this.setState({ isLoading: false });
  }

  async signUpFailure() {
    try {
      const { email } = { ...this.state };
      await Auth.resendSignUp(email);
      this.setState({
        newUser: email,
      });
    } catch (e) {
      const { history } = { ...this.props };
      alert('User already exists, please log in');
      history.push('/login');
    }
  }

  async handleConfirmationSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const { email, password, confirmationCode } = { ...this.state };
    const { userHasAuthenticated } = { ...this.props };
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    const { isLoading, confirmationCode } = { ...this.state };
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" bsSize="large">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            value={confirmationCode}
            onChange={this.handleChange}
          />
          <p>Please check your email for the code.</p>
        </Form.Group>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    const {
      email,
      password,
      confirmPassword,
      isLoading,
    } = { ...this.state };
    return (
      <form onSubmit={this.handleSubmit}>
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
        <Form.Group controlId="confirmPassword" bsSize="large">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
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
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    const { newUser } = { ...this.state };
    return (
      <div className="Signup">
        {newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
