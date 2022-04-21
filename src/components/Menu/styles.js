import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon.Button);

export const Container = styled.View`
    position: absolute;
    bottom: 25px;
    right: 20px;
`;

export const Menu = styled.View`
    flex-direction: column;
`;

export const MenuIcon = styled(AnimatedIcon)`
    padding: 20px 10px 20px 20px;
    border-radius: 50px;
    background-color: #7643de;
    color: white; 
`;
