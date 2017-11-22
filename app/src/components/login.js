import React, {Component} from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import {isEmail} from '../helpers/email'
import {createUser, login} from '../helpers/user'

export default class LoginForm extends Component{

	constructor(props){
		super(props);

		this.state = {
			message: null,
			isLogin: true,
			user: {
				name: "",
				email: "",
				password: "",
				confirmPassword: ""
			},

			error: {
				name: null,
				email: null,
				password: null,
				confirmPassword: null,
			}
		}


		this._onSubmit = this._onSubmit.bind(this)
		this._onTextFieldChange = this._onTextFieldChange.bind(this);
		this._formValidation = this._formValidation.bind(this)
	}

	_formValidation(fieldsToValidate = [], callback = () => {}){
		const {isLogin, user} = this.state;

		const allFields = {

			name: {
				message: "Your name is required.",
				doValidate: () => {
					const value = _.trim(_.get(user, 'name', ""));

				
					if(value.length > 0){
						return true;
					}

					return false;
				}
			},

			email: {
				message: "Email is not correct",
				doValidate: () => {

					const value = _.get(user, 'email', '');

					if(value.length >0 && isEmail(value)){

						return true;
					}
					return false;
				}
			},

			password: {
				message: "Password shoud has more than 3 characters.",
				doValidate: () => {


					const value = _.get(user, 'password', '');


					if(value && value.length > 3){

							return true;
					}

					return false;

				}
			},

			confirmPassword: {
				message: "Password does not match.",
				doValidate: () => {


					const passwordValue = _.get(user, 'password');
					const value = _.get(user, 'confirmPassword', '');


					if(passwordValue === value){
							return true;
					}

					return false;

				}
			}

		};



		let errors = this.state.error;

		_.each(fieldsToValidate, (field) => {

				const fieldValidate = _.get(allFields, field);
				if(fieldValidate){

					errors[field] = null;

					const isFieldValid = fieldValidate.doValidate();

					if(isFieldValid === false){
						errors[field] = _.get(fieldValidate, 'message');
					}
				}

		});



		this.setState({
			error: errors,
		}, () => {
		
			console.log("After processed validation the form errors", errors);

			let isValid = true;

			_.each(errors, (err) => {

				if(err){
					isValid = false;

				}
			});

			callback(isValid);

		})

		

	}
	_onSubmit(event){

		const {isLogin,user} = this.state; 
		event.preventDefault();


		let fieldNeedToValidate = ['email', 'password'];

		if(!isLogin){

			fieldNeedToValidate = ['name', 'email', 'password', 'confirmPassword'];
		}


		this._formValidation(fieldNeedToValidate,(isValid) => {


				console.log("The form is validated? ", isValid);


				if(isValid){

					// send request to backend
					if(isLogin){
						// do send data for login endpoint

						login(this.state.user.email, this.state.user.password).then((response) => {

							/// login success

							this.setState({
								message: {
									type: 'success',
									message: 'Login successful.'
								}
							});


						}).catch((err) => {


							// login not suscess.
							this.setState({
								message: {
									type: 'error',
									message: 'An error login!'
								}
							});
							console.log(err);
						})


					}else{

						createUser(this.state.user).then((response) => {

							console.log("Hey i got data after send post", response);
						});
					}
					

				}
				//console.log("FOrm is submitted as: ", isLogin  ? "Login" : "Register", 'data:', user);

		});

		
	}

	_onTextFieldChange(e){

		let {user} = this.state;


		const fieldName = e.target.name;
		const fieldValue = e.target.value;


		user[fieldName] = fieldValue;

		this.setState({user: user});



	}
	render(){

		const {isLogin, user, error,message} = this.state;

		const title = isLogin ? 'Sign In' : 'Sign Up'
		return (
				<div className="app-login-form">

					<div className="app-login-form-inner">
							<button onClick={() => {

								if(this.props.onClose){
										this.props.onClose(true);
								}

							}} className="app-dismiss-button">Close</button>
							<h2 className="form-title">{title}</h2>
							<form onSubmit={this._onSubmit}>

								{
									message ? <div className="app-message">
										<p className={message.type}>{message.message}</p>
									</div>: null
								}

								{
									!isLogin ? <div>
										

										<div className={classNames('app-form-item', {'error': _.get(error, 'name')})}>
											<label htmlFor="name-id">Name</label>
											<input value={user.name} onChange={this._onTextFieldChange} placeholder="Your name" id="name-id" type="text" name="name" />
										</div>
									</div>: null
								}
								<div className={classNames('app-form-item', {'error': _.get(error, 'email')})}>
									<label htmlFor="email-id">Email</label>
									<input value={user.email} onChange={this._onTextFieldChange} placeholder="Your email address" id="email-id" type="email" name="email" />
								</div>
								<div className={classNames('app-form-item', {'error': _.get(error, 'password')})}>
									<label htmlFor="password-id">Password</label>
									<input value={user.password} onChange={this._onTextFieldChange} placeholder="Your password" id="password-id" type="password" name="password" />
								</div>

								{
									!isLogin ? <div>

											<div className={classNames('app-form-item', {'error': _.get(error, 'confirmPassword')})}>
												<label htmlFor="confirm-password-id">Confirm Password</label>
												<input value={user.confirmPassword} onChange={this._onTextFieldChange} placeholder="Confirm password" id="confirm-password-id" type="password" name="confirmPassword" />
										</div>
									</div>: null
								}

								{
									isLogin ? <div className="app-form-actions">
										<button className="app-button primary">Sign In</button>
										<div className="app-form-description">
											<div>Don't have an account ? <button type="button" onClick={() => {
													this.setState({isLogin: false});
											}} className="app-button app-button-link">Sign Up</button></div>
											
										</div>
								</div> : <div className="app-form-actions">
										<button className="app-button primary">Sign Up</button>
										<div className="app-form-description">
											<div>Don't have an account ? <button type="button" onClick={() => {

													this.setState({isLogin: true});

											}} className="app-button app-button-link">Sign In</button></div>
											
										</div>
									</div>
								}
							</form>
					</div>
				</div>
			)
	}

}