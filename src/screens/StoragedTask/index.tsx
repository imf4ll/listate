import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { Animated, Vibration, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../hooks/useTheme';
import { ITask } from '../../types';
import {
    Container, Task, Observation,
    Items, Item, Information,
    Title, Quantity, Input,
} from './styles';

export const StoragedTask = ({ navigation, route }) => {
    const [ t, setTask ] = useState<ITask>();
    const translateItems = useRef(new Animated.Value(-500)).current;
    const { id } = route.params.params;
    const theme = useTheme();

    // @ts-ignore
    useEffect(async () => {
        const history = JSON.parse(await AsyncStorage.getItem('history'));
        const task = history.filter((i: ITask) => i.id === id)[0];
        setTask(task);

        Animated.timing(translateItems, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        navigation.setOptions({
            title: task.task.name,
            headerRight: () => (
                <Pressable
                    onPress={ handleDelete }
                    android_ripple={{
                        color: theme.Header.ripple,
                        borderless: true,
                        radius: 35,
                        foreground: true,
                    }}
                    style={{ padding: 10 }}
                >
                    <Icon
                        name="delete"
                        color="#ff6363"
                        size={ 25 }
                    />
                </Pressable>
            )
        });

    }, [ window.onload ]);

    const handleDelete = async () => {
        Vibration.vibrate(50);
        
        const tasks = await AsyncStorage.getItem('history');
        const newTasks = JSON.parse(tasks).filter((i: ITask) => i.id !== id);

        await AsyncStorage.setItem('history', JSON.stringify(newTasks));
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                {
                    t &&
                        <Task
                            style={{ transform: [{ translateX: translateItems }] }}
                        >
                            <Observation>
                                <Input
                                    value={ t.task !== null && t.observation !== '' ? t.observation : 'Observation' }
                                    placeholderTextColor="rgb(160, 160, 160)"
                                    editable={ false }
                                />
                            </Observation>
                            <Items showsVerticalScrollIndicator={ false }>
                                {
                                    t.task.items.map((i, k) => (
                                        <Item key={ k }>
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
                        </Task>
                }
            </Container>
        </ThemeProvider>
    )
}
