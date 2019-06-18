import firebase from 'firebase/app';
import firebaseApp from './FirebaseApp';
import {translate} from './index';

const database = firebaseApp.database();
const getMessagesRef = (groupId) => database.ref(`messages/${groupId}/content`);

export const messageTypes = {
    TEXT: 'TEXT',
    FILE: 'FILE'
};

export const addMessage = async (groupId, messageObject) => {
    const messagesRef = getMessagesRef(groupId);
    const key = messagesRef.push().key;
    const keyBot = messagesRef.push().key;
    return messagesRef.update({
        [key]: {
            ...messageObject,
            id: key,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
    }).then(async () => {
        translate(messageObject.content).then(data => {
            messageObject.from.uid = '123456';
            messageObject.from.username = 'Chatbot';
            messageObject.content = data['data']['text'][0];
            messagesRef.update({
                [keyBot]: {
                    ...messageObject,
                    id: keyBot,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }
            })
        });
    })
};

export const makeMessage = (type, content, user) => {
    if (!content) return null; // if message is an empty string
    if (!/\S/.test(content)) return null; // if message contains only whitespaces
    return {
        type,
        content,
        from: {
            uid: user.uid,
            username: user.displayName,
            photoURL: user.photoURL
        }
    }
};

export const onMessagesDataChange = (groupId, handler) => {
    const visibleMessagesRef = getMessagesRef(groupId).orderByChild('timestamp').limitToLast(100);
    return visibleMessagesRef.on('value', snapshot => {
        const messages = [];
        snapshot.forEach(messageSnapshot => {
            messages.push(messageSnapshot.val())
        });
        handler(messages)
    })
};
export const offMessagesDataChange = (groupId, onFunction) => {
    const visibleMessagesRef = getMessagesRef(groupId).orderByChild('timestamp').limitToLast(100);
    visibleMessagesRef.off('value', onFunction)
};
