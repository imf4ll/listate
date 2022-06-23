import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

import { en, pt } from '../utils/locale';

export const useLang = () => {
    const [ lang, setLang ] = useState<string>('EN');

    (async() => {
        const lang = await AsyncStorage.getItem('lang');

        if (lang === null) {
            await AsyncStorage.setItem('lang', 'EN');

        } else {
            setLang(lang);

        }
    })();

    return lang === 'PT' ? pt : en;
}
