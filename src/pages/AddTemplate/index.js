import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider } from 'styled-components';
import Toast from 'react-native-simple-toast';
import useTheme from '../../hooks/useTheme';
import { 
    Container, Information, TextInput,
    ColorInput, Scroll, Task,
    Title, Item, AddInput,
    AddNumberInput, New
} from './styles';

export default ({ navigation }) => {
    const [ name, setName ] = useState('');
    const [ color, setColor ] = useState('');
    const [ items, setItems ] = useState([]);
    const theme = useTheme();
    const phcolor = "rgb(160, 160, 160)";

    useEffect(() => {
        const newItem = {
            item: '',
            quantity: 1,
            total: 0,
            checked: false,
            id: items.length,
        }

        setItems([newItem]);

    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    onPress={ handleSave }
                    size={ 25 }
                    color={ theme.Header.button }
                    name="done"
                />
            )
        });

    }, [ name, color, items ])

    const handleNew = () => {
        const newItem = {
            item: '',
            quantity: 1,
            total: 0,
            checked: false,
            id: items.length,
        }

        setItems([...items, newItem]);
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
                <Information>
                    <TextInput
                        placeholder="Template name"
                        placeholderTextColor={ phcolor }
                        onChangeText={ setName }
                    />
                    <ColorInput
                        placeholder="Color"
                        placeholderTextColor={ phcolor }
                        onChangeText={ setColor }
                        style={{
                            borderColor: color,
                        }}
                    />
                </Information>
                <Scroll
                    showsVerticalScrollIndicator={ false }
                >
                    <Task>
                        <Title>Add items</Title>
                        { items.map((i, k) => (
                            <Item key={ k }>
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
                        )) }
                        <New name="library-add" size={ 30 } onPress={ handleNew } />
                    </Task>
                </Scroll>
            </Container>
        </ThemeProvider>
    );
}
