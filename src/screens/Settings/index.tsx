import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch, Animated, Easing } from 'react-native';
import { reloadAsync } from 'expo-updates';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';

import { useTheme } from '../../hooks/useTheme';
import {
    Container, Section, TitleSection,
    Setting, TitleSetting, IconSetting,
    Title, Button, TitleSectionText,
    TitleButton,
} from './styles';
import {useLang} from '../../hooks/useLang';

export const Settings = ({ navigation }) => {
    const [ isEnabled, setIsEnabled ] = useState<boolean>(false);
    const [ lang, setLang ] = useState<string | null>("");
    const translate = useRef(new Animated.Value(500)).current;
    const scaleIcons = useRef(new Animated.Value(1)).current;
    const theme = useTheme();
    const language = useLang();

    // @ts-ignore
    useEffect(async () => {
        const theme = await AsyncStorage.getItem('theme');
        theme === 'dark' ? setIsEnabled(true) : setIsEnabled(false);

        const lang = await AsyncStorage.getItem('lang');
        setLang(lang);
      
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
        await reloadAsync();
        
        navigation.goBack();
    }

    const handleSwitch = async () => {
        await AsyncStorage.setItem('theme', isEnabled ? 'light' : 'dark');
        
        setIsEnabled(!isEnabled);
        await reloadAsync();
    }
    
    const handleLang = async (v: string) => {
        setLang(v);
       
        await AsyncStorage.setItem('lang', v);
        await reloadAsync();
    }

    return (
        <ThemeProvider theme={ theme }>
            <Container>
                <TitleSection
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Icon
                        color={ theme.primary }
                        name="playlist-add-check"
                        size={ 30 }
                        style={{ marginRight: 10 }}
                    />
                    <TitleSectionText>{ language.tasks }</TitleSectionText>
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
                            <Title>{ language.clearhist }</Title>
                        </TitleSetting>
                        <Button onPress={ handleHistory } activeOpacity={ 0.7 }>
                            <TitleButton>{ language.clearText }</TitleButton>
                        </Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="unpublished"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>{ language.cleartempls }</Title>
                        </TitleSetting>
                        <Button onPress={ handleTemplates } activeOpacity={ 0.7 }>
                            <TitleButton>{ language.clearText }</TitleButton>
                        </Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="local-fire-department"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>{ language.wipe }</Title>
                        </TitleSetting>
                        <Button onPress={ handleWipe } activeOpacity={ 0.7 }>
                            <TitleButton>{ language.wipeText }</TitleButton>
                        </Button>
                    </Setting>
                </Section>
                <TitleSection
                    style={{ transform: [{ translateX: translate }] }}
                >
                    <Icon
                        color={ theme.primary }
                        name="palette"
                        size={ 30 }
                        style={{ marginRight: 10 }}
                    />
                    <TitleSectionText>{ language.appeareance }</TitleSectionText>
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
                            <Title>{ language.switch }</Title>
                        </TitleSetting>
                        <Switch
                            trackColor={{ true: "#444", false: "rgb(180, 180, 180)" }}
                            thumbColor={ isEnabled ? '#808080' : "rgb(230, 230, 230)" }
                            onValueChange={ handleSwitch }
                            value={ isEnabled }
                        />
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name="language"
                                style={{ transform: [{ scale: scaleIcons }] }}
                            />
                            <Title>{ language.lang }</Title>
                        </TitleSetting>
                        { /* @ts-ignore */ }
                        <RNPickerSelect
                            onValueChange={ v => handleLang(v) }
                            items={[
                                { label: 'English', value: 'EN' },
                                { label: 'Português', value: 'PT' },
                            ]}
                        >
                            <Title>{ lang }</Title>
                        </RNPickerSelect>
                    </Setting>
                </Section>
            </Container>
        </ThemeProvider>
    );
}
