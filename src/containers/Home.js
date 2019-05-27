import React, { Component } from 'react';
import { ListGroup, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { API } from 'aws-amplify';
import './Home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      trades: [],
    };
  }

  async componentDidMount() {
    const { isAuthenticated } = { ...this.props };
    if (!isAuthenticated) {
      return;
    }

    try {
      const trades = await this.trades();
      this.setState({ trades });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  trades() {
    return API.get('trades', '/trades');
  }

  renderTradesList(trades) {
    return (
      <Table striped responsive bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price Paid</th>
            <th>Price Sold</th>
            <th>Gain($)</th>
            <th>Gain(%)</th>
            <th>Capital</th>
          </tr>
        </thead>
        <tbody>
          {
            trades.map(
              (trade) => {
                console.log(trade)
                const date = new Date(trade.tradeDate).toDateString();
                return (

                  <LinkContainer
                    key={trade.tradeId}
                    to={`/trades/${trade.tradeId}`}
                  >
                    <tr header={trade.content}>
                      <td>{date.substring(0, date.length - 5)}</td>
                      <td>{trade.ticker}</td>
                      <td>{trade.tradeType}</td>
                      <td>{trade.quantity}</td>
                      <td>{trade.pricePaid ? `$${Number(trade.pricePaid).toFixed(2)}` : ''}</td>
                      <td>{trade.priceSold ? `$${Number(trade.priceSold).toFixed(2)}` : ''}</td>
                      <td>{trade.gainDollars ? `$${Number(trade.gainDollars).toFixed(2)}` : ''}</td>
                      <td>{trade.gainPercent ? `${Number(trade.gainPercent).toFixed(2)}%` : ''}</td>
                      <td>{trade.capital ? `$${Number(trade.capital).toFixed(2)}` : ''}</td>
                    </tr>
                  </LinkContainer>
                );
              },
            )
          }
        </tbody>
      </Table>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Trade Tracker</h1>
        <p>A simple trade tracking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderTrades() {
    const { isLoading, trades } = { ...this.state };
    return (
      <div className="trades">
        <ListGroup>
          {!isLoading && this.renderTradesList(trades)}
        </ListGroup>
      </div>
    );
  }

  render() {
    const { isAuthenticated } = { ...this.props };
    return (
      <div className="Home">
        {isAuthenticated ? this.renderTrades() : this.renderLander()}
      </div>
    );
  }
}
