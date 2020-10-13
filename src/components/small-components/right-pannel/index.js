import React, {useMemo} from 'react';
import styled, {useTheme} from 'styled-components';
import logo from '../../../asserts/user_logo.jpg'
import LocationOnIcon from '@material-ui/icons/LocationOn';

const Container = styled.div`
    background: ${({theme}) => theme.secondary};
    display: flex;
    flex-direction: column;
    width: 12rem;
    height: 100%;
    height: -moz-available;          /* WebKit-based browsers will ignore this. */
    height: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    height: fill-available;
    align-items: center;
    border-top-right-radius: ${({theme}) => theme.borderRadius};
    border-bottom-right-radius: ${({theme}) => theme.borderRadius};
    padding-top: 2rem;
    font-family: sans-serif;
`;

const RightPanel = ({title}) => {
    const theme = useTheme();

    return useMemo(() =>
        <Container>
            <img src={logo} style={{
                borderRadius: '5.125rem', width: '6.25rem', height: '6.25rem', padding: '1rem',
                border: `solid 3px ${theme.error}`
            }} alt={title}/>
            <h3 style={{textAlign: 'center', color: 'white', textTransform: 'capitalize'}}>{title}</h3>

            <div style={{display: 'flex', flexDirection: 'row'}}>
                <LocationOnIcon style={{color: 'white'}}/>
                <h5 style={{textAlign: 'center', color: 'white', margin: '0.4rem'}}>Berlin</h5>
            </div>
            <h5 style={{textAlign: 'center', color: 'white'}}>status: online</h5>

        </Container>
    , [title])
};


export default RightPanel;