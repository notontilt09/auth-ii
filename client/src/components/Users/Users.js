import React from 'react'
import axios from 'axios';

import './Users.css';

axios.defaults.withCredentials = true;

const url = 'http://localhost:5000'

class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            users: [],
            currentUser: ''
        }
    }

    componentDidMount() {
        axios.get(`${url}/api/users`, { 'headers': {
            'Authorization': localStorage.getItem('token')
        }})
            .then(res => {
                console.log(res);
                this.setState({
                    users: res.data,
                    isLoggedIn: true,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    routeToLogin = e => {
        e.preventDefault();
        this.props.history.push('/');
    }

    logout = e => {
        e.preventDefault();
        localStorage.removeItem('token')
        this.props.history.push('/');
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <div className='users'>
                    <button onClick={this.logout}>Logout</button>
                    <h2>Users List</h2>
                    {localStorage.getItem('user') && 
                        <h3>Logged in as {JSON.parse(localStorage.getItem('user')).username}</h3>
                    }
                    <div className='users-list'>
                        {this.state.users.map(user => {
                            return (
                                <div key={user.username} className='user'>
                                    <h2>Username</h2>
                                    <h3>{user.username}</h3>  
                                    <h2>Password-Hash</h2>
                                    <h3>{user.password}</h3>
                                    <h2>Department</h2>
                                    <h3>{user.department}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="back-to-login">
                    <h2>Please Log In!</h2>
                    <button onClick={this.routeToLogin}>Login</button>
                </div>
            )
        }
    }
}

export default Users