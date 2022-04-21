import { ThemeProvider } from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { Image, Animated } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    Container, Tasks, Task,
    Title, Checks, Check,
    TitleCheck, Time, TitleNoOne
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Empty from '../../assets/empty.png';

export default ({ navigation }) => {
    const [ tasks, setTasks ] = useState([]);
    const translate = useRef(new Animated.Value(500)).current;
    const isFocused = useIsFocused();
    const theme = useTheme();

    useEffect(() => {
        Animated.timing(translate, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
            delay: 1,
        }).start();

    }, []);

    useEffect(async () => {
        const tasks = await AsyncStorage.getItem('history');
        setTasks(JSON.parse(tasks));

    }, [ window.onload, isFocused ]);

    const handleTask = id =>
        navigation.navigate('StoragedTask', {
            params: {
                id,
            }
        });

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                { 
                    tasks !== null && tasks.length !== 0
                    ?
                    <Tasks
                        showsVerticalScrollIndicator={ false }
                        contentContainerStyle={{ alignItems: 'center' }}
                        style={{ transform: [{ translateX: translate }] }}
                    >
                        {
                            tasks !== null && tasks.map((i, k) => (
                                <Task
                                    key={ k }
                                    onPress={ () => handleTask(i.id) }
                                    style={({ pressed }) => [{
                                        backgroundColor: pressed
                                        ? theme.Press.pressed
                                        : theme.background,
                                        borderColor: i.task.color,
                                        borderWidth: 1,
                                    }]}
                                >
                                    <Title>{ i.task.name }</Title>
                                    <Checks>
                                        {
                                            i.task.items.map((i, k) => (
                                                <Check key={ k }>
                                                    <Icon
                                                        name={ i.checked ? "check-box" : "check-box-outline-blank" }
                                                        size={ 20 }
                                                        color={ theme.primary }
                                                        style={{ marginHorizontal: 5 }}
                                                    />
                                                    <TitleCheck>{ i.item } ({ i.total }/{ i.quantity })</TitleCheck>
                                                </Check>
                                            ))
                                        }
                                    </Checks>
                                    <Time>{ i.timestamp }</Time>
                                </Task>
                            ))
                        }
                    </Tasks>
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
                            Your history is empty, try to save a new task through a template.
                        </TitleNoOne>
                    </>
                }
            </Container>
        </ThemeProvider>
    );
}
