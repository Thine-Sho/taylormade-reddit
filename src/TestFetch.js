import React from 'react';
import './App.css';


export default class TestFetch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    console.log("Works");
    fetch("https://www.reddit.com/r/pennystocks.json")
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

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.data.domain} {item.data.author}
            </li>
          ))}
        </ul>
      );
    }
  }
}