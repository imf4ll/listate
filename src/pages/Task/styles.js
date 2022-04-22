import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Animated, TextInput } from 'react-native';

const ObservationInput = Animated.createAnimatedComponent(TextInput)

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    align-items: center;
    padding-bottom: 5%;
`;

export const Task = styled.View`
    width: 90%;
`;

export const Observation = styled(ObservationInput)`
    height: 60px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.background };
    margin-top: 15px;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    elevation: 5;
    shadow-color: ${ props => props.theme.shadow };
`;

export const None = styled(Animated.View)`
    justify-content: center;
    align-items: center;
    margin-top: 15%;
`;

export const TitleOver = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 18px;
    margin-top: 5%;
`;

export const Items = styled(Animated.ScrollView)`
    margin-top: 6%;
    margin-bottom: 20%;
`;

export const Item = styled(Animated.View)`
    align-items: center;
    background-color: ${ props => props.theme.background };
    margin-bottom: 15px;
    padding: 5px 0;
    border-radius: 6px;
    elevation: 10;
    shadow-color: ${ props => props.theme.shadow };
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

export const Sides = styled(Animated.View)`
    position: absolute;
    bottom: 2.5%;
    flex-direction: row;
    justify-content: space-between;
    width: 85%;
    padding: 8px 20px;
    background-color: ${ props => props.theme.background };
    border-radius: 8px;
    elevation: 5;
    shadow-color: ${ props => props.theme.shadow };
`;

export const Button = styled(Icon.Button)`
    padding: 10px 5px 10px 15px;
    border-radius: 8px;
`;

export const Middle = styled(Animated.View)`
    flex-direction: row;
    position: absolute;
    bottom: 7.5%;
    justify-content: center;
    border-radius: 100px;
    elevation: 5;
`;

export const Done = styled(Icon.Button)`
    border-radius: 100px;
    color: ${ props => props.theme.primary };
    background-color: ${ props => props.theme.ProgressBar.foreground };
    padding: 20px 10px 20px 20px;
`;

export const Delete = styled(Icon.Button)`
    padding: 10px 0 10px 10px;
`;
