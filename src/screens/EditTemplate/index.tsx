import { useEffect, useState, useRef } from 'react';
import { Animated, Vibration, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../hooks/useTheme';
import { IItem, ITaskSingle } from '../../types';
import { 
    Container, NameInput, Tasks,
    Item, AddInput, AddNumberInput,
    Button,
} from './styles';
import {useLang} from '../../hooks/useLang';

export const EditTemplate = ({ navigation, route }) => {
    const translateInputs = useRef(new Animated.Value(-250)).current;
    const widthFocused = useRef(new Animated.Value(100)).current;
    const tasksRef = useRef<ScrollView>();
    const [ itemsRef, setItemsRef ] = useState(null);
    const [ deleteRef, setDeleteRef ] = useState(null);
    const [ inputFocused, setInputFocused ] = useState<boolean>(false);
    const [ template, setTemplate ] = useState<ITaskSingle>();
    const { id } = route.params.params;
    const theme = useTheme();
    const lang = useLang();
    const phcolor = "rgb(160, 160, 160)";

    // @ts-ignore
    useEffect(async () => {
        const template = JSON.parse(await AsyncStorage.getItem('templates')).filter((i: IItem) => i.id === id)[0];
        console.log(1)
        const items = template.items.map((i: IItem) => {
            return {
                ...i,
                initial: true,
            }
        });

        setItemsRef(template.items.map(() => new Animated.Value(-500)));
        setDeleteRef(template.items.map(() => new Animated.Value(1)));
                
        setTemplate({
            ...template,
            items,
        });

        Animated.parallel([
            Animated.timing(translateInputs, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
        
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
        if (itemsRef && itemsRef.length !== 0 && template && template.items) {
            let delay = 250;

            itemsRef.forEach((i: any, k: number) => {
                let isInitial = false;
                
                if (template.items[k] !== undefined && template.items[k].hasOwnProperty('initial')) {
                    isInitial = true;
                    
                }

                Animated.spring(i, {
                    toValue: 0,
                    useNativeDriver: false,
                    delay: isInitial ? delay : 0,
                }).start();

                delay += 150;
            });
        }

    }, [ template, itemsRef ]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <Button
                        onPress={ handleDeleteTemplate }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: true,
                            radius: 35,
                            foreground: true,
                        }}
                    >
                        <Icon
                            size={ 25 }
                            color="#ff6363"
                            name="delete"
                        />
                    </Button>
                    <Button
                        onPress={ handleNew }
                        android_ripple={{
                            color: theme.Header.ripple,
                            borderless: true,
                            radius: 35,
                            foreground: true,
                        }}
                        style={{ marginLeft: 10 }}
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
                        style={{ marginLeft: 10 }}
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
    });

    const handleNew = () => {
        Vibration.vibrate(50);
        
        const newItem = {
            item: '',
            quantity: 1,
            total: 0,
            checked: false,
            id: template.items.length,
        }

        setTemplate({
            id,
            name: template.name,
            items: [ ...template.items, newItem ],
        });
        
        setDeleteRef([ ...deleteRef, new Animated.Value(1) ]);
        setItemsRef([ ...itemsRef, new Animated.Value(-500) ]);
    }

    const handleDeleteTemplate = async () => {
        Vibration.vibrate(50);
        
        const templates = await AsyncStorage.getItem('templates');
        const newTemplates = JSON.parse(templates).filter((i: IItem) => i.id !== id);

        await AsyncStorage.setItem('templates', JSON.stringify(newTemplates));

        navigation.goBack();
    }

    const handleDeleteTask = (id: number) => {
        Vibration.vibrate(50);

        Animated.timing(deleteRef[id], {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start(({ finished }) => {
            setTemplate({
                id: template.id,
                name: template.name,
                items: template.items.filter((i: IItem) => i.id !== id).map((i: IItem, k: number) => {
                    return {
                        id: k,
                        item: i.item,
                        quantity: i.quantity,
                        checked: i.checked,
                        total: i.total,
                    }
                })
            });

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

    const handleInput = (text: string, i: number) => template.items[i].item = text;

    const handleNumberInput = (text: string, i: number) => template.items[i].quantity = parseInt(text);

    const handleSave = async () => {
        const templates = await AsyncStorage.getItem('templates');
        Vibration.vibrate(50);

        if (template.items.length === 0) {
            Toast.show(lang.emptyItem, Toast.SHORT);

            return
        }

        if (template.name === '') {
            Toast.show(lang.emptyTempName, Toast.SHORT);

            return
        }

        if (template.items.filter((i: IItem) => i.item === '').length !== 0) {
            Toast.show(lang.emptyItem, Toast.SHORT);

            return
        }

        const templateParsed = JSON.parse(templates);

        await AsyncStorage.setItem('templates', JSON.stringify([
            ...templateParsed.filter((i: IItem) => i.id !== id).map((i: IItem) => i), {
                id,
                name: template.name,
                items: template.items,
            }
        ]));

        Toast.show(lang.createSuccess, Toast.SHORT);
        navigation.goBack();
    }

    const scrollToEnd = () => tasksRef.current.scrollToEnd({ animated: true, });

    return (
        <ThemeProvider theme={ theme }>
            {
                template &&
                    <Container>
                        <NameInput
                            placeholderTextColor={ phcolor }
                            onChangeText={ (t: string) => template.name = t }
                            defaultValue={ template.name }
                            onFocus={ () => setInputFocused(true) }
                            onBlur={ () => setInputFocused(false) }
                            style={{ width: widthFocused, transform: [{ translateY: translateInputs }] }}
                        />
                        <Tasks
                            ref={ tasksRef }
                            showsVerticalScrollIndicator={ false }
                            contentContainerStyle={{ alignItems: 'center' }}
                            onContentSizeChange={ scrollToEnd }
                        >
                            {  
                                template.items.map((i: IItem, k: number) => (
                                    <Item
                                        key={ k }
                                        onLongPress={ () => handleDeleteTask(k) }
                                        style={{ transform: [{ translateX: itemsRef[k] }, { scale: deleteRef[k] }] }}
                                    >
                                        <AddInput
                                            placeholder={ lang.itemName }
                                            placeholderTextColor={ phcolor }
                                            defaultValue={ i.item }
                                            onChangeText={ (t: string) => handleInput(t, i.id) }
                                        />
                                        <AddNumberInput
                                            placeholderTextColor={ phcolor }
                                            keyboardType="numeric"
                                            defaultValue={ `${ i.quantity }` }
                                            onChangeText={ (t: string) => handleNumberInput(t, i.id) }
                                        />
                                    </Item>
                                )) 
                            }
                        </Tasks>
                    </Container>
                }
        </ThemeProvider>
    );
}
