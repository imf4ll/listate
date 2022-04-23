import { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import { 
    Container, NameInput, Tasks,
    Task, Item, AddInput,
    AddNumberInput, Button,
} from './styles';

export default ({ navigation }) => {
    const translateInputs = useRef(new Animated.Value(-250)).current;
    const translateScroll = useRef(new Animated.Value(-500)).current;
    const widthFocused = useRef(new Animated.Value(100)).current;
    const tasksRef = useRef();
    const [ itemsRef, setItemsRef ] = useState([]);
    const [ inputFocused, setInputFocused ] = useState(false);
    const [ name, setName ] = useState('');
    const [ items, setItems ] = useState([]);
    const theme = useTheme();
    const phcolor = "rgb(160, 160, 160)";

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateInputs, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.spring(translateScroll, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true,
                delay: 250,
            }),
        ]).start();

        const newItem = {
            item: '',
            quantity: 1,
            total: 0,
            checked: false,
            id: items.length,
        }

        setItems([ newItem ]);
        setItemsRef([ new Animated.Value(-500) ]);

    }, []);

    useEffect(() => {
        if (inputFocused) {
            Animated.spring(widthFocused, {
                toValue: 300,
                duration: 500,
                useNativeDriver: false,
            }).start();
        
        } else {
            Animated.spring(widthFocused, {
                toValue: 150,
                duration: 500,
                useNativeDriver: false,
            }).start();

        }

    }, [ inputFocused ]);

    useEffect(() => {
        if (itemsRef.length !== 0) {
            Animated.spring(itemsRef[itemsRef.length - 1], {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }
    
    }, [ itemsRef ]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <Button
                        onPress={ handleNew }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: true,
                            radius: 35,
                            foreground: true,
                        }}
                    >
                        <Icon
                            size={ 25 }
                            color={ theme.Header.button }
                            name="add-circle-outline"
                        />
                    </Button>
                    <Button
                        onPress={ handleSave }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: true,
                            radius: 35,
                            foreground: true,
                        }}
                        style={{ marginLeft: 15 }}
                    >
                        <Icon
                            size={ 25 }
                            color={ theme.Header.button }
                            name="done"
                        />
                    </Button>
                </>
            )
        });

    }, [ name, items ]);

    const handleNew = () => {
        Vibration.vibrate(50);
        
        const newItem = {
            item: '',
            quantity: 1,
            total: 0,
            checked: false,
            id: items.length,
        }

        setItems([ ...items, newItem ]);
        setItemsRef([ ...itemsRef, new Animated.Value(-500) ]);
    }

    const handleInput = (text, i) => items[i].item = text;

    const handleNumberInput = (text, i) => items[i].quantity = parseInt(text);

    const handleSave = async () => {
        if (name === '') {
            Toast.show('Template name cannot be empty.', Toast.SHORT);

            return
        }

        if (items.filter(i => i.item === '').length !== 0) {
            Toast.show('Items name cannot be empty.', Toast.SHORT);

            return
        }

        const template = await AsyncStorage.getItem('templates');
        Vibration.vibrate(50);

        if (template === null) {
            await AsyncStorage.setItem('templates', JSON.stringify([{
                id: uuid(),
                name,
                items
            }]));

        } else {
            const templateParsed = JSON.parse(template);

            await AsyncStorage.setItem('templates', JSON.stringify([...templateParsed.map(i => i), {
                id: uuid(),
                name,
                items,
            }]));
        }

        Toast.show('Created successfully', Toast.SHORT);
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <NameInput
                    placeholder="Name"
                    placeholderTextColor={ phcolor }
                    onChangeText={ setName }
                    onFocus={ () => setInputFocused(true) }
                    onBlur={ () => setInputFocused(false) }
                    style={{ width: widthFocused, transform: [{ translateY: translateInputs }] }}
                />
                <Tasks
                    ref={ tasksRef }
                    showsVerticalScrollIndicator={ false }
                    style={{ transform: [{ translateX: translateScroll }] }}
                    onContentSizeChange={ () => tasksRef.current.scrollToEnd({ animated: true, }) }
                >
                    <Task>
                        { 
                            items.map((_, k) => (
                                <Item
                                    key={ k }
                                    style={{ transform: [{ translateX: itemsRef[k] }] }}
                                    onPress={ () => console.log(1) }
                                >
                                    <AddInput
                                        placeholder="Item name"
                                        placeholderTextColor={ phcolor }
                                        onChangeText={ t => handleInput(t, k) }
                                    />
                                    <AddNumberInput
                                        placeholder="0"
                                        placeholderTextColor={ phcolor }
                                        keyboardType="numeric"
                                        onChangeText={ t => handleNumberInput(t, k) }
                                        defaultValue="1"
                                    />
                                </Item>
                            )) 
                        }
                    </Task>
                </Tasks>
            </Container>
        </ThemeProvider>
    );
}
