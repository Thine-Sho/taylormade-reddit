import React from 'react';
import logo from './logo.svg';
import './App.css';
import TestFetch from './TestFetch';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {subReddit: "", tickers: {}};
    // This binding is necessary to make `this` work in the callback
    this.start = this.start.bind(this);
  }

  start(subreddit) {
    let url = "https://www.reddit.com/r/"+subreddit+".json";
    let json = this.loadJSON(url);

    //pasrse -> sentence to object

    for(var i=0; i < json.data.children; i++) {
      this.parseForTickets(json.data.children[i]);
      let commentURL = "https://www.reddit.com/r/pennystocks/comments/"+json.data.children[i].id+".json";;
      let jsonComments = this.loadJSON(commentURL);
      this.parseForTickers(jsonComments);
    }


  }


  loadJSON(url) {
    console.log("Works");
    fetch(url)
      .then(res => res.json())
      .then(

        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            items: result.data.children
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }


  //parsing -> traversing parts of a data structure to access a specific value point;

  parseForTickets(jsonComments) {
    let text = jsonComments.title || jsonComments.selftext || jsonComments.body;
    let matches = text.match(/[A-Z]{3}/g); // weak regex for stock tickers
    // matches = ["HFS", "GPX", "AJS"];

    let tickers = {...this.state.tickers};

    for(var m in matches) {
      // this.state.tickers[matches[m]]++;
      if( typeof tickers[matches[m]] == "undefined")
      {
        tickers[matches[m]] = 0;
      }
      tickers[matches[m]]++;
    }

    this.setState({tickers: tickers});

    if (jsonComments.num_comments > 0) {
      var nextComments = {};
      this.parseForTickets(nextComments);
    }

    if (jsonComments.replies.length > 0) {
      var nextComments = {};
      this.parseForTickets(nextComments);
    }
  }

  render()
  {
    return (
      <div>
        <form>
          <input type="text" className="reddit-search" name="reddit-name" placeholder="enter reddit url" />
          <button className="searc-btn" onClick={this.start}>Search</button>
        </form>
        <testFetch />
      </div>
    );
  }
}

export default App;