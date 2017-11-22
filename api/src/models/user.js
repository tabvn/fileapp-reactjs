import _ from 'lodash'
import bcrypt from 'bcrypt'


const saltRounds = 10;

export default class User{



	constructor(app){

		this.app = app;



		this.model = {
			name: null,
			email: null,
			password: null,
			created: new Date(),
			updated: null,
		}


		this.findUserByEmail = this.findUserByEmail.bind(this);
	}


	initWithObject(obj){

		this.model.name = _.trim(_.get(obj, 'name', null));
		this.model.email = _.toLower(_.trim(_.get(obj, 'email', null)));
		this.model.password = _.get(obj, 'password', null);




		return this;
	}

	validate(cb = () => {}){


		let errors = [];


		const model = this.model;
		const db = this.app.db;


		if(model.password.length < 3 ){

			errors.push({
				message: "Password should more than 3 characters."
			});
		}

		

		

		this.findUserByEmail(model.email, (err, user) => {


			if(err || user){

				errors.push({message: "Email already exists."});
			}


			return cb(errors);
		});



	}

	findUserByEmail(email = null, callback = () => {}){
		const db = this.app.db;

		const query = {
			email: email
		};

		db.collection('users').find(query).limit(1).toArray((err, result) => {
			return callback(err, _.get(result, '[0]', null));
		}); 


	}
	create(cb){

		let model = this.model;
		const db = this.app.db;

		const hashPassword = bcrypt.hashSync(model.password, saltRounds);
		model.password = hashPassword;
		
		this.validate((errors) => {



			let messages = [];

			if(errors.length > 0){

				_.each(errors, (err) => {

					messages.push(err.message);
				});

				return cb(_.join(messages, ','), null);
				
			}
			
			db.collection('users').insertOne(model, (err, result) => {
					return cb(err, model);
			});

		});


		

	}

}