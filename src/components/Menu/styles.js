import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    position: absolute;
    bottom: 2%;
    right: 5%;
`;

export const Menu = styled.View`
    flex-direction: column;
`;

export const MenuIcon = styled(Icon)`
    padding: 15px;
    border-radius: 50px;
    background-color: #7643de;
    color: white; 
`;
