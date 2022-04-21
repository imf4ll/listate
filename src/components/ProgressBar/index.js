import { Animated, Easing } from 'react-native';
import { useRef, useEffect } from 'react';
import { Container, Progress } from './styles';

export default props => {
    const newWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(newWidth, {
            toValue: props.progress * 400,
            duration: 500,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();

    });

    return (
        <Container>
            <Progress
                style={{ width: newWidth }}
            />
        </Container>
    );
}
