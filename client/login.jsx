const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Function attached to the "sign in" button
// Requires both username and password fields to have a value
const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });

    return false;
};

// Function attached to the "sign up" button
// Checks for errors before passing data to the server
const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        return false;
    }
    if (pass !== pass2) {
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
};

// Functional stateless component for LoginWindow
const LoginWindow = (props) => {
    return (
        <form action='/login' onSubmit={handleLogin} method='POST'
            name='loginForm' id='loginForm' className='mainForm'>
            <div>
                <label htmlFor='username'>Username: </label>
                <input id='user' type='text' name='username' placeholder='username' />
            </div>
            <div>
                <label htmlFor='pass'>Password: </label>
                <input id='pass' type='text' name='pass' placeholder='password' />
            </div>
            <input type='submit' className='formSubmit' value='Sign in' />
        </form>
    );
};

// Functional stateless component for SignupWindow
const SignupWindow = (props) => {
    return (
        <form action='/signup' onSubmit={handleSignup} method='POST'
            name='signupForm' id='signupForm' className='mainForm'>
            <div>
                <label htmlFor='username'>Username: </label>
                <input id='user' type='text' name='username' placeholder='username' />
            </div>
            <div>
                <label htmlFor='pass'>Password: </label>
                <input id='pass' type='text' name='pass' placeholder='password' />
            </div>
            <div>
                <label htmlFor='pass2'>Password: </label>
                <input id='pass2' type='text' name='pass2' placeholder='retype password' />
            </div>
            <input type='submit' className='formSubmit' value='Sign up' />
        </form>
    );
};

// Set up connections and events
const init = () => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow />,
            document.querySelector('#content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow />,
            document.querySelector('#content'));
        return false;
    });


    ReactDOM.render(<LoginWindow />,
        document.querySelector('#content'));
};

window.onload = init;