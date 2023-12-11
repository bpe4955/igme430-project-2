const { set } = require('mongoose');
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');
const { useState, useEffect } = React;


const handlePassChange = (e) => {
    e.preventDefault();
    const message = document.querySelector('#passMessage');
    message.innerText = '';
    const oldPass = e.target.querySelector('#oldpass').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!oldPass || !pass || !pass2) {
        helper.handleError({error: 'All fields must be filled'});
        return false;
    }
    if (pass !== pass2) {
        helper.handleError({error: 'Passwords don\'t match!'});
        return false;
    }
    if (oldPass === pass) {
        helper.handleError({error: 'New Password cannot match current password!'});
        return false;
    }

    helper.sendPost(e.target.action, { oldPass, pass, pass2 }, result => {
        if (result.message) {
            document.querySelector("#changePassForm").reset();
            message.innerText = 'Password Changed';
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
                <div><label htmlFor='currentpass'>Old&nbsp;Pass: </label>
                    <input id='oldpass' type='text' name='currentpass' placeholder='Current Pass' />
                </div>
                <div>
                    <label htmlFor='pass'>Password: </label>
                    <input id='pass' type='text' name='pass' placeholder='password' />
                </div>
                <div>
                    <label htmlFor='pass2'>Password: </label>
                    <input id='pass2' type='text' name='pass2' placeholder='retype password' />
                </div>
                <input type='submit' className='formSubmit' value='Change' />
                <p id="passMessage" class="statusMessage"></p>
            </form>
        </div>
    );
};

const handleVIPChange = (e) => {
    e.preventDefault();
    const message = document.querySelector('#vipMessage');
    message.innerText = '';

    const VIPField = document.querySelector("#vip-checkbox");

    helper.sendPost(e.target.action, { vip: VIPField.checked, }, result => {
        if (result.message) {
            sessionStorage.vip = VIPField.checked;
            message.innerText = 'VIP Status Changed';
            // Update the colors available to the user
            helper.sendGet('/getColors', (result) => {loadColors(result.colors);})
        }
    });

    return false;
};

// Functional stateless component for SignupWindow
const ChangeVIPWindow = (props) => {
    return (
        <div class='mainForm'>
            <h3>Change&nbsp;VIP</h3>
            <form action='/changeVIP' onSubmit={handleVIPChange} method='POST'
                name='changeVIPForm' id='changeVIPForm'>
                <div>
                    <label for="vip-checkbox">VIP: </label>
                    <input type="checkbox" name='vip-checkbox' id='vip-checkbox'/>
                </div>
                <input type="submit" value="Set VIP Status" />
                <p id="vipMessage" class="statusMessage"></p>
            </form>
        </div>
    );
};

const handleColorChange = (e) => {
    e.preventDefault();
    const message = document.querySelector('#colorMessage');
    message.innerText = '';

    const colorField = document.querySelector("#colorField");

    helper.sendPost(e.target.action, { color: colorField.value, }, result => {
        if (result.message) {
            sessionStorage.color = colorField.value;
            message.innerText = 'Color Changed';
        }
    });

    return false;
};

let loadColors;

// Functional component for ChangeColorWindow
const ChangeColorWindow = (props) => {
    const [colors, setColors] = useState(props.colors);

    useEffect(() => {
        helper.sendGet('/getColors', (result) => {
            setColors(result.colors);
        }
    )}, []);

    loadColors = (loadedColors) => {setColors(loadedColors);}

    const colorList = colors.map((color) => {
        return(
                <option key={color} value={color}>{color}</option>
        );
    });

    return (
        <div class='mainForm'>
            <h3>Change&nbsp;Color</h3>
            <form action='/changeColor' onSubmit={handleColorChange} method='POST'
                name='changeColorForm' id='changeColorForm'>
                <div>
                    <label for="color">Color: </label>
                    <select id='colorField' name="color">
                        {colorList}
                    </select>
                </div>
                <input type="submit" value="Set Color" />
                <p id="colorMessage" class="statusMessage"></p>
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

    
    constvipDiv = document.createElement('div');
    ReactDOM.render(<ChangeVIPWindow />, constvipDiv);
    document.querySelector('#content').appendChild(constvipDiv);
    helper.sendGet('/getVip', (result) => {
        if(result.vip){
            document.querySelector('#vip-checkbox').checked = true;
        }
        else { document.querySelector('#vip-checkbox').checked = false; }
    });

    const colorDiv = document.createElement('div');
    ReactDOM.render(<ChangeColorWindow colors={[]}/>, colorDiv);
    document.querySelector('#content').appendChild(colorDiv);
    

};

window.onload = init;