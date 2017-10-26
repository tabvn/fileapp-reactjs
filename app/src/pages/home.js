import React,{Component} from 'react'
import Header from '../components/header'
import HomeForm from "../components/home-form";

class Home extends Component{


    render() {

        return (

            <div className={'app-container'}>
                <Header/>
                <div className={'app-content'}>
                    <HomeForm/>
                </div>
            </div>
        )
    }
}


export default Home;