import React, {Component} from 'react';
import {Button, Input, Drawer, Radio} from 'antd';
import * as DBFirebase from '../../../utils/DBFirebase';
import firebaseApp from '../../../utils/FirebaseApp';
import lang from '../../../utils/lang';
import {getLang} from '../../../utils';
import './InputField.css';

const {TextArea} = Input;

class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            selected: getLang(),
            visible: false
        };
    }

    // show drawer settings
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    // close drawer settings
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    // select language
    onChange = e => {
        window.localStorage.setItem('locale', e.target.value);
        this.setState({
            selected: e.target.value,
        });
    };

    sendMessage = () => {
        const {currentUser, currentGroupId} = this.props;
        const {message} = this.state;

        const messageObject = DBFirebase.makeMessage(
            DBFirebase.messageTypes.TEXT,
            message,
            currentUser
        );

        if (messageObject) DBFirebase.addMessage(currentGroupId, messageObject);

        this.setState({message: ''});
    };

    handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {  // if enter with no shift get pressed
            event.preventDefault();
            event.stopPropagation();
            this.sendMessage();
        }
    };

    render() {
        const state = this.state;
        const currentUser = this.props.currentUser;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const options = lang.languages.map(data => {
            return (
                <Radio key={data.value} style={radioStyle} value={data.value}>
                    {data.label}
                </Radio>
            )
        });

        const title = (
            <div>
                Settings
                <br/><a href={`mailto:${currentUser.email}`} style={{fontWeight: 300}}>{currentUser.email}</a>
            </div>
        );

        return (
            <div className="input-field-outerContainer">
                <div className="input-field-container">
                    <TextArea
                        id='input-typing-field'
                        placeholder="Enter the message"
                        autosize
                        value={state.message}
                        onChange={e => this.setState({message: e.target.value})}
                        onKeyDown={this.handleKeyDown}
                    />
                    <Button
                        type="primary"
                        icon="heart"
                        shape="round"
                        style={{marginRight: '5px'}}
                        onClick={this.sendMessage}
                    />
                    <Button
                        type="primary"
                        icon="setting"
                        shape="round"
                        onClick={this.showDrawer}
                    />
                    <Drawer
                        title={title}
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}>
                        <p>Select the language to translate</p>
                        <Radio.Group onChange={this.onChange} value={this.state.selected}>
                            {options}
                        </Radio.Group>
                        <button className="logout" onClick={() => firebaseApp.auth().signOut()}>
                            Logout
                        </button>
                    </Drawer>
                </div>
            </div>
        );
    }
}

export default InputField;