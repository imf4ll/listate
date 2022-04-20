import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';
import { Image, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';
import {
    Container, Scroll, Template,
    TitleTemplate, Item, TitleItem,
    Checkmark, TitleNoOne
} from './styles';
import Menu from '../../components/Menu';

import Empty from '../../assets/none.png';

export default ({ navigation }) => {
    const [ templates, setTemplates ] = useState([]);
    const isFocused = useIsFocused();
    const theme = useTheme();

    useEffect(async () => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        onPress={ () => navigation.navigate('History') }
                        size={ 25 }
                        color={ theme.Header.button }
                        name="history"
                        style={{ marginRight: 15 }}
                    />
                    <Icon
                        onPress={ handleSettings }
                        size={ 25 }
                        color={ theme.Header.button }
                        name="more-vert"
                    />
                </View>
            ),
            headerLeft: () => (
                <Icon
                    onPress={ async () => {
                            const templates = await AsyncStorage.getItem('templates');
                            setTemplates(JSON.parse(templates));

                            Toast.show('Refreshing...', Toast.SHORT)
                        }
                    }
                    size={ 25 }
                    color={ theme.Header.button }
                    name="refresh"
                />
            )
        });

    }, []);

    useEffect(async () => {
        const templates = await AsyncStorage.getItem('templates');

        if (templates !== null) {
            setTemplates(JSON.parse(templates));

        }

    }, [ isFocused ]);

    const handleSettings = () => navigation.navigate('Settings');

    const handleTask = id =>
        navigation.navigate('Task', {
            params: {
                id,
            }
        });
        
    return (
        <ThemeProvider theme={ theme }>
            <Container>
                { 
                    templates !== null && templates.length !== 0
                    ? 
                    <Scroll
                        showsVerticalScrollIndicator={ false }
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {
                            templates.map((i, k) => (
                                <Template style={{ borderColor: i.color }} key={ k } onPress={ () => handleTask(i.id) }>
                                    <TitleTemplate>
                                        { i.name }
                                    </TitleTemplate>
                                    {
                                        i.items.map((i, k) => (
                                            <Item key={ k }>
                                                <Checkmark name="check-box-outline-blank" size={ 20 } />
                                                <TitleItem>
                                                    { i.item }
                                                </TitleItem>
                                            </Item>
                                        ))
                                    }
                                </Template>
                            ))
                        }
                    </Scroll>
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
                            You don't have any template storaged, try to create a new one.
                        </TitleNoOne>
                    </>

                }
                <Menu navigation={ navigation } />
            </Container>
        </ThemeProvider>
    );
}
