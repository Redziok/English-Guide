import axios from 'axios';
import React, { Component } from 'react';
import '../styles/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { API_CALL } from '../components/constants';

function withParams(Component) {
	return function (props) {
		return <Component {...props} params={useNavigate()} />;
	};
}

export class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			password: '',
			isRegisterForm: false,
			isPasswordWrong: false,
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.username != this.state.username || prevState.password != this.state.password) {
			this.setState({ isPasswordWrong: false });
		}
	}

	loginDataHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleRegisterForm = (e) => {
		this.setState({ isRegisterForm: !this.state.isRegisterForm });
	};

	loginHandler = (e) => {
		e.preventDefault();
		const body = {
			login: this.state.username,
			password: this.state.password,
		};

		axios
			.post(`${API_CALL}/User/login`, body, { withCredentials: true })
			.then((res) => {
				this.props.params('/');
				this.props.loggedIn();
			})
			.catch((err) => {
				this.setState({ isPasswordWrong: true });
			});
	};

	registerHandler = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('login', this.state.username);
		formData.append('email', this.state.email);
		formData.append('password', this.state.password);
		axios
			.post(`${API_CALL}/User/register`, formData)
			.then((res) => {
				this.setState({ isRegisterForm: false });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<div className={!this.state.isRegisterForm ? 'login-form-container' : 'register-form-container'}>
				{!this.state.isRegisterForm && (
					<form onSubmit={this.loginHandler}>
						<div className="login-form">
							<h2>Sign in</h2>
							<label>Login</label>
							<input
								type="text"
								className={!this.state.isPasswordWrong ? 'username' : 'username wrong-credentials-error'}
								placeholder="Username"
								name="username"
								onChange={this.loginDataHandler}
								required
							/>
							<label>Password</label>
							<input
								type="password"
								className={!this.state.isPasswordWrong ? 'password' : 'password wrong-credentials-error'}
								placeholder="Password"
								name="password"
								onChange={this.loginDataHandler}
								required
							/>
							{this.state.isPasswordWrong && <p className="wrong-credentials-text">Username or password was incorrect</p>}
							<p className="register-href" onClick={this.handleRegisterForm}>
								Register a new account
							</p>
							<button className="login" type="submit">
								Login
							</button>
						</div>
					</form>
				)}
				{this.state.isRegisterForm && (
					<form onSubmit={this.registerHandler}>
						<div className="register-form">
							<h2>Sign up</h2>
							<label>Login</label>
							<input
								type="text"
								className="username"
								placeholder="Username"
								name="username"
								onChange={this.loginDataHandler}
								required
							/>
							<label>Email</label>
							<input type="text" className="email" placeholder="Email" name="email" onChange={this.loginDataHandler} required />
							<label>Password</label>
							<input
								type="password"
								className="password"
								placeholder="Password"
								name="password"
								onChange={this.loginDataHandler}
								required
							/>
							<p className="register-href" onClick={this.handleRegisterForm}>
								I already have an account
							</p>
							<button className="register" type="submit">
								Register
							</button>
						</div>
					</form>
				)}
			</div>
		);
	}
}

export default withParams(LoginForm);
