import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';
import Toast from 'react-native-simple-toast';
import { v4 as uuid } from 'uuid';
import useTheme from '../../hooks/useTheme';
import { useState, useEffect } from 'react';
import {
    Container, Task, Observation,
    Scroll, Items, Item,
    Information, Title, Quantity,
    Buttons, Button
} from './styles';

export default ({ navigation, route }) => {
    const [ observation, setObservation ] = useState('');
    const [ task, setTask ] = useState({});
    const { id } = route.params.params;
    const theme = useTheme();

    useEffect(async () => {
        const templates = await AsyncStorage.getItem('templates');
        const task = JSON.parse(templates).filter(i => i.id === id)[0];

        setTask(task);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: task.name,
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        name="delete"
                        color="#ff6363"
                        size={ 25 }
                        onPress={ handleDeleteTask }
                        style={{ marginRight: 20 }}
                    />
                    <Icon
                        name="check"
                        color={ theme.Header.button }
                        size={ 25 }
                        onPress={ handleDone }
                    />
                </View>
            )
        });

    }, [ task, observation ]);

    const handleAdd = id => {
        const i = task.items[id];
        
        if (i.quantity !== i.total) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total += 1 } : i)
            });
        }
    }

    const handleRemove = id => {
        const i = task.items[id];

        if (i.total > 0) {
            setTask({
                ...task,
                items: task.items.map(i => i.id === id ? { ...i, total: i.total -=1 } : i)
            });
        }
    }

    const handleCheck = id =>
        setTask({
            ...task,
            items: task.items.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
        });

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
                <Task>
                    <Observation
                        placeholder="Observation"
                        placeholderTextColor="rgb(160, 160, 160)"
                        onChangeText={ setObservation }
                    />
                    <Scroll
                        showsVerticalScrollIndicator={ false }
                    >
                        <Items>
                            {
                                task.items !== undefined && task.items.map((i, k) => (
                                    <Item key={ k }>
                                        <Information>
                                            <Icon
                                                name={ i.checked ? "check-box" : "check-box-outline-blank" }
                                                size={ 25 }
                                                color="white"
                                                onPress={ () => handleCheck(k) }
                                            />
                                            <Title
                                                style={ i.checked ? {
                                                    textDecorationLine: 'line-through',
                                                    textDecorationStyle: 'solid',
                                                } : null }
                                                onPress={ () => handleCheck(k) }
                                            >
                                                { i.item }
                                            </Title>
                                            <Quantity>{ i.total }/{ i.quantity }</Quantity>
                                        </Information>
                                        <Buttons>
                                            <Button
                                                backgroundColor="transparent"
                                                name="remove"
                                                size={ 30 }
                                                onPress={ () => handleRemove(k) }
                                            />
                                            <Button
                                                backgroundColor="transparent"
                                                name="add"
                                                size={ 30 }
                                                onPress={ () => handleAdd(k) }
                                            />
                                        </Buttons>
                                    </Item>
                                ))
                            }
                        </Items>
                    </Scroll>
                </Task>
            </Container>
        </ThemeProvider>
    )
}
