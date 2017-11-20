import _ from 'lodash'


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
	}


	initWithObject(obj){

		this.model.name = _.trim(_.get(obj, 'name', null));
		this.model.email = _.toLower(_.trim(_.get(obj, 'email', null)));
		this.model.password = _.get(obj, 'password', null);


		return this;
	}

	create(cb){

		const model = this.model;
		const db = this.app.db;

		db.collection('users').insertOne(model, (err, result) => {
			return cb(err, model);
		});

	}

}