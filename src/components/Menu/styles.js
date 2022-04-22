import styled from 'styled-components/native';
import { Animated, TouchableOpacity } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(TouchableOpacity);

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
    padding: 25px;
    background-color: ${ props => props.theme.button };
`;
