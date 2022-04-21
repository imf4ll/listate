import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IconAnimated = Animated.createAnimatedComponent(Icon);

export const Container = styled.View`
    flex: 1;
    background-color: ${ props => props.theme.secondary };
    padding-top: 10px;
    align-items: center;
`;

export const Section = styled(Animated.View)`
    width: 90%;
    margin: 5px 10px 20px 10px;
    border-radius: 5px;
    background-color: ${ props => props.theme.background };
`;

export const TitleSection = styled(Animated.View)`
    flex-direction: row;
    align-items: center;
    padding: 10px 0;
`;

export const TitleSectionText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${ props => props.theme.primary };
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

export const IconSetting = styled(IconAnimated)`
    color: ${ props => props.theme.Menu.icon };
    font-size: 30px;
    margin-right: 10px;
`;

export const DescriptionSetting = styled.Text`
    width: 90%;
    background-color: blue;
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
