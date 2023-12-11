const handleError = (result) => {
    const errorDiv = document.querySelector("#error");
    errorDiv.hidden = false;
    errorDiv.innerHTML = `<p><b>Error</b>: ${result.error}</p>`;
    if(result.status){
        errorDiv.innerHTML += `<p><b>Status</b>: ${result.status}</p>`;
    }
};

const clearError = () => {
    const errorDiv = document.querySelector("#error");
    errorDiv.innerHTML = "";
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

    if(result.error) {
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