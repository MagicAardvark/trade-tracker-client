import React, { Component } from 'react';
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';
import { API } from 'aws-amplify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewTrade.scss';

export default class NewTrade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeDate: '',
      ticker: '',
      quantity: '',
      pricePaid: '',
      priceSold: '',
      tradeType: '',
      rating: '',
      notes: '',
      isLoading: null,
      isDeleting: null,
      editMode: false,
      editId: null,
    };

    this.formRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    console.log(this.props)
    if (this.props.match.params.id) {
      try {
        const trade = await this.getTrade();

        this.setState({
          ...trade,
          editMode: true,
          editId: this.props.match.params.id,
        });
      } catch (e) {
        alert(e);
      }
    }
  }

  getTrade() {
    const { match } = { ...this.props };
    return API.get('trades', `/trades/${match.params.id}`);
  }

  validateForm() {
    const required = ['tradeDate', 'ticker', 'quantity', 'pricePaid', 'tradeType'];

    const valid = required.filter((req) => {
      if (this.state[req] && this.state[req].trim().length > 0) {
        return false;
      }
      return true;
    });

    return valid.length === 0;
  }


  handleChange(event) {
    if (event instanceof Date) {
      this.setState({
        tradeDate: event.toDateString(),
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value,
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const {
      tradeDate,
      ticker,
      quantity,
      pricePaid,
      priceSold,
      tradeType,
      // rating,
      notes,
    } = { ...this.state };
    const { history } = { ...this.props };
    try {
      await this.saveTrade({
        tradeDate: tradeDate || null,
        ticker: ticker.toUpperCase() || null,
        quantity: quantity || null,
        pricePaid: pricePaid || null,
        priceSold: priceSold || null,
        tradeType: tradeType || null,
        // rating: rating || null,
        notes: notes || null,
      });
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  // TODO: work out a fix
  // eslint-disable-next-line class-methods-use-this
  saveTrade(trade) {
    const { editMode, editId } = { ...this.state };

    if (editMode) {
      return API.put('trades', `/trades/${editId}`, {
        body: trade,
      });
    }

    return API.post('trades', '/trades', {
      body: trade,
    });
  }

  deleteTrade() {
    const { match } = { ...this.props };
    return API.del('trades', `/trades/${match.params.id}`);
  }

  async handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this trade?',
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
    const { history } = { ...this.props };
    try {
      await this.deleteTrade();
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    const {
      editMode,
      tradeDate,
      ticker,
      quantity,
      pricePaid,
      priceSold,
      tradeType,
      // rating,
      notes,
      isLoading,
      isDeleting,
    } = { ...this.state };
    return (
      <div className="NewTrade">
        <Form
          onSubmit={this.handleSubmit}
          ref={this.formRef}
        >

          <Row>
            <Col>
              <Form.Group controlId="tradeDate">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Date</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={tradeDate}
                    placeholder="MM/DD"
                    as={DatePicker}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="tradeType">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={tradeType || ''}
                    as="select"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Regular">Regular</option>
                    <option value="Short">Short</option>
                    <option value="Call">Call</option>
                    <option value="Put">Put</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="ticker">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Ticker</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={ticker || ''}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="quantity">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Quantity</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={quantity || ''}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="pricePaid">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Price Paid</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={pricePaid || ''}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="priceSold">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Price Sold</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={priceSold || ''}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="notes">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Notes</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    onChange={this.handleChange}
                    value={notes || ''}
                    as="textarea"
                    size="sm"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Button
            block
            disabled={!this.validateForm() || isLoading}
            type="submit"
          >
            {isLoading ? 'Saving..' : 'Save'}
          </Button>
          {
            editMode
            && (
            <Button
              block
              bsStyle="danger"
              disabled={isDeleting}
              onClick={this.handleDelete}
            >
              {isDeleting ? 'Deleteing..' : 'Delete'}
            </Button>
            )
          }
        </Form>
      </div>
    );
  }
}
