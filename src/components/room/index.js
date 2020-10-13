import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {Redirect, Route, Switch} from 'react-router-dom';
import UserRoom from '../user-room'
import {connect} from 'react-redux';
import {addRoomAdminMessage, registerUser, removeUser} from "../../context/actions";
import {ROOM} from "../../context/constants";
import RightPanel from "../small-components/right-pannel";
import AdminRoom from '../admin-room';

const Container = styled.div`
    padding: 2rem 2rem 4rem 2rem;
    margin: 0; 
    background-color: ${({theme}) => theme.error};
    height: 700px;
    overflow: hidden;
`;

const InnerContainer = styled.div`
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.background}; 
    width:inherit;
    height: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Room = ({messages, onRemoveUser, onAddRoomAdminMessage, onRegisterUser}) => {
    const [title, setTitle] = useState('Admin');

    const globalChatConfiguration = useCallback((props) => setTitle(props.title), []);

    useEffect(() => {

        const channel = window.Ably.channels.get(ROOM);

        /*to keep hearing the ROOM chanel messages and update the global message status */
        channel.attach();
        channel.once('attached', () => {
            channel.history((err, page) => {
                /* create a new array with comments */
                let oldMessages = Array.from(page.items, item => ({name: item.clientId, message: item.data}));
                oldMessages.length > 0 && onAddRoomAdminMessage(oldMessages);

                channel.subscribe((msg, err) => {
                    let messageIncoming = {name: msg['name'], message: msg['data']};
                    let newMessage = messages.concat(messageIncoming);
                    onAddRoomAdminMessage(newMessage)
                });
            });
        });

        /* to get the presence of old and new users and update the global status*/
        channel.presence.subscribe('enter', function (member) {
            console.log(member.clientId + ' entered realtime-chat');

            /* this feature is under review */
            // channel.publish('log', `${member.clientId} just entered the realtime-chat`);

            channel.presence.get(function (err, members) {
                console.log('There are ' + members.length + ' members on this channel');
                let usersOnline = Array.from(members, member => ({name: member.clientId, online: true}));
                onRegisterUser(usersOnline);
            });
        });

        /* to get the presence of old and new users and update the global status*/
        channel.presence.subscribe('leave', function (member) {
            console.log(member.clientId + ' just leaved the realtime-chat');
            onRemoveUser(member.clientId);

            /* this feature is under review */
            // channel.publish('log', `${member.clientId} just leaved the realtime-chat`);
        });

    }, []);

    return (
        <Container height={window.innerHeight}>
            <InnerContainer>
                <Switch>
                    <Route path="/user">
                        <UserRoom globalChatConfiguration={globalChatConfiguration}/>
                    </Route>
                    <Route path="/admin">
                        <AdminRoom/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/admin"/>
                    </Route>
                </Switch>
                <RightPanel title={title}/>
            </InnerContainer>
        </Container>
    )
};

const mapStateToProps = ({roomReducer}) => ({
    messages: roomReducer.messages,
});

const mapDispatchToProps = (dispatch) => ({
    onAddRoomAdminMessage: (messages) => addRoomAdminMessage(dispatch, messages),
    onRegisterUser: (user) => registerUser(dispatch, user),
    onRemoveUser: (name) => removeUser(dispatch, name),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);