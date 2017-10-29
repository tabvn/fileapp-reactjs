import React, {Component} from 'react'
import Header from '../components/header'
import HomeForm from "../components/home-form";
import HomeUploading from '../components/home-uploading'
import HomeUploadSent from '../components/home-upload-sent'
import _ from 'lodash'

class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {
            componentName: 'HomeForm',
            data: null,
            uploadEvent: null,
        };


        this._renderComponent = this._renderComponent.bind(this)

    }


    _renderComponent() {

        const {componentName, data, uploadEvent} = this.state;

        switch (componentName) {

            case 'HomeUploading':

                return <HomeUploading onCancel={() => {

                    this.setState({
                        uploadEvent: null,
                        data: null,
                        componentName: 'HomeForm'
                    })

                }} event={uploadEvent} data={data}/>


            case 'HomeUploadSent':


                return (
                    <HomeUploadSent onSendAnotherFile={() => {

                        this.setState({
                            componentName: 'HomeForm'
                        })

                    }} data={data}/>
                );


            default:
                return <HomeForm
                    onUploadEvent={(event) => {

                        let data = this.state.data;

                        if(_.get(event, 'type') === 'success'){

                            data = _.get(event, 'payload');
                        }
                        this.setState(
                            {
                                data: data,
                                uploadEvent: event,
                                componentName: (_.get(event, 'type') === 'success') ? 'HomeUploadSent': this.state.componentName,
                            }
                        );
                    }}
                    onUploadBegin={(data) => {

                        this.setState({
                            data: data,
                            componentName: 'HomeUploading',
                        });

                    }}/>
                return
        }
    }

    render() {

        return (

            <div className={'app-container'}>
                <Header/>
                <div className={'app-content'}>

                    {this._renderComponent()}

                </div>
            </div>
        )
    }
}


export default Home;