import React, { Component } from 'react';
import './App.css';
import * as rp from "request-promise";
import * as cheerio from 'cheerio';
import Remarkable from 'remarkable';

const credits = "^(Direct link formatting thanks to /u/FereMiyJeenyus and [their web scraper](https://old.reddit.com/r/magicTCG/comments/brbhfg/i_made_a_useful_tool_for_anyone_who_posts_mtgo/)! If you encounter any dead or broken links, or have any questions/praise, please reach out to them!)"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrapeResults: '',
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
    if (this.state.wotcUrl.startsWith("https://magic.wizards.com"))
    {
      const options = {
        uri: `https://cors-anywhere.herokuapp.com/${this.state.wotcUrl}`,
        transform: function (body) {
          return cheerio.load(body);
        }
      };
      const regex = /[^A-Za-z _-]/g;
      const spaces = / /g;

      rp(options)
      .then(($) => {
        const scrapedData = [];
        const {wotcUrl} = this.state;
        $('h4').each(function(i, elem) {
          const parts = $(this).text().split(' (');
          const username = parts[0];
          let chaff = ''
          if (parts[1]){
            chaff = parts[1].replace(regex, '').replace(spaces, '_').toLowerCase();
          }
          scrapedData.push({ 
            name: username, 
            url: `${wotcUrl}#${username.replace(regex, '').replace(spaces, '_').toLowerCase()}${chaff ? '_' + chaff : ''}`
          });
        })
        const markup = scrapedData.map(data => {
          return `* [archetype](${data.url}): **${data.name.replace(/[_]/g, '\\_')}**`
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
          <textarea readOnly style={{ width: 1400, height: 600 }} value={`${this.state.scrapeResults}\r\n\r\n${credits}`} />
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
