import { ThemeProvider } from 'styled-components';
import useTheme from '../../hooks/useTheme';
import { Container, Menu, MenuIcon } from './styles';

export default props => {
    const { navigation } = props;

    return (
        <ThemeProvider theme={ useTheme() }> 
            <Container>
                <Menu>
                    <MenuIcon
                        name="add"
                        size={ 40 }
                        onPress={ () => navigation.navigate('Template') }
                    />
                </Menu>
            </Container>
        </ThemeProvider>
    );
}
