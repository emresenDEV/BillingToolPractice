import React from "react";

class ErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false, error: null };
}

static getDerivedStateFromError(error) {
// Update state so the next render shows the fallback UI
return { hasError: true, error };
}

componentDidCatch(error, errorInfo) {
// Log the error to the console or an error reporting service
console.error("Error caught by ErrorBoundary:", error, errorInfo);
}

render() {
if (this.state.hasError) {
    // Fallback UI
    return <div>Something went wrong: {this.state.error?.message}</div>;
}
return this.props.children;
}
}

export default ErrorBoundary;
