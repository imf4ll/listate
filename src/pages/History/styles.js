import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    align-items: center;
    justify-content: center;
`;

export const Tasks = styled(Animated.ScrollView)`
    width: 100%;
`;

export const Task = styled.Pressable`
    width: 90%;
    margin: 10px 0;
    padding-left: 15px;
    padding-bottom: 20px;
    border-radius: 5px;
    border-width: 1px;
    border-color: ${ props => props.theme.Template.border };
`;

export const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    color: ${ props => props.theme.primary };
`;

export const Checks = styled.View`
    flex-direction: column;
    margin-bottom: 50px;
    margin-top: 15px;
`;

export const Check = styled.View`
    flex-direction: row;
    margin-top: 15px;
`;

export const TitleCheck = styled.Text`
    color: ${ props => props.theme.primary };
`;

export const Time = styled.Text`
    position: absolute;
    bottom: 5px;
    right: 5px;
    color: ${ props => props.theme.Header.button }
`;

export const TitleNoOne = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 18px;
    text-align: center;
    width: 85%;
    margin-top: 5%;
    margin-bottom: 25%;
`;
