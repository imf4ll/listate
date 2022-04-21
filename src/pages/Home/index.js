import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import { Image, View, Animated } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import {
    Container, Scroll, Template,
    TitleTemplate, Item, TitleItem,
    Checkmark, TitleNoOne, History,
    Settings, Refresh
} from './styles';
import Menu from '../../components/Menu';

import Empty from '../../assets/none.png';

export default ({ navigation }) => {
    const [ templates, setTemplates ] = useState([]);
    const translate = useRef(new Animated.Value(100)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();
    const theme = useTheme();


    useEffect(() => {
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

    }, [ window.onload ]);
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <History
                        onPress={ () => navigation.push('History') }
                        size={ 25 }
                        color={ theme.Header.button }
                        name="history"
                        backgroundColor="transparent"
                        underlayColor="transparent"
                        activeOpacity={ 0.6 }
                    />
                    <Settings
                        onPress={ handleSettings }
                        size={ 25 }
                        color={ theme.Header.button }
                        name="more-vert"
                        backgroundColor="transparent"
                        underlayColor="transparent"
                        activeOpacity={ 0.6 }
                    />
                </View>
            ),
            headerLeft: () => (
                <Refresh
                    onPress={ async () => {
                            const templates = await AsyncStorage.getItem('templates');
                            setTemplates(JSON.parse(templates));

                            Toast.show('Refreshing...', Toast.SHORT)
                        }
                    }
                    size={ 25 }
                    color={ theme.Header.button }
                    name="refresh"
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    activeOpacity={ 0.6 }
                />
            )
        });

    });

    useEffect(async () => {
        const templates = await AsyncStorage.getItem('templates');

        if (templates !== null) {
            setTemplates(JSON.parse(templates));

        }

    }, [ isFocused ]);

    const handleSettings = () => navigation.navigate('Settings');

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
                                    style={({ pressed }) => [{
                                        backgroundColor: pressed
                                        ? theme.Press.pressed
                                        : theme.background,
                                        borderColor: i.color,
                                    }]}
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
                    <>
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
                    </>
                }
                <Menu navigation={ navigation } />
            </Container>
        </ThemeProvider>
    );
}
