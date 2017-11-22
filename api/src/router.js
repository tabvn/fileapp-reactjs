import path from 'path'
import {version} from '../package.json'
import _ from 'lodash'
import File from './models/file'
import Post from './models/post'
import {ObjectID} from 'mongodb'
import FileArchiver from './archiver'
import Email from './email'
import S3 from './s3'
import User from './models/user'
import Auth from './models/auth'

class AppRouter {

    constructor(app) {
        this.app = app;
        this.setupRouters();
    }


    setupRouters() {

        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.upload;

        // root routing.
        app.get('/', (req, res, next) => {

            return res.status(200).json({
                version: version
            });

        });

        // Upload routing
        app.post('/api/upload', upload.array('files'), (req, res, next) => {
            const files = _.get(req, 'files', []);


            let fileModels = [];


            _.each(files, (fileObject) => {
                const newFile = new File(app).initWithObject(fileObject).toJSON();
                fileModels.push(newFile);
            });


            if (fileModels.length) {

                db.collection('files').insertMany(fileModels, (err, result) => {
                    if (err) {

                        return res.status(503).json({
                            error: {
                                message: "Unable saved your files.",
                            }
                        });
                    }


                    let post = new Post(app).initWithObject({

                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: result.insertedIds,
                    }).toJSON();


                    // let save post object to posts collection.

                    db.collection('posts').insertOne(post, (err, result) => {


                        if (err) {
                            return res.status(503).json({error: {message: "Your upload could not be saved."}});
                        }

                        //implement email sending to user with download link.

                        // send email
                        const sendEmail = new Email(app).sendDownloadLink(post, (err, info) => {


                        });


                        // callback to react app with post detail.
                        return res.json(post);

                    });


                });

            } else {

                return res.status(503).json({
                    error: {message: "Files upload is required."}
                });
            }
        });

        // Download routing

        app.get('/api/download/:id', (req, res, next) => {

            const fileId = req.params.id;
            db.collection('files').find({_id: ObjectID(fileId)}).toArray((err, result) => {

                const fileName = _.get(result, '[0].name');
                if (err || !fileName) {

                    return res.status(404).json({
                        error: {
                            message: "File not found."
                        }
                    })
                }


                // Download file from S3 service
                const file = _.get(result, '[0]');
                const downloader = new S3(app, res);


                // return downloader.download(file); Proxy download from s3 service

                // Download Directly from S3


                const downloadUrl = downloader.getDownloadUrl(file);

                return res.redirect(downloadUrl);







                /*const filePath = path.join(uploadDir, fileName);

                return res.download(filePath, _.get(result, '[0].originalName'), (err) => {

                    if (err) {

                        return res.status(404).json({

                            error: {
                                message: "File not found"
                            }
                        });
                    } else {

                        console.log("File is downloaded.");

                    }

                });*/



            });


        });


        // routing for post detail /api/posts/:id

        app.get('/api/posts/:id', (req, res, next) => {

            const postId = _.get(req, 'params.id');

            this.getPostById(postId, (err, result) => {


                if (err) {
                    return res.status(404).json({error: {message: 'File not found.'}});
                }

                return res.json(result);
            })


        });

        // Routing download zip files.
        app.get('/api/posts/:id/download', (req, res, next) => {

            const id = _.get(req, 'params.id', null);


            this.getPostById(id, (err, result) => {

                if (err) {
                    return res.status(404).json({error: {message: 'File not found.'}});
                }

                const files = _.get(result, 'files', []);
                const archiver = new FileArchiver(app, files, res).download();
                return archiver;

            })
        });


        // Create new users post

        app.post('/api/users', (req, res, next) => {

        

            const body = _.get(req, 'body');

            console.log("Data from fontend posted: ", body);

            const user = new User(app);
            user.initWithObject(body).create((err, newUser) => {


                console.log("New user created with error & callback", err, newUser);


                if(err){
                    return res.status(503).json({
                        error: {message: err}
                    });
                }
                return res.status(200).json(newUser);
            });



        });


        // Login user 

        app.post('/api/users/login', (req, res, next) => {

            const body = _.get(req, 'body', {});

            const user = new User(app);

            const email = _.get(body, 'email');
            const password = _.get(body, 'password');


            user.login(email, password, (err, token) => {

                    if(err){

                        return res.status(401).json({
                            message: "An error login your account. Please try again!"
                        });
                    }

                    return res.status(200).json(token);
            });


            

        });

        // get my profile detail
        app.get('/api/users/:id', (req, res, next) => {



            const auth = new Auth(app);

            auth.checkAuth(req, (isLoggedIn) => {


                if(!isLoggedIn){

                    return res.status(401).json({
                        message: "Unauthorized"
                    });
                }


                const userId = _.get(req, 'params.id', null);

                const user = new User(app).findById(userId, (err, obj) => {


                        if(err){

                            return res.status(404).json({
                                message: "User not found."
                            });
                        }

                        return res.status(200).json(obj);

                 });



            });

            



            


        });

    }


    getPostById(id, callback = () => {
    }) {


        const app = this.app;

        const db = app.get('db');


        let postObjectId = null;
        try {
            postObjectId = new ObjectID(id);
        }
        catch (err) {

            return callback(err, null);

        }

        db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
            let result = _.get(results, '[0]');

            if (err || !result) {
                return callback(err ? err : new Error("File not found."));
            }

            const fileIds = _.get(result, 'files', []);

            db.collection('files').find({_id: {$in: fileIds}}).toArray((err, files) => {

                if (err || !files || !files.length) {
                    return callback(err ? err : new Error("File not found."));
                }

                result.files = files;


                return callback(null, result);

            });


        })
    }

}


export default AppRouter;