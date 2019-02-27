import React from 'react';
import { withRouter } from 'react-router-dom';

import './Register.css';
import axios from 'axios';

const url = 'http://localhost:5000';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            department: '',
            errorMsg: '',
        }
    }

    handleChanges = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.username.length > 2 && this.state.password.length > 7) {
            axios.post(`${url}/api/register`, {username: this.state.username, password: this.state.password, department: this.state.department })
                .then(res => {
                    this.props.history.push('/');
                })
                .catch(err => {
                    this.setState({ errorMsg: err.response.data.message });
                })
        } else {
            this.setState({
                errorMsg: 'Please format credentials'
            })
        }
    }

    

    render() {
        return (
            <div className='register-form'>
                <h1>Register New User</h1>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        required 
                        type='text' 
                        name='username' 
                        placeholder='username'
                        value={this.state.username} 
                        onChange={this.handleChanges} 
                    />
                    {this.state.username && this.state.username.length < 3 &&
                        <h4 className="input-error">Username must be at least 3 characters</h4>
                    }
                    <input 
                        required 
                        type='password' 
                        name='password' 
                        placeholder='password'
                        value={this.state.password} 
                        onChange={this.handleChanges} 
                    />
                    {this.state.password && this.state.password.length < 8 &&
                        <h4 className='input-error'>Password must be at least 8 characters</h4>
                    }
                    <input 
                        required 
                        type='text' 
                        name='department' 
                        placeholder='department'
                        value={this.state.department} 
                        onChange={this.handleChanges} 
                    />
                    <button type='submit'>Register</button>
                </form>
                {this.state.errorMsg && 
                    <h3 className='error'>{this.state.errorMsg}</h3>    
                }
            </div>
        )
    }
}

export default withRouter(Register);