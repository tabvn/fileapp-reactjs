import React, {Component} from 'react'

export default class LoginForm extends Component{



	render(){

		return (
				<div className="app-login-form">

					<div className="app-login-form-inner">
							<button onClick={() => {

								if(this.props.onClose){
										this.props.onClose(true);
								}

							}} className="app-dismiss-button">Close</button>
							<h2 className="form-title">Sign In</h2>
							<form>
								<div className="app-form-item">
									<label htmlFor="email-id">Email</label>
									<input placeholder="Your email address" id="email-id" type="email" name="email" />
								</div>
								<div className="app-form-item">
									<label htmlFor="password-id">Password</label>
									<input placeholder="Your password" id="password-id" type="password" name="password" />
								</div>

								<div className="app-form-actions">
										<button className="app-button primary">Sign In</button>
										<div className="app-form-description">
											<div>Don't have an account ? </div>
											<button className="app-button">Sign Up</button>
										</div>
								</div>
							</form>
					</div>
				</div>
			)
	}

}