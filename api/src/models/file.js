import _ from 'lodash'

class File {

    constructor(app) {
        this.app = app;

        this.model = {
            name: null,
            originalName: null,
            mimeType: null,
            size: null,
            etag: null,
            created: new Date(),
        }
    }

    initWithObject(object) {
        this.model.name = _.get(object, 'key');
        this.model.originalName = _.get(object, 'originalname');
        this.model.mimeType = _.get(object, 'mimetype');
        this.model.size = _.get(object, 'size');
        this.model.etag = _.get(object, 'etag');
        this.model.created = new Date();
        return this;
    }

    toJSON() {
        return this.model;
    }

}

export default File;