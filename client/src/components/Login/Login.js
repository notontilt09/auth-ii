import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import './Login.css';

axios.defaults.withCredentials = true;

const url = 'http://localhost:5000';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            isRegistering: false,
            errorMsg: '',
          }
    }

    componentDidMount() {
        localStorage.clear();
    }
    
    handleChanges = e => {
        this.setState({
        [e.target.name]: e.target.value
        })
    }
    
    handleSubmit = e => {
        e.preventDefault();
        axios.post(`${url}/api/auth/login`, { username: this.state.username, password: this.state.password })
        .then(res => {
            localStorage.setItem('token', res.data.token);
            // localStorage.setItem('user', JSON.stringify(res.data.user));
            this.setState({
                isLoggedIn: true,
                errorMsg: ''
            });
            this.props.history.push('/users');
        })
        .catch(err => {
            this.setState({
            errorMsg: err.response.data.message
        })
        })
    }
    
    navToRegister = e => {
        e.preventDefault();
        this.setState({
        isRegistering: true,
        })
        this.props.history.push('/register')
    }
    
    render() {
        return (
        <div className="App">
            <h1>Auth Practice</h1>
            {!this.state.isLoggedIn && !this.state.isRegistering &&
            <>
                <form onSubmit={this.handleSubmit} className="login-form">
                <input 
                    required 
                    type='text' 
                    name='username' 
                    placeholder='username'
                    value={this.state.username} 
                    onChange={this.handleChanges} 
                />
                <input 
                    required 
                    type='password' 
                    name='password' 
                    placeholder='password'
                    value={this.state.password} 
                    onChange={this.handleChanges} 
                />
                <button type='submit'>Login</button>
                <button onClick={this.navToRegister}>Click here to register a new account.</button>
                </form>
                {this.state.errorMsg &&
                    <section className='error'>
                        <h3>{this.state.errorMsg}</h3>
                    </section>
                }
            </>
            }
        </div>
        );
    }
}
      
export default withRouter(Login);
