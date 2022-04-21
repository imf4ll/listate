import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image, Animated, Easing } from 'react-native';
import Toast from 'react-native-simple-toast';
import { v4 as uuid } from 'uuid';
import useTheme from '../../hooks/useTheme';
import { useState, useEffect, useRef } from 'react';
import {
    Container, Task, Observation,
    None, TitleOver, Items,
    Item, Information, Title,
    Quantity, Sides, Button,
    Middle, Done, Delete,
} from './styles';
import ProgressBar from '../../components/ProgressBar';

import Anymore from '../../assets/anymore.png';

export default ({ navigation, route }) => {
    const translateItems = useRef(new Animated.Value(-500)).current;
    const translateButtons = useRef(new Animated.Value(2000)).current;
    const translateDone = useRef(new Animated.Value(2000)).current;
    const translateNone = useRef(new Animated.Value(0)).current;
    const translateObservation = useRef(new Animated.Value(-250)).current;
    const scaleOver = useRef(new Animated.Value(1)).current;
    const [ itemsRef, setItemsRef ] = useState([]);
    const [ observation, setObservation ] = useState('');
    const [ current, setCurrent ] = useState(0);
    const [ task, setTask ] = useState({});
    const [ over, setOver ] = useState(false);
    const { id } = route.params.params;
    const Fire = Animated.createAnimatedComponent(Icon.Button);
    const theme = useTheme();
    
    useEffect(async () => {
        const templates = await AsyncStorage.getItem('templates');
        const task = JSON.parse(templates).filter(i => i.id === id)[0];

        Animated.parallel([
            Animated.spring(translateItems, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                delay: 750,
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
                <Delete
                    name="delete"
                    color="#ff6363"
                    size={ 25 }
                    onPress={ handleDeleteTask }
                    activeOpacity={ 0.6 }
                    underlayColor="transparent"
                    backgroundColor="transparent"
                />
            )
        });

    }, [ task, observation ]);

    const handleNext = () => {
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
        const i = task.items[id];

        if (i.total !== i.quantity) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total += 1 } : i)
            });
        }
    }

    const handleRemove = id => {
        const t = task.items[id];

        if (t.total > 0) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total -=1 } : i),
            });
        }
    }

    const handleDeleteTask = async () => {
        const templates = await AsyncStorage.getItem('templates');
        const newTemplates = JSON.parse(templates).filter(i => i.id !== id);

        await AsyncStorage.setItem('templates', JSON.stringify(newTemplates));

        navigation.goBack();
    }

    const handleDone = async () => {
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
                                    <Fire
                                        name="local-fire-department"
                                        size={ 80 }
                                        color="#F44336"
                                        onPress={ handleDone }
                                        underlayColor="transparent"
                                        backgroundColor="transparent"
                                        activeOpacity={ 0.8 }
                                        style={{ marginTop: '10%', transform: [{ scale: scaleOver }] }}
                                    />
                                </None>
                            </>
                        :
                            <Items
                                showsVerticalScrollIndicator={ false }
                                style={{ transform: [{ translateX: translateItems }] }}
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
                                        backgroundColor="transparent"
                                        name="remove"
                                        activeOpacity={ 0.8 }
                                        underlayColor={ theme.Buttons.remove }
                                        color={ theme.primary }
                                        size={ 35 }
                                        onPress={ () => handleRemove(current) }
                                    />
                                    <Button
                                        backgroundColor="transparent"
                                        activeOpacity={ 0.8 }
                                        underlayColor={ theme.Buttons.add }
                                        color={ theme.primary }
                                        name="add"
                                        size={ 35 }
                                        onPress={ () => handleAdd(current) }
                                    />
                                </Sides>
                                <Middle style={{ transform: [{ translateY: translateDone }] }}>
                                    <Done
                                        backgroundColor="transparent"
                                        activeOpacity={ 0.8 }
                                        underlayColor="transparent"
                                        name="done"
                                        size={ 35 }
                                        onPress={ handleNext }
                                    />
                                </Middle>
                            </>
                    }
            </Container>
        </ThemeProvider>
    )
}
