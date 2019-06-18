import React, {Component} from 'react';
import {Row, Card} from 'antd';
import firebaseApp from '../utils/FirebaseApp';
import {setLang, getLang} from '../utils';
import Chatbox from './ChatBox';
import Logo from './Logo';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            currentGroupId: ''
        }
    }

    componentDidMount() {
        this.createGroupChat().then(session => {
            if (!getLang()) setLang('en'); // set default language to translate
            this.setState({
                user: {
                    uid: session['uid'],
                    email: session['email'],
                    displayName: session['displayName'],
                    photoURL: session['photoURL']
                },
                currentGroupId: session['uid']
            })
        });
    }

    createGroupChat = async () => {
        let session = firebaseApp.auth().currentUser.toJSON();
        if (!session) return;

        let messagesRef = await firebaseApp.database().ref('/messages/' + session['uid']);
        // create group chat with user id
        if (!messagesRef) await messagesRef.set({
            name: 'GUEST',
            content: {}
        });

        return session;
    };

    render() {
        return (
            <Row>
                <Logo/>
                <Card className="content">
                    <Chatbox
                        currentUser={this.state.user}
                        currentGroupId={this.state.currentGroupId}
                    />
                </Card>
            </Row>
        )
    }
}

export default Home;