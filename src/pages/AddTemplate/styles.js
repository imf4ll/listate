import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { TextInput, Pressable } from 'react-native';

const Input = Animated.createAnimatedComponent(TextInput);
const ItemPressable = Animated.createAnimatedComponent(Pressable);

export const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: ${ props => props.theme.secondary };
`;

export const NameInput = styled(Input)`
    height: 50px;
    color: ${ props => props.theme.primary };
    background-color: transparent;
    margin: 0;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    border-bottom-width: 2px;
    border-bottom-color: ${ props => props.theme.background };
`;

export const Tasks = styled(Animated.ScrollView)`
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
`;

export const Task = styled.View`
    align-items: center;
`;

export const Item = styled(ItemPressable)`
    width: 90%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${ props => props.theme.background };
    border-radius: 5px;
    margin: 7.5px 0;
    elevation: 5;
    shadow-color: ${ props => props.theme.shadow };
`;

export const AddInput = styled.TextInput`
    height: 50px;
    color: ${ props => props.theme.primary };
    margin: 10px 10px 10px 0;
    padding-left: 10px;
    padding-right: 5px;
    border-radius: 8px;
    font-size: 16px;
    width: 75%;
`;

export const AddNumberInput = styled.TextInput`
    height: 50px;
    color: ${ props => props.theme.primary };
    margin: 10px 0;
    border-radius: 8px;
    font-size: 16px;
    width: 15%;
    text-align: center;
`;

export const Button = styled.Pressable`
    border-radius: 100px;
    padding: 7px;
`;
