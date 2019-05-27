import React, { Component } from 'react';
import { API, Storage } from 'aws-amplify';
import { Form } from 'react-bootstrap';
import { s3Upload, s3Delete } from '../libs/awsLib';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './Trades.scss';

export default class Trades extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      trade: null,
      content: '',
      attachmentURL: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const trade = await this.getTrade();
      const { content, attachment } = trade;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        trade,
        content,
        attachmentURL,
      });
    } catch (e) {
      alert(e);
    }
  }

  getTrade() {
    const { match } = { ...this.props };
    return API.get('trades', `/trades/${match.params.id}`);
  }

  validateForm() {
    const required = ['tradeDate', 'ticker', 'quantity', 'pricePaid', 'type'];

    const valid = required.filter((req) => {
      if (this.state[req] && this.state[req].trim().length > 0) {
        return false;
      }
      return true;
    });

    return valid.length === 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleFileChange(event) {
    // eslint-disable-next-line
    this.file = event.target.files[0];
  }

  saveTrade(trade) {
    const { match } = { ...this.props };
    return API.put('trades', `/trades/${match.params.id}`, {
      body: trade,
    });
  }

  async handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      const { content, trade } = { ...this.state };
      const { history } = { ...this.props };
      await this.saveTrade({
        content,
        attachment: attachment || trade.attachment,
      });
      if (trade.attachment) {
        await s3Delete(trade.attachment);
      }
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
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

    const { trade } = { ...this.state };
    const { history } = { ...this.props };
    try {
      await this.deleteTrade();
      if (trade.attachment) {
        await s3Delete(trade.attachment);
      }
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    const {
      trade, content, attachmentURL, isLoading, isDeleting,
    } = { ...this.state };
    return (
      <div className="Trades">
        {trade
          && (
          <form onSubmit={this.handleSubmit}>
            <Form.Group controlId="content">
              <Form.Control
                onChange={this.handleChange}
                value={content}
                componentClass="textarea"
              />
            </Form.Group>
            {trade.attachment
              && (
              <Form.Group>
                <Form.Label>Attachment</Form.Label>
                <Form.Control.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={attachmentURL}
                  >
                    {this.formatFilename(trade.attachment)}
                  </a>
                </Form.Control.Static>
              </Form.Group>
              )}
            <Form.Group controlId="file">
              {!trade.attachment
                && <Form.Label>Attachment</Form.Label>}
              <Form.Control onChange={this.handleFileChange} type="file" />
            </Form.Group>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
          )}
      </div>
    );
  }
}
