import React,{Component} from 'react'
import Home from '../pages/home'
import View from '../pages/view'
import {Router,Route, Switch} from 'react-router-dom'

import {history} from "../history";
import TopBar from '../components/top-bar'
import LoginForm from '../components/login'
class Layout extends Component{


    constructor(props){
        super(props);

        this.state = {

            showLoginForm: false

        }
    }

    render(){

        const {showLoginForm} = this.state;

        return (
            <div className={'app-layout'}>
                <TopBar onShowLoginForm={() => {

                        this.setState({
                            showLoginForm: true,
                        });

                }} />
                {showLoginForm ? <LoginForm onClose={() => {
                      this.setState({
                            showLoginForm: false,
                        });

                }} /> : null}

                <Router history={history}>
                    <Switch>
                        <Route exact path={'/'} component={Home}/>
                        <Route exact path={'/share/:id'} component={View}/>
                    </Switch>
                </Router>

            </div>
        )
    }
}

export default Layout;