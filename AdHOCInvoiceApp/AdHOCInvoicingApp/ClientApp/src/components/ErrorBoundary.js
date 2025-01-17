import React, { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Logging", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div>Ooops....Something went wrong</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
