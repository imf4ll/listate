import { Animated } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import { Container, Menu, MenuIcon } from './styles';

export default ({ navigation }) => {
    const [ menuOpen, setMenuOpen ] = useState(false);
    const translateButton = useRef(new Animated.Value(250)).current;
    const translateMenu = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(translateButton, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

    }, []);

    useEffect(() => {
        if (menuOpen) {
            Animated.timing(translateMenu, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        
        } else {
            Animated.timing(translateMenu, {
                toValue: 205,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }

    }, [ menuOpen ]);

    const handleHistory = () => {
        navigation.navigate('History');

        setMenuOpen(false);
    }

    const handleSettings = () => {
        navigation.navigate('Settings');

        setMenuOpen(false);
    }

    return (
        <ThemeProvider theme={ useTheme() }> 
            <Container>
                <Menu style={{ transform: [{ translateY: translateMenu }] }}>
                    <MenuIcon
                        onPress={ menuOpen ? () => setMenuOpen(!menuOpen) : () => navigation.navigate('Template') }
                        onLongPress={ () => setMenuOpen(!menuOpen) }
                        activeOpacity={ 0.8 }
                        style={{ transform: [{ translateX: translateButton }] }}
                    >
                        <Icon
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            name={ menuOpen ? "expand-more" : "add-task" }
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                    <MenuIcon
                        style={{ transform: [{ translateX: translateButton }] }}
                        onPress={ handleHistory }
                        activeOpacity={ 0.8 }
                    >
                        <Icon
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            name="history"
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                    <MenuIcon
                        style={{ transform: [{ translateX: translateButton }] }}
                        onPress={ handleSettings }
                        activeOpacity={ 0.8 }
                    >
                        <Icon
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            name="settings"
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                </Menu>
            </Container>
        </ThemeProvider>
    );
}
