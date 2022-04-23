import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import useTheme from './hooks/useTheme';
import Home from './pages/Home';
import AddTemplate from './pages/AddTemplate';
import Task from './pages/Task';
import Settings from './pages/Settings';
import History from './pages/History';
import StoragedTask from './pages/StoragedTask';

const Stack = createNativeStackNavigator();

export default () => {
    const theme = useTheme();

    return (
        <>
            <StatusBar style="light" />
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
                            title: 'New',
                            headerTitleAlign: 'center',
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
                            headerTitleAlign: 'center',
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
                            headerTitleAlign: 'center',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_right',
                            headerRight: () => (
                                <Text style={{ fontSize: 16, color: 'rgb(150, 150, 150)' }}>v1.0.4</Text>
                            )
                        }}
                    />
                    <Stack.Screen
                        name="History"
                        component={ History }
                        options={{
                            headerTitleAlign: 'center',
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
                            headerTitleAlign: 'center',
                            headerTintColor: theme.primary,
                            headerStyle: {
                                backgroundColor: theme.Header.background,
                            },
                            animation: 'slide_from_left',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
