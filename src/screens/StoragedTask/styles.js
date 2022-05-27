import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    align-items: center;
    padding-top: 15px;
`;

export const Task = styled(Animated.View)`
    width: 90%;
`;

export const Observation = styled.View`
    align-items: center;
    padding-bottom: 25px;
`;

export const Input = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.background };
    padding: 0 15px;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
    elevation: 5;
    shadow-color: ${ props => props.theme.shadow };
`;

export const Items = styled.ScrollView`
    background-color: ${ props => props.theme.background };
    border-radius: 5px;
    margin-bottom: 15px;
    height: 85.5%;
    elevation: 5;
    shadow-color: ${ props => props.theme.shadow };
`;

export const Item = styled.View`
    align-items: center;
    width: 95%;
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

export const Delete = styled(Icon.Button)`
    border-radius: 100px;
    padding: 7px;
`;
