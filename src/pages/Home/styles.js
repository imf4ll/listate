import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Animated } from 'react-native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${ props => props.theme.secondary };
`;

export const History = styled(Icon.Button)`
    padding: 10px 5px 10px 10px;
`;

export const Settings = styled(Icon.Button)`
    padding: 10px 0 10px 10px;
`;

export const Refresh = styled(Icon.Button)`
    padding: 10px 0 10px 10px;
`;

export const TitleNoOne = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 18px;
    text-align: center;
    width: 85%;
    margin-top: 5%;
    margin-bottom: 25%;
`;

export const TitleButton = styled.Text`
    color: white;
    font-size: 16px;
`;

export const Scroll = styled(Animated.ScrollView)`
    width: 100%;
`;

export const Template = styled.Pressable`
    width: 90%;
    margin: 10px 0;
    padding-left: 15px;
    padding-bottom: 20px;
    border-radius: 5px;
    border-width: 1px;
    border-color: ${ props => props.theme.Template.border };
`;

export const TitleTemplate = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    color: ${ props => props.theme.primary }
`;

export const Item = styled.View`
    flex-direction: row;
    margin-top: 15px;
`;

export const TitleItem = styled.Text`
    color: ${ props => props.theme.primary };
    font-size: 15px;
`;

export const Checkmark = styled(Icon)`
    color: ${ props => props.theme.primary };
    margin: 0 5px;
`;
