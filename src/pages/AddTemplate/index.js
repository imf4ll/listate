import { useEffect, useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import useTheme from '../../hooks/useTheme';
import { 
    Container, Information, TextInput,
    ColorInput, Scroll, Task,
    Title, Item, AddInput,
    AddNumberInput, New, Done,
} from './styles';

export default ({ navigation }) => {
    const translateInputs = useRef(new Animated.Value(-250)).current;
    const translateScroll = useRef(new Animated.Value(2000)).current;
    const [ itemsRef, setItemsRef ] = useState([]);
    const [ name, setName ] = useState('');
    const [ color, setColor ] = useState('');
    const [ items, setItems ] = useState([]);
    const theme = useTheme();
    const phcolor = "rgb(160, 160, 160)";

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateInputs, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateScroll, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true,
                delay: 150,
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
        if (itemsRef.length !== 0) {
            Animated.timing(itemsRef[itemsRef.length - 1], {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.bounce,
            }).start();
        }
    
    }, [ itemsRef ]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Done
                    onPress={ handleSave }
                    size={ 25 }
                    color={ theme.Header.button }
                    name="done"
                    underlayColor="transparent"
                    backgroundColor="transparent"
                    activeOpacity={ 0.6 }
                />
            )
        });

    }, [ name, color, items ]);

    const handleNew = () => {
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
        const template = await AsyncStorage.getItem('templates');

        if (template === null) {
            await AsyncStorage.setItem('templates', JSON.stringify([{
                id: uuid(),
                name,
                color,
                items
            }]));

        } else {
            const templateParsed = JSON.parse(template);

            await AsyncStorage.setItem('templates', JSON.stringify([...templateParsed.map(i => i), {
                id: uuid(),
                name,
                color,
                items,
            }]));
        }

        Toast.show('Created successfully', Toast.SHORT);
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <Information style={{ transform: [{ translateY: translateInputs }] }}>
                    <TextInput
                        placeholder="Template name"
                        placeholderTextColor={ phcolor }
                        onChangeText={ setName }
                    />
                    <ColorInput
                        placeholder="Color"
                        placeholderTextColor={ phcolor }
                        onChangeText={ t => setColor(t.toLowerCase()) }
                        style={{
                            borderColor: color,
                        }}
                    />
                </Information>
                <Scroll
                    showsVerticalScrollIndicator={ false }
                    style={{ transform: [{ translateY: translateScroll }] }}
                >
                    <Task>
                        <Title>Add items</Title>
                        { 
                            items.map((_, k) => (
                                <Item
                                    key={ k }
                                    style={{ transform: [{ translateX: itemsRef[k] }] }}
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
                        <New
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            activeOpacity={ 0.6 }
                            name="library-add"
                            size={ 30 }
                            onPress={ handleNew }
                            color={ theme.Header.button }
                        />
                    </Task>
                </Scroll>
            </Container>
        </ThemeProvider>
    );
}
