import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled.View`
    height: 1%;
    background-color: ${ props => props.theme.ProgressBar.background };
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

export const Progress = styled(Animated.View)`
    height: 100%;
    background-color: ${ props => props.theme.ProgressBar.foreground };
`;
