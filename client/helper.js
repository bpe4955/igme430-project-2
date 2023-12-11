const React = require('react');
const ReactDOM = require('react-dom');
const { useState, useEffect } = React;

let updateError;

// React component to show error messages
const Error = (props) => {
    const [error, setError] = useState(props.error);

    updateError = (error) => {
        setError(error);
    }

    return (
        <div>
            <p><b>Error</b>: {error}</p>
        </div>
    );
}

// When an error occurs, either create an Error component or update the existing component
const handleError = (result) => {
    const errorDiv = document.querySelector("#error");
    if (errorDiv.innerHTML === "") {
        ReactDOM.render(<Error error={result.error} />, errorDiv);
    }
    else {
        updateError(result.error);
    }
    errorDiv.hidden = false;
};

// Hide the error message
const clearError = () => {
    const errorDiv = document.querySelector("#error");
    errorDiv.hidden = true;
};

// Send a POST request to the server
// Handles errors and can call a function after getting a response
const sendPost = async (url, data, handler) => {
    clearError();
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result);
    }

    if (handler) {
        handler(result);
    }
};

// Send a GET request to the server
// Handles errors and can call a function after getting a response
const sendGet = async (url, handler) => {
    clearError();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    const result = await response.json();

    if (handler) {
        handler(result);
    }
    else { return result; }
};

module.exports = {
    sendPost,
    sendGet,
    handleError,
    clearError
};