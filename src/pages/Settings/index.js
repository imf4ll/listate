import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native';
import { reloadAsync } from 'expo-updates';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import useTheme from '../../hooks/useTheme';
import {
    Container, Section, TitleSection,
    Setting, TitleSetting, IconSetting,
    Title, Button
} from './styles';

export default ({ navigation }) => {
    const theme = useTheme();
    const [ isEnabled, setIsEnabled ] = useState(false);

    useEffect(async () => {
        const theme = await AsyncStorage.getItem('theme');
        
        theme === 'dark' ? setIsEnabled(true) : setIsEnabled(false);

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
        await AsyncStorage.clear();
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
                <Section>
                    <TitleSection>Tasks</TitleSection>
                    <Setting>
                        <TitleSetting>
                            <IconSetting name="update-disabled" />
                            <Title>Clear history</Title>
                        </TitleSetting>
                        <Button onPress={ handleHistory }>Clear</Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting name="unpublished" />
                            <Title>Clear templates</Title>
                        </TitleSetting>
                        <Button onPress={ handleTemplates }>Clear</Button>
                    </Setting>
                    <Setting>
                        <TitleSetting>
                            <IconSetting name="delete" />
                            <Title>Wipe</Title>
                        </TitleSetting>
                        <Button onPress={ handleWipe }>Wipe</Button>
                    </Setting>
                </Section>
                <Section>
                    <TitleSection>Appeareance</TitleSection>
                    <Setting>
                        <TitleSetting>
                            <IconSetting
                                name={ isEnabled ? "nights-stay" : "wb-sunny" }
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
