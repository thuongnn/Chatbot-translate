import React from 'react';
import {Avatar} from 'antd';
import {timestampToDateTime} from '../../../utils';
import * as MessageContent from './components/MessageContent';
import './Message.css'

import {messageTypes} from '../../../utils/DBFirebase';

export default ({message, isOwned}) => {

    let messageContent;

    switch (message.type) {
        case messageTypes.TEXT:
            messageContent = <MessageContent.Text
                isOwned={isOwned}
                timestamp={message.timestamp}
            >{message.content}</MessageContent.Text>;
            break;
        case messageTypes.FILE:
            break;
        default:
            messageContent = <div>{`Undefined message type: ${message.type}`}</div>
    }

    return isOwned ? (
        <div className="ownedContainer">
            <div className="ownedMessage">
                {messageContent}
                <p className="userName">{timestampToDateTime(message.timestamp)}</p>
            </div>
        </div>
    ) : (
        <div className="unownedContainer">
            <a href={message.from.photoURL}>
                <Avatar src={message.from.photoURL}/>
            </a>
            <div className="unownedMessage">
                {messageContent}
                <p className="userName">{timestampToDateTime(message.timestamp)}</p>
            </div>
        </div>
    )
}