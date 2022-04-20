import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    padding: 10px;
`;

export const Section = styled.View`
    background-color: ${ props => props.theme.background };
    margin: 7px 10px;
    border-radius: 5px;
    border-width: 1px;
    border-color: ${ props => props.theme.Template.border };
`;

export const TitleSection = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
    margin-top: 10px;
`;

export const Setting = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 20px;
`;

export const TitleSetting = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const IconSetting = styled(Icon)`
    color: ${ props => props.theme.Menu.icon };
    font-size: 30px;
    margin-right: 10px;
`;

export const Title = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 16px;
`;

export const Button = styled.Text`
    font-size: 16px;
    color: #ff5c5c;
`;

export const Version = styled.Text`
    color: ${ props => props.theme.Header.button };
    font-size: 16px;
`;
