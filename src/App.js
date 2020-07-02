import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {subReddit: "pennystocks", topJson:[], subJson:[], tickers: {}};
    // This binding is necessary to make `this` work in the callback
    this.start = this.start.bind(this);
  }

  loadJSON(url, callback) {
    fetch(url)
        .then(res => res.json())
        .then(result => {
              console.log(result);
              callback(result);
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





  start() {
    if (this.state.subReddit.length === 0) {
      return alert('please enter a subreddit');
    }
    let url = "https://www.reddit.com/r/"+this.state.subReddit+".json";
    const that = this; // since loadJSON takes an 'anyonymous' function, it cannot use .bind
    this.loadJSON(url, function(result) {
      that.setState({topJson: result.data.children});
      result.data.children.map( (item, i) => {
        if (item.kind === 't3') {
          that.parseForTickers(item.data);
        } else {
          that.parseForTickers(item.data);
        }
        let commentURL = "https://www.reddit.com/r/"+that.state.subReddit+"/comments/"+item.data.id+".json";
        console.log("NEXT UP  " + commentURL);
        /** jahi  THIS NEXT LINE WILL NOT WORK.
         * you can look at the console under "NEXT UP" to see the structure of comments
         * you'll need to write a new function to pass as the callback to loadJSON below
         * that callback should receive a comment object, so you'll need to parse the results of loadJSON a little deeper.
        **/
        that.loadJSON(commentURL, (comments) => {

          comments.map( (item) => {
            item.data.children.map((itemA) => {
              that.parseForTickers(itemA.data);
            });
          });

        });


        return true;
      });
    });
  }

  //parsing -> traversing parts of a data structure to access a specific value point;

  parseForTickers(jsonComments) {
    // console.log(jsonComments);
    let text = jsonComments.selftext || jsonComments.body || jsonComments.title;
    if (!text) {
      return console.log('NO TEXT PROPERTY FOUND', jsonComments);
    }
    // console.log("parsing ", text);
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

    var nextComments = {};
    if (jsonComments.num_comments && jsonComments.num_comments.length > 0) {
      if (jsonComments.num_comments > 0) {
        this.parseForTickers(nextComments);
      }
    }

    if (jsonComments.replies && jsonComments.replies.length > 0) {
      nextComments = {};
      this.parseForTickers(nextComments);
    }
  }


  render(){
    var tickerLis = [];

    let keyEntries = Object.entries(this.state.tickers).sort((a,b) => {
      return (b[1] - a[1])
    });

    keyEntries.map( ([prop, val]) => {
      tickerLis.push(<li key={prop}> {prop}: <span>{val}</span></li>)
    });

  console.log(JSON.stringify(this.state.tickers));


    return (
      <div className="search-console">
          <input type="text" onChange={e => this.setState({subReddit: e.target.value})}
                 value={this.state.subReddit} placeholder="Enter subreddit name" />
          <button className="searc-btn" onClick={this.start}>Search</button>
        <ul>
          {tickerLis}
        </ul>
      </div>
    );
  }
}

export default App;
