

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

const handleError = (result) => {
    const errorDiv = document.querySelector("#error");
    if(errorDiv.innerHTML === ""){
        ReactDOM.render(<Error error={result.error}/>, errorDiv);
    }
    else{
        updateError(result.error);
    }
    errorDiv.hidden = false;
};

const clearError = () => {
    const errorDiv = document.querySelector("#error");
    errorDiv.hidden = true;
};

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