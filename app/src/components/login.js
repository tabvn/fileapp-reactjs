import React, {Component} from 'react'

export default class LoginForm extends Component{

	constructor(props){
		super(props);

		this.state = {
			isLogin: true,
			user: {
				name: "",
				email: "",
				password: "",
				confirmPassword: ""
			}
		}


		this._onSubmit = this._onSubmit.bind(this)
		this._onTextFieldChange = this._onTextFieldChange.bind(this);
	}


	_onSubmit(event){

		const {isLogin,user} = this.state; 
		event.preventDefault();


		console.log("FOrm is submitted as: ", isLogin  ? "Login" : "Register", 'data:', user);
	}

	_onTextFieldChange(e){

		let {user} = this.state;


		const fieldName = e.target.name;
		const fieldValue = e.target.value;


		user[fieldName] = fieldValue;

		this.setState({user: user});



	}
	render(){

		const {isLogin, user} = this.state;

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
									!isLogin ? <div>
										

										<div className="app-form-item">
											<label htmlFor="name-id">Name</label>
											<input value={user.name} onChange={this._onTextFieldChange} placeholder="Your name" id="name-id" type="text" name="name" />
										</div>
									</div>: null
								}
								<div className="app-form-item">
									<label htmlFor="email-id">Email</label>
									<input value={user.email} onChange={this._onTextFieldChange} placeholder="Your email address" id="email-id" type="email" name="email" />
								</div>
								<div className="app-form-item">
									<label htmlFor="password-id">Password</label>
									<input value={user.password} onChange={this._onTextFieldChange} placeholder="Your password" id="password-id" type="password" name="password" />
								</div>

								{
									!isLogin ? <div>

											<div className="app-form-item">
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