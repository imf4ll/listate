import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    align-items: center;
`;

export const Task = styled.View`
    width: 90%;
`;

export const Observation = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.background };
    border-width: 1px;
    border-color: ${ props => props.theme.Template.border };
    margin: 15px 0;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
`;

export const Scroll = styled.ScrollView`
    background-color: ${ props => props.theme.background };
    border-radius: 5px;
    border-width: 1px;
    border-color: ${ props => props.theme.Template.border };
    margin-bottom: 30%;
`;

export const Items = styled.View`
    padding-bottom: 20px;
`;

export const Item = styled.View`
    align-items: center;
`;

export const Information = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 5% 10%;
`;

export const Title = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 18px;
    overflow: hidden;
    width: 90%;
    margin-left: 10px;
`;

export const Quantity = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 16px;
    text-align: center;
`;

export const Buttons = styled.View`
    flex-direction: row;
`;

export const Button = styled(Icon.Button)`
    padding: 12px 6px 12px 15px;
    margin: 0 10px;
    background-color: ${ props => props.theme.secondary };
    border-radius: 8px;
`;
