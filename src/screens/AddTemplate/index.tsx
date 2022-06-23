import { useEffect, useState, useRef } from 'react';
import { Animated, ScrollView, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../hooks/useTheme';
import { IItem } from '../../types';
import { 
    Container, NameInput, Tasks,
    Task, Item, AddInput,
    AddNumberInput, Button,
} from './styles';
import {useLang} from '../../hooks/useLang';

export const AddTemplate = ({ navigation }) => {
    const translateInputs = useRef(new Animated.Value(-250)).current;
    const translateScroll = useRef(new Animated.Value(-500)).current;
    const widthFocused = useRef(new Animated.Value(100)).current;
    const tasksRef = useRef<ScrollView>();
    const [ itemsRef, setItemsRef ] = useState(null);
    const [ deleteRef, setDeleteRef ] = useState(null);
    const [ inputFocused, setInputFocused ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>();
    const [ items, setItems ] = useState([]);
    const theme = useTheme();
    const lang = useLang();
    const phcolor = 'rgb(160, 160, 160)';

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateInputs, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.spring(translateScroll, {
                toValue: 0,
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
        setDeleteRef([ new Animated.Value(1) ]);

    }, []);

    useEffect(() => {
        if (inputFocused) {
            Animated.spring(widthFocused, {
                toValue: 300,
                useNativeDriver: false,
            }).start();
        
        } else {
            Animated.spring(widthFocused, {
                toValue: 150,
                useNativeDriver: false,
            }).start();

        }

    }, [ inputFocused ]);

    useEffect(() => {
        if (itemsRef !== null && itemsRef.length !== 0) {
            Animated.spring(itemsRef[itemsRef.length - 1], {
                toValue: 0,
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
        setDeleteRef([ ...deleteRef, new Animated.Value(1) ]);
        setItemsRef([ ...itemsRef, new Animated.Value(-500) ]);
    }

    const handleDeleteTask = (id : number) => {
        Vibration.vibrate(50);

        Animated.timing(deleteRef[id], {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start(({ finished }) => {
            setItems(items.filter((i: IItem) => i.id !== id).map((i: IItem, k: number) => {
                return {
                    id: k,
                    item: i.item,
                    quantity: i.quantity,
                    checked: false,
                    total: 0,
                }
            }));

            setItemsRef(itemsRef.filter((_: IItem, k: number) => k !== id));
            setDeleteRef(deleteRef.filter((_: IItem, k: number) => k !== id));

            finished &&
                Animated.timing(deleteRef[id], {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false,
                }).start();
        });
    }

    const handleInput = (text: string, i: number) => items[i].item = text;

    const handleNumberInput = (text: string, i: number) => items[i].quantity = parseInt(text);

    const handleSave = async () => {
        const template = await AsyncStorage.getItem('templates');
        Vibration.vibrate(50);

        if (items.length === 0) {
            Toast.show(lang.emptyItem, Toast.SHORT);

            return
        }

        if (name === '') {
            Toast.show(lang.emptyTempName, Toast.SHORT);

            return
        }

        if (items.filter((i: IItem) => i.item === '').length !== 0) {
            Toast.show(lang.emptyItem, Toast.SHORT);

            return
        }

        if (template === null) {
            await AsyncStorage.setItem('templates', JSON.stringify([{
                id: uuid(),
                name,
                items
            }]));

        } else {
            const templateParsed = JSON.parse(template);

            await AsyncStorage.setItem('templates', JSON.stringify([...templateParsed.map((i: IItem) => i), {
                id: uuid(),
                name,
                items,
            }]));
        }

        Toast.show(lang.createSuccess, Toast.SHORT);
        navigation.goBack();
    }

    const scrollToEnd = () => tasksRef.current.scrollToEnd({ animated: true, });

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <NameInput
                    placeholder={ lang.name }
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
                    onContentSizeChange={ scrollToEnd }
                >
                    <Task>
                        { 
                            items !== null && items.map((i: IItem, k: number) => (
                                <Item
                                    key={ k }
                                    style={{ transform: [{ translateX: itemsRef[k] }, { scale: deleteRef[k] }] }}
                                    onLongPress={ () => handleDeleteTask(k) }
                                >
                                    <AddInput
                                        placeholder={ lang.itemName }
                                        defaultValue={ i.item }
                                        placeholderTextColor={ phcolor }
                                        onChangeText={ (t: string) => handleInput(t, k) }
                                    />
                                    <AddNumberInput
                                        placeholder="0"
                                        placeholderTextColor={ phcolor }
                                        keyboardType="numeric"
                                        onChangeText={ (t: string) => handleNumberInput(t, k) }
                                        defaultValue={ `${ i.quantity }` }
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
