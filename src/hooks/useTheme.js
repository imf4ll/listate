import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from 'react';
import { dark, light } from '../themes';

export default () => {
    const [ theme, setTheme ] = useState('dark');

    (async () => {
        const theme = await AsyncStorage.getItem('theme');

        if (theme === null) {
            await AsyncStorage.setItem('theme', 'dark');

        } else {
            setTheme(theme);
            
        }

    })();

    return theme === 'dark' ? dark : light;
}
