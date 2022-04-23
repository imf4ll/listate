import styled from 'styled-components/native';
import { Animated, Pressable } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Pressable);

export const Container = styled.View`
    position: absolute;
    bottom: 0;
    right: 15px;
`;

export const Menu = styled(Animated.View)`
    flex-direction: column;
`;

export const MenuIcon = styled(AnimatedIcon)`
    border-radius: 100px;
    margin-bottom: 20px;
    padding: 22px;
    background-color: ${ props => props.theme.button };
    elevation: 10;
    shadow-color: ${ props => props.theme.shadow };
`;
