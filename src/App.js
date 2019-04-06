import React, { Component } from 'react';
import './App.css';
import * as rp from "request-promise";
import * as cheerio from 'cheerio';
import Remarkable from 'remarkable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wotcUrl: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ wotcUrl: e.target.value.trim() });
  }

  handleSubmit(e) {
    e.preventDefault();
    const options = {
      uri: `https://cors-anywhere.herokuapp.com/${this.state.wotcUrl}`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };
    const regex = /[\d\)]/g;

    rp(options)
    .then(($) => {
      const scrapedData = [];
      const {wotcUrl} = this.state;
      $('h4').each(function(i, elem) {
        const parts = $(this).text().split(' (');
        const username = parts[0];
        const chaff = parts[1].replace(' ', '_').replace(regex, '').toLowerCase();
        scrapedData.push({ 
          name: username, 
          url: `${wotcUrl}#${username.replace(' ', '_').replace(regex, '').toLowerCase()}_${chaff}`
        });
      })
      const markup = scrapedData.map(data => {
        return `* [${data.name.replace(/_/, '\\_')}](${data.url}): **[archetype]**`
      })
      this.setState(state => ({
        wotcUrl: '',
        scrapeResults: markup.join("\r\n"),
        scrapeTest: markup[0]
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getRawMarkup() {
    const md = new Remarkable();
    return { __html: md.render(this.state.scrapeTest) };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">        
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="url-input">
              URL to scrape:&nbsp;
            </label>
            <input
              id="url-input"
              onChange={this.handleChange}
              value={this.state.wotcUrl}
            />
            <br />
            <button>
              Scrape
            </button>
          </form>
          <textarea readOnly style={{ width: 1400, height: 600 }} value={this.state.scrapeResults} />
          <div
          className="content"
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
        </header>
      </div>
    );
  }
}

export default App;
