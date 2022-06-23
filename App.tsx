import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from './src/hooks/useTheme';
import { useLang } from './src/hooks/useLang';

import { Home } from './src/screens/Home';
import { AddTemplate } from './src/screens/AddTemplate';
import { Task } from './src/screens/Task';
import { Settings } from './src/screens/Settings';
import { History } from './src/screens/History';
import { StoragedTask } from './src/screens/StoragedTask';
import { EditTemplate } from './src/screens/EditTemplate';

export default () => {
    const theme = useTheme();
    const lang = useLang();
    const Stack = createNativeStackNavigator();

    return (
        <>
            <StatusBar style="light" translucent />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                >
                    <Stack.Screen
                        name="Home"
                        component={ Home }
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Template"
                        component={ AddTemplate }
                        options={{
                            title: lang.templateTitle,
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_left',
                        }}
                    />
                    <Stack.Screen
                        name="Task"
                        component={ Task }
                        options={{
                            title: '',
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_left',
                        }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={ Settings }
                        options={{
                            title: lang.settingsTitle,
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_right',
                            headerRight: () => (
                                <Text style={{ fontSize: 16, color: 'rgb(150, 150, 150)' }}>v1.0.8</Text>
                            )
                        }}
                    />
                    <Stack.Screen
                        name="History"
                        component={ History }
                        options={{
                            title: lang.historyTitle,
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_right',
                        }}
                    />
                    <Stack.Screen
                        name="StoragedTask"
                        component={ StoragedTask }
                        options={{
                            title: '',
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_left',
                        }}
                    />
                    <Stack.Screen
                        name="EditTemplate"
                        component={ EditTemplate }
                        options={{
                            title: lang.editTemplTitle,
                            headerTitleAlign: 'left',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_right',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
