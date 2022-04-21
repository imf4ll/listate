import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import useTheme from '../../hooks/useTheme';
import { Container, Menu, MenuIcon } from './styles';

export default props => {
    const { navigation } = props;
    const translateButton = useRef(new Animated.Value(200)).current;

    useEffect(() => {
        Animated.timing(translateButton, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

    }, []);

    return (
        <ThemeProvider theme={ useTheme() }> 
            <Container>
                <Menu>
                    <MenuIcon
                        backgroundColor="transparent"
                        activeOpacity={ 0.6 }
                        underlayColor="transparent"
                        name="add-task"
                        size={ 30 }
                        onPress={ () => navigation.navigate('Template') }
                        style={{ transform: [{ translateX: translateButton }] }}
                    />
                </Menu>
            </Container>
        </ThemeProvider>
    );
}
