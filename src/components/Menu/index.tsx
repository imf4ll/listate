import { Animated, Vibration } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../hooks/useTheme';
import { Container, MenuView, MenuIcon } from './styles';

export const Menu = ({ navigation }) => {
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
    const translateButton = useRef(new Animated.Value(250)).current;
    const translateMenu = useRef(new Animated.Value(0)).current;
    const theme = useTheme();

    useEffect(() => {
        Animated.timing(translateButton, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start()

    }, []);

    useEffect(() => {
        if (menuOpen) {
            Animated.timing(translateMenu, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }).start();
        
        } else {
            Animated.timing(translateMenu, {
                toValue: 195,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }

    }, [ menuOpen ]);

    const handleTemplate = () => {
        navigation.navigate('Template');
        Vibration.vibrate(50);

    }

    const handleHistory = () => {
        navigation.navigate('History');
        Vibration.vibrate(50);

        setMenuOpen(false);
    }

    const handleSettings = () => {
        navigation.navigate('Settings');
        Vibration.vibrate(50);

        setMenuOpen(false);
    }

    const handleLongPress = () => {
        setMenuOpen(!menuOpen);
        Vibration.vibrate(100);

    }

    return (
        <ThemeProvider theme={ theme }> 
            <Container>
                <MenuView style={{ transform: [{ translateY: translateMenu }] }}>
                    <MenuIcon
                        style={{ transform: [{ translateX: translateButton }] }}
                        onPress={ menuOpen ? handleLongPress : handleTemplate }
                        onLongPress={ handleLongPress }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: false,
                            radius: 38,
                            foreground: true,
                        }}
                    >
                        <Icon
                            name={ menuOpen ? "expand-more" : "add-task" }
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                    <MenuIcon
                        style={{ transform: [{ translateX: translateButton }] }}
                        onPress={ handleHistory }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: false,
                            radius: 38,
                            foreground: true,
                        }}
                    >
                        <Icon
                            name="history"
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                    <MenuIcon
                        style={{ transform: [{ translateX: translateButton }] }}
                        onPress={ handleSettings }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: false,
                            radius: 38,
                            foreground: true,
                        }}
                    >
                        <Icon
                            name="settings"
                            size={ 30 }
                            color="white"
                        />
                    </MenuIcon>
                </MenuView>
            </Container>
        </ThemeProvider>
    );
}
