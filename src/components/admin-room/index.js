import React, {useMemo} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import SendIcon from '@material-ui/icons/Send';
import {ROOM} from "../../context/constants";
import TextField from "@material-ui/core/TextField";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MessageIcon from '@material-ui/icons/Message';
import UserButton from "../small-components/user-button";
import {Window} from "../small-components/chat-window/window";

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

const AdminRoom = ({messages, usersList}) => {

    const onClickHandler = (event) => {
        event.preventDefault();
        let input = document.getElementById('input-admin');
        let message = {user: "admin", message: input.value};
        const value = input.value.replace(/\s/g, '');
        if (value) {
            input.value = '';
            const channel = window.Ably.channels.get(ROOM);
            channel.publish('admin', message.message, err => {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });
        }
    };

    const onCreateUserHandler = (event) => {
        event.preventDefault();
        let input = document.getElementById('input-new-username');
        const value = input.value.replace(/\s/g, '');
        if (value) {
            let userName = input.value;
            input.value = '';
            let userURL = `/user?name=${userName}`;
            window.open(userURL, '_blank');
        }
    };

    const userMenu = useMemo(() =>
        <ContactBar>
            {
                usersList.map((user, index) => (
                    <UserButton key={index} name={user.name}>
                        {user.name}
                    </UserButton>
                ))
            }
        </ContactBar>, [usersList]);

    return <>

        {userMenu}

        <Window messages={messages} windowTitle={"Admin's panel"}/>

        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'flex-start', padding: '4rem 6.5rem'
        }}>
            <TextField id={'input-new-username'} label="Create new user" variant="outlined"
                       style={{width: '20rem', margin: '1rem'}} InputProps={{
                startAdornment: <PersonAddIcon style={{marginRight: '1rem'}}/>,
                endAdornment: <SendIcon style={{cursor: 'pointer', marginLeft: '1rem'}}
                                        onClick={onCreateUserHandler}/>
            }}/>
            <TextField id={'input-admin'} label="Broadcast global message" variant="outlined"
                       style={{width: '20rem', margin: '1rem'}} InputProps={{
                startAdornment: <MessageIcon style={{marginRight: '1rem'}}/>,
                endAdornment: <SendIcon style={{cursor: 'pointer', marginLeft: '1rem'}
                } onClick={onClickHandler}/>
            }}/>
        </div>
    </>
};

const mapStateToProps = ({roomReducer}) => ({
    usersList: roomReducer.users,
    messages: roomReducer.messages,
});

export default connect(mapStateToProps, undefined)(AdminRoom);