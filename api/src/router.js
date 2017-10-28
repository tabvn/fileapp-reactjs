import path from 'path'
import {version} from '../package.json'
import _ from 'lodash'
import File from './models/file'
import Post from './models/post'
import {ObjectID} from 'mongodb'

class AppRouter {

    constructor(app) {
        this.app = app;
        this.setupRouters();
    }


    setupRouters() {

        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.get('upload');

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


                    console.log("user request via api/upload with data", req.body, result);


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

                const filePath = path.join(uploadDir, fileName);

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

                });
            });


        });


        // routing for post detail /api/posts/:id

        app.get('/api/posts/:id', (req, res, next) => {

            const postId = _.get(req, 'params.id');
            let postObjectId = null;
            try {
                postObjectId = new ObjectID(postId);
            }
            catch (err) {

                return res.status(404).json({error: {message: 'File not found.'}});

            }

            db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
                let result = _.get(results, '[0]');

                if(err || !result){
                    return res.status(404).json({error: {message: 'File not found.'}});
                }

                const fileIds = _.get(result, 'files', []);

                db.collection('files').find({_id: {$in: fileIds}}).toArray((err, files) => {

                    if(err || !files || !files.length){
                        return res.status(404).json({error: {message: 'File not found.'}});
                    }

                    result.files = files;

                    return res.json(result);

                });


            })


        });


    }

}


export default AppRouter;