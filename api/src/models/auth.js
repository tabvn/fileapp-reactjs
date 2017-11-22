import {ObjectID} from 'mongodb'
import _ from 'lodash'

export default class Auth {


	constructor(app){

		this.app = app;


		this.createToken = this.createToken.bind(this);

		this.model = {
			userId: null,
			expire: null,
		}


	}


	createToken(user, expire = null, cb = () => {}){

		let model = this.model;


		const db = this.app.db;

		model.userId = user._id;
		model.expire = expire;

		db.collection('tokens').insertOne(model, (err, token) => {
			return cb(err, model);

		});


	}

	checkAuth(req, cb = () => {}){

		const token = req.get('authorization');

		if(!token){
			return cb(false);
		}


		const db = this.app.db;

		const query = {
			_id: new ObjectID(token)
		}
		db.collection('tokens').find(query).limit(1).toArray((err, tokenObjects) => {

			const tokenObj = _.get(tokenObjects, '[0]', null);

			if(err === null && tokenObj){

				return cb(true);
			}

			return cb(false);
			

		});

		
	}





}