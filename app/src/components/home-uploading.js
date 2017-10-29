import React, {Component} from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {betterNumber} from "../helpers";


class HomeUploading extends Component{


    constructor(props){
        super(props);

        this.state = {
            startTime: new Date(),
            lastLoaded: 0,
            speedUpload: 0,
            data: null,
            loaded: 0,
            total: 0,
            percentage: 10,
        }



    }

    componentDidMount(){
        const {data} = this.props;



        this.setState({
            data: data
        });
    }
    componentWillReceiveProps(nextProps) {
        const {event} = nextProps;



        switch (_.get(event, 'type')){

            case 'onUploadProgress':

                const loaded = _.get(event,'payload.loaded', 0);
                const total = _.get(event, 'payload.total', 0);
                const percentage = total !== 0 ? (loaded/total) * 100 : 0;


                const currentTime = new Date();
                let diffTimeBetweenStartAndCurrent = currentTime - this.state.startTime; // this is miliseconds. not Second.

                //Formular
               /* 1 milisecond = X ?
                diffTimeBetweenStartAndCurrent = loaded;


                so: x = loaded * 1 /diffTimeBetweenStartAndCurrent = */

               if(diffTimeBetweenStartAndCurrent === 0){
                   diffTimeBetweenStartAndCurrent = 1;
               }

               const speedPerOneMilisecond = ((loaded - this.state.lastLoaded) / diffTimeBetweenStartAndCurrent);

               const speedPerSecond = speedPerOneMilisecond * 1000;



                this.setState({
                    speedUpload: speedPerSecond,
                    startTime: currentTime,
                    lastLoaded: loaded,
                    loaded: loaded,
                    total: total,
                    percentage:percentage
                });

                break;

            default:

                break;
        }


    }
    render(){

    const {percentage, data,total,loaded,speedUpload} = this.state;

    const totalFiles = _.get(data, 'files', []).length;

        return (
            <div className={'app-card app-card-uploading'}>

                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>

                            <div className={'app-home-uploading'}>

                                <div className={'app-home-uploading-icon'}>

                                    <i className={'icon-upload'} />
                                    <h2>Sending...</h2>
                                </div>

                                <div className={'app-upload-files-total'}>Uploading {totalFiles} files.</div>


                                <div className={'app-progress'}>
                                    <span style={{width: `${percentage}%`}} className={'app-progress-bar'} />
                                </div>

                                <div className={'app-upload-stats'}>
                                    <div className={'app-upload-stats-left'}>{betterNumber(loaded)}/{betterNumber(total)}</div>
                                    <div className={'app-upload-stats-right'}>{betterNumber(speedUpload)}/s</div>
                                </div>

                                <div className={'app-form-actions'}>
                                    <button onClick={() => {

                                        if(this.props.onCancel){
                                            this.props.onCancel(true)
                                        }
                                    }} className={'app-upload-cancel-button app-button'} type={'button'}>Cancel</button>
                                </div>

                            </div>
                        </div>
                    </div>

            </div>
        )
    }

}

HomeUploading.propTypes = {
    data: PropTypes.object,
    event: PropTypes.object,
    onCancel: PropTypes.func
}
export default HomeUploading;