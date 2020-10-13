import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
    width: 350px;
    background-color: ${({theme}) => theme.transparent}; 
    display: flex;
    flex-direction: column;
    color: ${({theme}) => theme.error};
    padding: 1rem 1rem 2rem 1rem;
    margin: 0 0.5rem;
    
    & .text-box {
        padding: 0 1rem ;
        margin-bottom: 0.4rem;
        display: flex;
        flex-direction: column;
        
        .node-text-name {
            font-size: 1rem;
            //text-transform: capitalize;
            margin: 0.8rem 0 0 0;
        }
        
        .node-text-message {
            margin: 0 0 0.8rem 0;
        }
    }
    
    & .local-text {
        border: 1px solid ${({theme}) => theme.shadow}; 
        border-radius: 10px;
        font-size: 0.8rem;
        background-color: ${({theme}) => theme.background}; 

    }
    
    & .foreign-text {
        font-style: italic;
        font-size: 0.8rem;
        background-color: ${({theme}) => theme.shadow};
        border-radius: 5px;
        .node-text-name {
            display: flex;
            justify-content: flex-end;
        }
        
        .node-text-message {
            display: flex;
            justify-content: flex-end;
        }
    }
    
    & .admin-text {
        font-style: italic;
        font-size: 0.8rem;
        background-color: ${({theme}) => theme.secondBackground};
        border-radius: 5px;
        color: ${({theme}) => theme.background};
    }
    
    // & .log {
    //     font-style: italic;
    //     font-size: 0.8rem;
    //     background-color: ${({theme}) => theme.secondary};
    //     border-radius: 5px;
    //     color: ${({theme}) => theme.background};
    // }
`;

const Window = ({messages, myPrefix, windowTitle, children}) => {
    useEffect(() => {
        if (messages.length > 0) {
            messages.map(item => {
                let myPrefixDivNode = document.createElement("div");

                let pNodeName = document.createElement("p");
                pNodeName.className += 'node-text-name';

                let pNodeMessage = document.createElement("p");
                pNodeMessage.className += 'node-text-message';

                let textNodeName = document.createTextNode(`${item.name}:`);
                let textNodeMessage = document.createTextNode(`${item.message}`);
                pNodeName.appendChild(textNodeName);
                pNodeMessage.appendChild(textNodeMessage);

                myPrefixDivNode.appendChild(pNodeName);
                myPrefixDivNode.appendChild(pNodeMessage);

                if (item.name.includes(`From ${myPrefix} to`)) {
                    myPrefixDivNode.className = 'text-box local-text';
                }
                else if (item.name.toLowerCase() === 'admin') {
                    myPrefixDivNode.className = 'text-box admin-text';
                }
                /* this feature is under review */
                // else if (item.name.toLowerCase() === 'log') {
                //     myPrefixDivNode.className = 'text-box log';
                // }
                else {
                    myPrefixDivNode.className = 'text-box foreign-text';
                }

                document.getElementById(`chat-room-${myPrefix}`).appendChild(myPrefixDivNode);
            });
        }
    }, [messages]);

    return useMemo(() => <Container>
        <p style={{margin: '0 0 0.5rem 0', fontSize: '0.8rem'}}>{windowTitle}</p>
        <div id={`chat-room-${myPrefix}`} style={{height: '100%', overflow: 'auto'}}>
        </div>
        {children}
    </Container>, [messages, myPrefix, children])
};

Window.propTypes = {
    messages: PropTypes.array,
    myPrefix: PropTypes.string,
    windowTitle: PropTypes.string,
};

Window.defaultProps = {
    messages: [{user: 'User', message: 'this is a mocked message!'}],
    windowTitle: "Title",
};

export {
    Window,
    Container
}