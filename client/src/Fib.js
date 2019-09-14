import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
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
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/indexes");
    this.setState({ seenIndexes: seenIndexes.data });
  }
}
