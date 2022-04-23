import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect, useRef } from 'react';
import { Image, Animated, Easing, Vibration } from 'react-native';
import Toast from 'react-native-simple-toast';
import { v4 as uuid } from 'uuid';
import useTheme from '../../hooks/useTheme';
import ProgressBar from '../../components/ProgressBar';
import {
    Container, Task, Observation,
    None, TitleOver, Items,
    Item, Information, Title,
    Quantity, Sides, Button,
    Middle,
} from './styles';

import Anymore from '../../assets/anymore.png';

export default ({ navigation, route }) => {
    const translateItems = useRef(new Animated.Value(-500)).current;
    const translateButtons = useRef(new Animated.Value(2000)).current;
    const translateDone = useRef(new Animated.Value(2000)).current;
    const translateNone = useRef(new Animated.Value(0)).current;
    const translateObservation = useRef(new Animated.Value(-250)).current;
    const scaleOver = useRef(new Animated.Value(1)).current;
    const itemsScroll = useRef();
    const [ itemsRef, setItemsRef ] = useState([]);
    const [ observation, setObservation ] = useState('');
    const [ current, setCurrent ] = useState(0);
    const [ task, setTask ] = useState({});
    const [ over, setOver ] = useState(false);
    const { id } = route.params.params;
    const theme = useTheme();
    
    useEffect(async () => {
        const templates = await AsyncStorage.getItem('templates');
        const task = JSON.parse(templates).filter(i => i.id === id)[0];

        Animated.parallel([
            Animated.spring(translateItems, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                delay: 500,
            }),
            Animated.timing(translateButtons, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateDone, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        setItemsRef([ new Animated.Value(-500) ]);
        setTask(task);

    }, []);

    useEffect(() => {
        if (task.items !== undefined) {
            Animated.spring(itemsRef[itemsRef.length - 1], {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }

    });

    useEffect(() => {
        if (task.items !== undefined) {
            Animated.parallel([
                Animated.timing(translateObservation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(translateNone, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.bounce,
                }),
                Animated.loop(Animated.sequence([
                    Animated.timing(scaleOver, {
                        toValue: 0.85,
                        duration: 1500,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                    Animated.timing(scaleOver, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    })
                ]))
            ]).start();
        }

    }, [ over ]);

    useEffect(() => {
        navigation.setOptions({
            title: task.name,
            headerRight: () => (
                <Button
                    onPress={ handleDeleteTask }
                    android_ripple={{
                        color: theme.Header.ripple,
                        radius: 35,
                        borderless: true,
                        foreground: true,
                    }}
                >
                    <Icon
                        name="delete"
                        color="#ff6363"
                        size={ 25 }
                        backgroundColor="transparent"
                    />
                </Button>
            )
        });

    }, [ task, observation ]);

    const handleNext = () => {
        Vibration.vibrate(50);
        
        if (current < task.items.length - 1) {
            setCurrent(current + 1);
            
        } else {
            setOver(true);

        }

        setTask({
            ...task,
            items: task.items.map(i => i.id === current ? { ...i, checked: true } : i)
        });
        
        setItemsRef([ ...itemsRef, new Animated.Value(-500) ]);
    }

    const handleAdd = id => {
        Vibration.vibrate(50);
        
        const i = task.items[id];

        if (i.total !== i.quantity) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total += 1 } : i)
            });
        }
    }

    const handleRemove = id => {
        Vibration.vibrate(50);
        
        const t = task.items[id];

        if (t.total > 0) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total -=1 } : i),
            });
        }
    }

    const handleDeleteTask = async () => {
        Vibration.vibrate(50);
        
        const templates = await AsyncStorage.getItem('templates');
        const newTemplates = JSON.parse(templates).filter(i => i.id !== id);

        await AsyncStorage.setItem('templates', JSON.stringify(newTemplates));

        navigation.goBack();
    }

    const handleDone = async () => {
        Vibration.vibrate(50);
        
        const history = await AsyncStorage.getItem('history');

        if (history === null) {
            await AsyncStorage.setItem('history', JSON.stringify([{
                task,
                observation,
                id: uuid(),
                timestamp: new Date().toLocaleString()
            }]));

        } else {
            const historyParsed = JSON.parse(history);

            await AsyncStorage.setItem('history', JSON.stringify([...historyParsed.map(i => i), {
                task,
                observation,
                id: uuid(),
                timestamp: new Date().toLocaleString()
            }]));

        }

        Toast.show('Saved successfully', Toast.SHORT);
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                {
                    task.items !== undefined && !over &&
                        <ProgressBar
                            progress={ current / task.items.length }
                        />
                }
                <Task>
                    {
                        over
                        ?
                            <>
                                <Observation
                                    placeholder="Observation"
                                    placeholderTextColor="rgb(160, 160, 160)"
                                    onChangeText={ setObservation }
                                    style={{ transform: [{ translateY: translateObservation }] }}
                                />
                                <None
                                    style={{ transform: [{ scale: translateNone }] }}
                                >
                                    <Image
                                        source={ Anymore }
                                        style={{
                                            width: 300,
                                            height: 300,
                                        }}
                                    />
                                    <TitleOver>You don't have anymore task :)</TitleOver>
                                    <Button
                                        onPress={ handleDone }
                                        android_ripple={{
                                            color: theme.Header.ripple,
                                            borderless: true,
                                            radius: 50,
                                            foreground: true,
                                        }}
                                        style={{ marginTop: '5%', transform: [{ scale: scaleOver }] }}
                                    >
                                        <Icon
                                            name="local-fire-department"
                                            size={ 80 }
                                            color="#F44336"
                                        />
                                    </Button>
                                </None>
                            </>
                        :
                            <Items
                                ref={ itemsScroll }
                                showsVerticalScrollIndicator={ false }
                                contentContainerStyle={{ alignItems: 'center' }}
                                style={{ transform: [{ translateX: translateItems }] }}
                                onContentSizeChange={ () => itemsScroll.current.scrollToEnd({ animated: true }) }
                            >
                                {
                                    task.items !== undefined && task.items.filter((_, k) => k <= current).map((i, k) => (
                                        <Item
                                            key={ k }
                                            style={{ transform: [{ translateX: itemsRef[k] }] }}
                                        >
                                            <Information>
                                                <Icon
                                                    name={ i.checked ? "check-box" : "check-box-outline-blank" }
                                                    size={ 25 }
                                                    color={ theme.primary }
                                                />
                                                <Title
                                                    style={ i.checked ? {
                                                        textDecorationLine: 'line-through',
                                                        textDecorationStyle: 'solid',
                                                    } : null }
                                                >
                                                    { i.item }
                                                </Title>
                                                <Quantity>{ i.total }/{ i.quantity }</Quantity>
                                            </Information>
                                        </Item>
                                    ))
                                }
                            </Items>
                    }
                </Task>
                    {
                        !over &&
                            <>
                                <Sides style={{ transform: [{ translateY: translateButtons }] }}>
                                    <Button
                                        onPress={ () => handleRemove(current) }
                                        android_ripple={{
                                            color: theme.Header.ripple,
                                            radius: 30,
                                            borderless: false,
                                            foreground: true,
                                        }}
                                    >
                                        <Icon
                                            backgroundColor="transparent"
                                            name="remove"
                                            color={ theme.primary }
                                            size={ 35 }
                                        />
                                    </Button>
                                    <Button
                                        onPress={ () => handleAdd(current) }
                                        android_ripple={{
                                            color: theme.Header.ripple,
                                            radius: 30,
                                            borderless: false,
                                            foreground: true,
                                        }}
                                    >
                                        <Icon
                                            backgroundColor="transparent"
                                            color={ theme.primary }
                                            name="add"
                                            size={ 35 }
                                        />
                                    </Button>
                                </Sides>
                                <Middle style={{ transform: [{ translateY: translateDone }] }}>
                                    <Button
                                        onPress={ handleNext }
                                        android_ripple={{
                                            color: theme.Header.ripple,
                                            radius: 40,
                                            borderless: true,
                                            foreground: false,
                                        }}
                                        style={{ backgroundColor: theme.button, borderRadius: 100, }}
                                    >
                                        <Icon
                                            color="white"
                                            name="done"
                                            size={ 35 }
                                        />
                                    </Button>
                                </Middle>
                            </>
                    }
            </Container>
        </ThemeProvider>
    );
}
