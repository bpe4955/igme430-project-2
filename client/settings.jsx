const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');
const { useState, useEffect } = React;


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
        if (result.message) {
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
            </form>
        </div>
    );
};

const handleVIPChange = (e) => {
    e.preventDefault();

    const VIPField = document.querySelector("#vip-checkbox");

    helper.sendPost(e.target.action, { vip: VIPField.checked, }, result => {
        if (result.message) {
            sessionStorage.vip = VIPField.checked;
        }
    });

    return false;
};

// Functional stateless component for SignupWindow
const ChangeVIPWindow = (props) => {
    const [colors, setColor] = useState(props.colors);

    return (
        <div class='mainForm'>
            <h3>Change&nbsp;VIP</h3>
            <form action='/changeVIP' onSubmit={handleVIPChange} method='POST'
                name='changeColorForm' id='changeColorForm'>
                <div>
                    <label for="vip-checkbox">VIP: </label>
                    <input type="checkbox" name='vip-checkbox' id='vip-checkbox' />
                </div>
                <input type="submit" value="Set Color" />
            </form>
        </div>
    );
};

const handleColorChange = (e) => {
    e.preventDefault();

    const colorField = document.querySelector("#colorField");

    helper.sendPost(e.target.action, { color: colorField.value, }, result => {
        if (result.message) {
            sessionStorage.color = colorField.value;
        }
    });

    return false;
};

// Functional stateless component for SignupWindow
const ChangeColorWindow = (props) => {
    const [colors, setColor] = useState(props.colors);

    // const colorList = props.colors.map((color) => {
    //     if(color.selected){
    //         return(
    //             <div key={color.color}>
    //                 <option value={color.color} selected>{color.color}</option>
    //             </div> 
    //         );
    //     }
    //     return(
    //         <div key={color.color}>
    //             <option value={color.color}>{color.color}</option>
    //         </div> 
    //     );
    // });

    return (
        <div class='mainForm'>
            <h3>Change&nbsp;Color</h3>
            <form action='/changeColor' onSubmit={handleColorChange} method='POST'
                name='changeColorForm' id='changeColorForm'>
                <div>
                    <label for="color">Color: </label>
                    <select id='colorField' name="color">
                        {/* {colorList} */}
                        <option value="black">black</option>
                        <option value="blue">blue</option>
                        <option value="red">red</option>
                    </select>
                </div>
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

    constvipDiv = document.createElement('div');
    ReactDOM.render(<ChangeVIPWindow />, constvipDiv);
    document.querySelector('#content').appendChild(constvipDiv);

};

window.onload = init;