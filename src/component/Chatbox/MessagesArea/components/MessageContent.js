import React from 'react';
import MessageBubble from './MessageBubble';

export const Text = ({children, isOwned, isFile}) => isOwned ?
    <MessageBubble
        backgroundColor="#3F51B5"
        color='#fff'
        isOwned={isOwned}
        isFile={isFile}
    >{children}
    </MessageBubble> :
    <MessageBubble
        backgroundColor="#eee"
        color='#000'
        isOwned={isOwned}
        isFile={isFile}
    >{children}
    </MessageBubble>;