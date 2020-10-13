import React from 'react';
import {Window} from './window'
import SendIcon from '@material-ui/icons/Send';
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField/TextField";
import Chat from '@material-ui/icons/Chat';

const ChatWindow = ({messages, target, windowTitle,  myPrefix, sendMessageCallback}) => {
    const onClickHandler = (e) => {
        e.preventDefault();
        let input = document.getElementById('input-chat-window');
        const message = input.value;
        input.value = '';
        sendMessageCallback(message)
    };

    return <Window myPrefix={myPrefix} messages={messages} windowTitle={windowTitle}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField id={'input-chat-window'} label={target ? `message to: ${target}` : 'pick a contact'}
                           variant="outlined" style={{width: '800px', marginTop:'2rem'}}
                           InputProps={{
                        startAdornment: <Chat style={{marginRight: '1rem'}}/>,
                        endAdornment: target.length > 0 && <SendIcon style={{cursor: 'pointer', marginLeft: '1rem'}}
                                                onClick={onClickHandler}/>
                    }}
                />
            </div>
        </Window>
};

ChatWindow.propTypes = {
    target: PropTypes.string,
    messages: PropTypes.array,
    windowTitle: PropTypes.string,
    myPrefix: PropTypes.string
};

ChatWindow.defaultProps = {
};

export default ChatWindow;