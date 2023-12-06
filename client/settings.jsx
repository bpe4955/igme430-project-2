const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');


const handlePassChange = (e) => {
    e.preventDefault();
    const oldPass = e.target.querySelector('#oldpass').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!oldPass || !pass || !pass2) {
        return false;
    }
    if (pass !== pass2) {
        return false;
    }
    if (oldPass === pass) {
        return false;
    }

    helper.sendPost(e.target.action, { oldPass, pass, pass2 }, result => {
        if(result.message){
            document.querySelector("#changePassForm").reset();
        }
    });

    return false;
};



// Functional stateless component for ChangePassWindow
const ChangePassWindow = (props) => {
    return (
        <div class='mainForm'>
            <h3>Change&nbsp;Password</h3>
        <form action='/changePass' onSubmit={handlePassChange} method='POST'
            name='changePassForm' id='changePassForm'>
            <label htmlFor='currentpass'>Old&nbsp;Pass: </label>
            <input id='oldpass' type='text' name='currentpass' placeholder='Current Pass' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='text' name='pass' placeholder='password' />
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='text' name='pass2' placeholder='retype password' />
            <input type='submit' className='formSubmit' value='Change' />
        </form>
        </div>
    );
};

const handleColorChange = (e) => {
    e.preventDefault();

    const colorField = document.querySelector("#colorField");

    helper.sendPost(e.target.action, { color: colorField.value, }, result => {
        if(result.message) {
            sessionStorage.color = colorField.value;
        }
    });

    return false;
};

// Functional stateless component for SignupWindow
const ChangeColorWindow = (props) => {
    return (
        <div class='mainForm'>
            <h3>Change&nbsp;Color</h3>
            <form action='/changeColor' onSubmit={handleColorChange} method='POST'
                name='changeColorForm' id='changeColorForm'>
                <label for="color">Color: </label>
                <select id='colorField' name="color">
                    <option value='black'>Black</option>
                    <option value='blue'>Blue</option>
                    <option value='red'>Red</option>
                </select>
                <input type="submit" value="Set Color" />
            </form>
        </div>
    );
};

const init = () => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    const passDiv = document.createElement('div');
    ReactDOM.render(<ChangePassWindow />, passDiv);
    document.querySelector('#content').appendChild(passDiv);

    const colorDiv = document.createElement('div');
    ReactDOM.render(<ChangeColorWindow />, colorDiv);
    document.querySelector('#content').appendChild(colorDiv);

};

window.onload = init;