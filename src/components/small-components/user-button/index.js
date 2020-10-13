import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from "@material-ui/core/Avatar";
import logo from '../../../asserts/user_logo.jpg';

const CButton = styled.div`
    border-radius: 10px;
    padding: 0 1rem;
    height: 4rem;
    margin-bottom: 0.5rem ;
    
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.fontColorButton};
    display: flex;
    flex-direction: row;
    align-items: center;
    
    font-size: 1.2rem;
    text-transform: capitalize;
    cursor: pointer;
    
    &:hover {
       box-shadow: 0 2px 4px ${({theme}) => theme.shadow};
       color: ${({theme}) => theme.error};
    }
`;

const UserButton = ({name, action}) => {

    const clickHandler = (e) =>{
        e.preventDefault();
        action && action(name);
    };

    return useMemo(() => (
            <CButton onClick={clickHandler}>
                <Avatar alt="Remy Sharp" src={logo} className={'small'}/>
                <h3 style={{margin: '1rem'}}>{name}</h3>
            </CButton>),
        [name])
};

UserButton.propTypes = {
    name: PropTypes.string,
    action: PropTypes.func

};

UserButton.defaultProps = {
    name: "Manolo",
};

export default UserButton;