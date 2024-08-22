import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Carga from './Componets/Screens/Carga';
import Registro from './Componets/Sesion/Registro';


import Signup from './Componets/Sesion/Signup';
import Ingresar from './Componets/Sesion/Ingresar';
import PerfilMascotas from './Componets/Perfiles/PerfilMascotas';
import PerfilUsuario from './Componets/Perfiles/PerfilUsuario';

import Menu from './Componets/Menu/Menu';
import Inicio from './Componets/Inicio/Inicio';
import Chatbot from './Componets/ChatBot/Chatbot';
import Mapa from './Componets/Maps/Mapa';
import Cartilla from './Componets/Cartilla/Cartilla';
import MascotaCard from './Componets/Inicio/Mascota/MascotaCard';
import Citas from './Componets/Citas/Citas';




const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Carga">
        <Stack.Screen name="Carga" component={Carga} options={{ headerShown: false }}/>
        <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }}/>

        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} options={{ headerShown: false }}/>
        <Stack.Screen name="PerfilMascotas" component={PerfilMascotas} options={{ headerShown: false }}/>
        <Stack.Screen name="Ingresar" component={Ingresar} options={{ headerShown: false }}/>
        
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>
        <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: true }}/>
        <Stack.Screen name="Cartilla" component={Cartilla} options={{ headerShown:false }}/>
        <Stack.Screen name="Chatbot" component={Chatbot} options={{ headerShown: false }}/>
        <Stack.Screen name="MascotaCard" component={MascotaCard} options={{headerShown:false}}/>
        <Stack.Screen name="Citas" component={Citas} options={{headerShown:false}}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;