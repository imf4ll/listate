import { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import { 
    Container, NameInput, Tasks,
    Item, AddInput, AddNumberInput,
    Button,
} from './styles';

export default ({ navigation, route }) => {
    const translateInputs = useRef(new Animated.Value(-250)).current;
    const widthFocused = useRef(new Animated.Value(100)).current;
    const tasksRef = useRef();
    const [ itemsRef, setItemsRef ] = useState([]);
    const [ deleteRef, setDeleteRef ] = useState([]);
    const [ inputFocused, setInputFocused ] = useState(false);
    const [ template, setTemplate ] = useState({});
    const { id } = route.params.params;
    const theme = useTheme();
    const phcolor = "rgb(160, 160, 160)";

    useEffect(async () => {
        const template = JSON.parse(await AsyncStorage.getItem('templates')).filter(i => i.id === id)[0];
        const items = template.items.map(i => {
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
            }).start(),
        ]);

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
        if (itemsRef.length !== 0 && template.items !== undefined) {
            let delay = 250;

            itemsRef.forEach((i, k) => {
                let isInitial = false;
                
                if (template.items[k] !== undefined && template.items[k].hasOwnProperty('initial')) {
                    isInitial = true;
                    
                }

                Animated.spring(i, {
                    toValue: 0,
                    duration: 750,
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
        const newTemplates = JSON.parse(templates).filter(i => i.id !== id);

        await AsyncStorage.setItem('templates', JSON.stringify(newTemplates));

        navigation.goBack();
    }

    const handleDeleteTask = id => {
        Vibration.vibrate(50);

        Animated.timing(deleteRef[id], {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start(({ finished }) => {
            setTemplate({
                id: template.id,
                name: template.name,
                items: template.items.filter(i => i.id !== id).map((i, k) => {
                    return {
                        id: k,
                        item: i.item,
                        quantity: i.quantity,
                        checked: i.checked,
                        total: i.total,
                    }
                })
            });

            setItemsRef(itemsRef.filter((_, k) => k !== id));
            setDeleteRef(deleteRef.filter((_, k) => k !== id));

            finished &&
                Animated.timing(deleteRef[id], {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false,
                }).start();
        });
    }

    const handleInput = (text, i) => template.items[i].item = text;

    const handleNumberInput = (text, i) => template.items[i].quantity = parseInt(text);

    const handleSave = async () => {
        const templates = await AsyncStorage.getItem('templates');
        Vibration.vibrate(50);

        if (template.items.length === 0) {
            Toast.show('Items cannot be empty.', Toast.SHORT);

            return
        }

        if (template.name === '') {
            Toast.show('Template name cannot be empty.', Toast.SHORT);

            return
        }

        if (template.items.filter(i => i.item === '').length !== 0) {
            Toast.show('Items name cannot be empty.', Toast.SHORT);

            return
        }

        const templateParsed = JSON.parse(templates);

        await AsyncStorage.setItem('templates', JSON.stringify([
            ...templateParsed.filter(i => i.id !== id).map(i => i), {
                id,
                name: template.name,
                items: template.items,
            }
        ]));

        Toast.show('Created successfully', Toast.SHORT);
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <NameInput
                    placeholderTextColor={ phcolor }
                    onChangeText={ t => template.name = t }
                    defaultValue={ template.name }
                    onFocus={ () => setInputFocused(true) }
                    onBlur={ () => setInputFocused(false) }
                    style={{ width: widthFocused, transform: [{ translateY: translateInputs }] }}
                />
                <Tasks
                    ref={ tasksRef }
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ alignItems: 'center' }}
                    onContentSizeChange={ () => tasksRef.current.scrollToEnd({ animated: true, }) }
                >
                    { 
                        template.items !== undefined && template.items.map((i, k) => (
                            <Item
                                key={ k }
                                onLongPress={ () => handleDeleteTask(k) }
                                style={{ transform: [{ translateX: itemsRef[k] }, { scale: deleteRef[k] }] }}
                            >
                                <AddInput
                                    placeholder="Item name"
                                    placeholderTextColor={ phcolor }
                                    defaultValue={ i.item }
                                    onChangeText={ t => handleInput(t, i.id) }
                                />
                                <AddNumberInput
                                    placeholderTextColor={ phcolor }
                                    keyboardType="numeric"
                                    defaultValue={ `${ i.quantity }` }
                                    onChangeText={ t => handleNumberInput(t, i.id) }
                                />
                            </Item>
                        )) 
                    }
                </Tasks>
            </Container>
        </ThemeProvider>
    );
}
