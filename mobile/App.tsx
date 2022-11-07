import { NativeBaseProvider, StatusBar } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/styles/theme';

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/contexts/auth';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  {/* Definindo aqui ira definir para toda a aplicação -- ponto de partida */ }
  return (

    <NativeBaseProvider theme={THEME}>
      <AuthProvider>
        <StatusBar
          barStyle='light-content'
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Routes /> : <Loading />}

      </AuthProvider>
    </NativeBaseProvider>
  );
}

