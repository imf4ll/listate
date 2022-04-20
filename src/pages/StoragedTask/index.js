import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import { useState, useEffect } from 'react';
import {
    Container, Task, Observation,
    Scroll, Items, Item,
    Information, Title, Quantity
} from './styles';

export default ({ navigation, route }) => {
    const [ task, setTask ] = useState({});
    const { id } = route.params.params;
    const theme = useTheme();

    useEffect(async () => {
        const history = await AsyncStorage.getItem('history');
        const task = JSON.parse(history).filter(i => i.id === id)[0];
        setTask(task);

        navigation.setOptions({
            title: task.task.name,
            headerRight: () => (
                <Icon
                    name="delete"
                    color="#ff6363"
                    size={ 25 }
                    onPress={ handleDelete }
                />
            )
        });

    }, [ window.onload ]);

    const handleDelete = async () => {
        const tasks = await AsyncStorage.getItem('history');
        const newTasks = JSON.parse(tasks).filter(i => i.id !== id);

        await AsyncStorage.setItem('history', JSON.stringify(newTasks));
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <Task>
                    <Observation
                        value={ task.task !== undefined ? task.observation : 'Observation' }
                        placeholderTextColor="rgb(160, 160, 160)"
                        editable={ false }
                    />
                    <Scroll
                        showsVerticalScrollIndicator={ false }
                    >
                        <Items>
                            {
                                task.task !== undefined && task.task.items.map((i, k) => (
                                    <Item key={ k }>
                                        <Information>
                                            <Icon
                                                name={ i.checked ? "check-box" : "check-box-outline-blank" }
                                                size={ 25 }
                                                color="white"
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
                    </Scroll>
                </Task>
            </Container>
        </ThemeProvider>
    )
}
