import { ThemeProvider } from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Image, Animated, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import useTheme from '../../hooks/useTheme';
import { datetime } from '../../utils/datetime';
import {
    Container, Tasks, Task,
    Title, Checks, Check,
    TitleCheck, Time, TitleNoOne
} from './styles';

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
        const tasks = JSON.parse(await AsyncStorage.getItem('history'));

        if (tasks !== null) {
            setTasks(tasks);

        }

    }, [ window.onload, isFocused ]);

    const handleTask = id =>
        navigation.navigate('StoragedTask', {
            params: {
                id,
            }
        });

    const handleShowFullTime = timestamp => {
        Vibration.vibrate(50);

        Toast.show(new Date(timestamp).toString(), Toast.SHORT);
    }

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
                            tasks.reverse().map((i, k) => (
                                <Task
                                    key={ k }
                                    onPress={ () => handleTask(i.id) }
                                    android_ripple={{
                                        color: theme.Header.ripple,
                                        borderless: false,
                                        radius: 500,
                                        foreground: true,
                                    }}
                                    onLongPress={ () => handleShowFullTime(i.timestamp) }
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
                                    <Time>{ datetime(i.timestamp, new Date()) }</Time>
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
