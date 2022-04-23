import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import { Image, Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import Menu from '../../components/Menu';
import {
    Container, Scroll, Template,
    TitleTemplate, Item, TitleItem,
    Checkmark, TitleNoOne
} from './styles';

import Empty from '../../assets/none.png';

export default ({ navigation }) => {
    const [ templates, setTemplates ] = useState([]);
    const translate = useRef(new Animated.Value(100)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();
    const theme = useTheme();

    useEffect(async () => {
        Animated.parallel([
            Animated.timing(translate, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
                delay: 100,
            }),
        ]).start();

    }, []);
    
    useEffect(async () => {
        const templates = JSON.parse(await AsyncStorage.getItem('templates'));

        if (templates !== null) {
            setTemplates(templates);

        }

    }, [ window.onload, isFocused ]);

    const handleTask = id =>
        navigation.navigate('Task', {
            params: {
                id,
            }
        });
    
    return (
        <ThemeProvider theme={ theme }>
            <Container>
                { 
                    templates !== null && templates.length !== 0
                    ?
                        <Scroll
                            showsVerticalScrollIndicator={ false }
                            contentContainerStyle={{ alignItems: 'center' }}
                            style={{ transform: [{ translateY: translate }], opacity: fadeIn }}
                        >
                            {
                                templates.map((i, k) => (
                                    <Template
                                        key={ k }
                                        onPress={ () => handleTask(i.id) }
                                        android_ripple={{
                                            color: theme.Header.ripple,
                                            borderless: false,
                                            radius: 350,
                                            foreground: true,
                                        }}
                                    >
                                        <TitleTemplate>
                                            { i.name }
                                        </TitleTemplate>
                                        {
                                            i.items.map((i, k) => (
                                                <Item key={ k }>
                                                    <Checkmark name="check-box-outline-blank" size={ 20 } />
                                                    <TitleItem>
                                                        { i.item }
                                                    </TitleItem>
                                                </Item>
                                            ))
                                        }
                                    </Template>
                                ))
                            }
                        </Scroll>
                    :
                        <Animated.View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={ Empty }
                                style={{
                                    width: 300,
                                    height: 300,
                                }}
                            />
                            <TitleNoOne>
                                You don't have any template storaged, try to create a new one.
                            </TitleNoOne>
                        </Animated.View>
                }
                <Menu navigation={ navigation } />
            </Container>
        </ThemeProvider>
    );
}
