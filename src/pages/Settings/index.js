import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch, Animated, Easing } from 'react-native';
import { reloadAsync } from 'expo-updates';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import useTheme from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    Container, Section, TitleSection,
    Setting, TitleSetting, IconSetting,
    Title, Button, TitleSectionText,
} from './styles';

export default ({ navigation }) => {
    const [ isEnabled, setIsEnabled ] = useState(false);
    const translate = useRef(new Animated.Value(500)).current;
    const scaleIcons = useRef(new Animated.Value(1)).current;
    const theme = useTheme();

    useEffect(async () => {
        const theme = await AsyncStorage.getItem('theme');
        theme === 'dark' ? setIsEnabled(true) : setIsEnabled(false);

        Animated.parallel([
            Animated.timing(translate, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.loop(Animated.sequence([
                Animated.timing(scaleIcons, {
                    toValue: 0.8,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(scaleIcons, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.linear,
                })
            ]))
        ]).start();

    }, []);

    const handleHistory = async () => {
        await AsyncStorage.removeItem('history');
        navigation.goBack();
    
    }

    const handleTemplates = async () => {
        await AsyncStorage.removeItem('templates');
        navigation.goBack();

    }

    const handleWipe = async () => {
        await AsyncStorage.multiRemove(['templates', 'history']);
        navigation.goBack();

    }

    const handleSwitch = async () => {
        await reloadAsync();
        await AsyncStorage.setItem('theme', isEnabled ? 'light' : 'dark');
        
        setIsEnabled(!isEnabled);
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <TitleSection
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Icon
                        color={ theme.Header.button }
                        name="playlist-add-check"
                        size={ 30 }
                        style={{ marginRight: 10 }}
                    />
                    <TitleSectionText>Tasks</TitleSectionText>
                </TitleSection>
                <Section
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="update-disabled"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>Clear history</Title>
                        </TitleSetting>
                        <Button onPress={ handleHistory }>Clear</Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="unpublished"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>Clear templates</Title>
                        </TitleSetting>
                        <Button onPress={ handleTemplates }>Clear</Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="local-fire-department"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>Wipe</Title>
                        </TitleSetting>
                        <Button onPress={ handleWipe }>Wipe</Button>
                    </Setting>
                </Section>
                <TitleSection
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Icon
                        color={ theme.Header.button }
                        name="palette"
                        size={ 30 }
                        style={{ marginRight: 10 }}
                    />
                    <TitleSectionText>Appeareance</TitleSectionText>
                </TitleSection>
                <Section
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name={ isEnabled ? "nights-stay" : "wb-sunny" }
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>Switch theme</Title>
                        </TitleSetting>
                        <Switch
                            trackColor={{ true: "#444", false: "rgb(180, 180, 180)" }}
                            thumbColor={ isEnabled ? '#808080' : "rgb(230, 230, 230)" }
                            onValueChange={ handleSwitch }
                            value={ isEnabled }
                        />
                    </Setting>
                </Section>
            </Container>
        </ThemeProvider>
    );
}
