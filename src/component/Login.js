import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {Spin} from 'antd';
import Home from './Home';
import firebase from 'firebase/app';
import FirebaseApp from '../utils/FirebaseApp';
import Logo from './Logo';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            isLoading: true
        }
    }

    // Configure FirebaseUI.
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = FirebaseApp.auth().onAuthStateChanged(
            (user) => this.setState({
                isSignedIn: !!user,
                isLoading: false
            })
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        if (this.state.isLoading) return <Spin style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}/>;

        if (!this.state.isSignedIn) {
            return (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <Logo/>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={FirebaseApp.auth()}/>
                </div>
            );
        }
        return <Home/>
    }
}

export default Login