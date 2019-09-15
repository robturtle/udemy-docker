import React, { Component } from "react";
import axios from "axios";

export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ""
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get("/api/values");
    if (typeof values === "string") {
      // the standalone image will also handle `/api/*` calls so
      // axios.get will return the webpage document instead of the
      // JSON object we expected.
      return;
    }

    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/indexes");
    if (typeof seenIndexes === "string") {
      // the standalone image will also handle `/api/*` calls so
      // axios.get will return the webpage document instead of the
      // JSON object we expected.
      return;
    }

    this.setState({ seenIndexes: seenIndexes.data });
  }

  renderSelectedIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          index: {key},  value: {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  handleSubmit = async event => {
    event.preventDefault();

    await axios.post("/api/indexes", {
      index: this.state.index
    });
    this.setState({ index: "" });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSelectedIndexes()}
        {this.renderValues()}
      </div>
    );
  }
}
