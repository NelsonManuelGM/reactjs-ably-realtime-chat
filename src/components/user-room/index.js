import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import ChatWindow from '../small-components/chat-window';
import {useLocation} from "react-router-dom";
import {connect} from "react-redux";
import {ROOM} from "../../context/constants";
import * as Ably from 'ably';
import UserButton from "../small-components/user-button";
import {Window} from "../small-components/chat-window/window";

const Container = styled.div`
    padding: 0; 
    background-color: ${({theme}) => theme.secondary};
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.background}; 
    width:inherit;
    height: inherit;
    display: flex;
    flex-direction: row;
`;

const ContactBar = styled.div`
    height: inherit;
    width: 300px;
    margin-right: 0.5rem;
    padding: 2rem 2rem;
    display: flex;
    flex-direction: column;
    background-color: ${({theme}) => theme.transparent}; 
    border-top-left-radius: ${({theme}) => theme.borderRadius};
    border-bottom-left-radius: ${({theme}) => theme.borderRadius};
    overflow: auto;
    
    height: -moz-available;          /* WebKit-based browsers will ignore this. */
    height: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    height: fill-available;
`;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const UserRoom = ({usersList, messages, globalChatConfiguration}) => {
    const [messagesReceived, setMessagesReceived] = useState([]); // {name:null, message:null}
    const [target, setTarget] = useState('');

    let query = useQuery();
    let name = query.get("name") || `Unknown ${Math.random().toFixed()}`;

    useEffect(() => {
        globalChatConfiguration({title: name});
        window.Ably.auth.requestToken({clientId: '*'}, function (err, token) {
            const realtime = new Ably.Realtime({token: token});
            const channel = realtime.channels.get(ROOM);
            channel.presence.enterClient(name); // => Bob entered realtime-chat

            const ownChannel = realtime.channels.get(name);

            /*to keep hearing my OWN chanel messages and update the my status */
            ownChannel.attach();
            ownChannel.once('attached', () => {
                ownChannel.history((err, page) => {
                    /* create a new array with comments */
                    let myOldMessages = Array.from(page.items, item => ({name: item.clientId, message: item.data}));
                    console.log("myOldMessages", myOldMessages);

                    ownChannel.subscribe((msg, err) => {
                        let messageIncoming = {name: `message from ${msg['name']}`, message: msg['data']};
                        console.log("myNewMessage", messageIncoming);
                        setMessagesReceived([messageIncoming]);
                    });
                });
            });
        });
    }, []);

    const nameCallBack = useCallback((contactName) => {
        setTarget(contactName);
    },[]);

    const sendMessageCallback = (message)=>{
        const contactChannel = window.Ably.channels.get(target);
        contactChannel.publish(name, message);
        let messageToSend= {name: `From ${name} to ${target}`, message: message};
        setMessagesReceived([messageToSend]);
    };

    const userMenu = useMemo(()=>
        <ContactBar>
            {
                usersList.filter(user=>user.name !== name).map((user, index) => (
                    <UserButton key={index} name={user.name} action={nameCallBack}>
                        {user.name}
                    </UserButton>
                ))
            }
        </ContactBar>, [usersList]);

    return <Container>
        { userMenu }
        <Window messages={messages} windowTitle={"Admin's panel"}/>
        <ChatWindow myPrefix={name} target={target} windowTitle={`My ( ${name} ) panel`}
                    sendMessageCallback={sendMessageCallback} messages={messagesReceived}/>

    </Container>
};

const mapStateToProps = ({roomReducer}) => ({
    messages: roomReducer.messages,
    usersList: roomReducer.users,
});

export default connect(mapStateToProps, undefined)(UserRoom);