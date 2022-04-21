import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import { Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import { useState, useEffect, useRef } from 'react';
import {
    Container, Task, Observation,
    Items, Item, Information,
    Title, Quantity, Delete,
    TitleObservation, TitleItems, TitleObservationText,
    Input, TitleItemsText, ItemsView,
} from './styles';

export default ({ navigation, route }) => {
    const [ t, setTask ] = useState({});
    const translateItems = useRef(new Animated.Value(-500)).current;
    const { id } = route.params.params;
    const theme = useTheme();

    useEffect(async () => {
        const history = JSON.parse(await AsyncStorage.getItem('history'));
        const task = history.filter(i => i.id === id)[0];
        setTask(task);

        Animated.timing(translateItems, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.bounce,
        }).start();

        navigation.setOptions({
            title: task.task.name,
            headerRight: () => (
                <Delete
                    name="delete"
                    color="#ff6363"
                    size={ 25 }
                    onPress={ handleDelete }
                    underlayColor="transparent"
                    backgroundColor="transparent"
                    activeOpacity={ 0.6 }
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
                <Task
                    style={{ transform: [{ translateX: translateItems }] }}
                >
                    <Observation>
                        <TitleObservation>
                            <Icon
                                name="edit"
                                size={ 25 }
                                color={ theme.Header.button }
                                style={{ marginRight: 10 }}
                            />
                            <TitleObservationText>Observation</TitleObservationText>
                        </TitleObservation>
                        <Input
                            value={ t.task !== undefined ? t.observation : 'Observation' }
                            placeholderTextColor="rgb(160, 160, 160)"
                            editable={ false }
                        />
                    </Observation>
                    <ItemsView>
                        <TitleItems>
                            <Icon
                                name="list"
                                size={ 25 }
                                color={ theme.Header.button }
                                style={{ marginRight: 10 }}
                            />
                            <TitleItemsText>Tasks</TitleItemsText>
                        </TitleItems>
                        <Items showsVerticalScrollIndicator={ false }>
                            {
                                t.task !== undefined && t.task.items.map((i, k) => (
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
                    </ItemsView>
                </Task>
            </Container>
        </ThemeProvider>
    )
}
