import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: ${ props => props.theme.secondary };
    padding-bottom: 5%;
`;

export const Information = styled(Animated.View)`
    background-color: transparent;
    align-items: center;
    width: 90%;
    border-radius: 8px;
`;

export const TextInput = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.background };
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    border-radius: 5px;
`;

export const ColorInput = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.background };
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    border-radius: 5px;
    border-width: 1px;
`;

export const Scroll = styled(Animated.ScrollView)`
    width: 90%;
    margin-top: 20px;
    border-radius: 8px;
    background-color: ${ props => props.theme.background };
    border-radius: 5px;
`;

export const Task = styled.View`
    align-items: center;
`;

export const Title = styled.Text`
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin: 15px 0;
    color: ${ props => props.theme.primary }
`;

export const Item = styled(Animated.View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const AddInput = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.secondary };
    margin: 10px 10px 10px 0;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 70%;
`;

export const AddNumberInput = styled.TextInput`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.secondary };
    margin: 10px 0;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 20%;
    text-align: center;
`;

export const New = styled(Icon.Button)`
    text-align: center;
    color: ${ props => props.theme.Menu.icon };
    padding: 20px 10px 20px 20px;
    border-radius: 8px;
`;

export const Done = styled(Icon.Button)`
    padding: 10px 0 10px 10px;
`;
