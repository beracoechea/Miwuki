import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Inicio from './Inicio';
import Chatbot from './Chatbot';
import CaminoAdiestramiento from './CaminoAdiestramiento';
import Mapa from './Mapa';
import Cartilla from './Cartilla';

const Tab = createBottomTabNavigator();

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { email, perro } = this.props.route.params;

    return (
      <Tab.Navigator
        tabBarOptions={null} // Eliminamos tabBarOptions
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Chatbot') {
              iconName = focused ? 'robot' : 'robot-outline';
            } else if (route.name === 'CaminoAdiestramiento') {
              iconName = focused ? 'tennis-ball' : 'tennis-ball';
            } else if (route.name === 'Mapa') {
              iconName = focused ? 'google-maps' : 'google-maps';
            } else if (route.name === 'Cartilla') {
              iconName = focused ? 'notebook-check' : 'notebook-check';
            }

            return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: '#66280a',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#ffffff', // Cambia el color de fondo de la barra de pestañas
            borderTopWidth: 1, // Añade un borde superior a la barra de pestañas
            borderTopColor: '#cccccc', // Color del borde superior
            paddingTop: 5, // Ajusta el espacio superior de la barra de pestañas
            paddingBottom: 5, // Ajusta el espacio inferior de la barra de pestañas
          },
        })}
      >
        <Tab.Screen
          name="Inicio"
          initialParams={{ email}}
          options={{
            tabBarLabel: 'Inicio',
            headerShown: false,
          }}
        >
          {(props) => <Inicio {...props} email={email} />}
        </Tab.Screen>

        <Tab.Screen
              name="Cartilla"
              initialParams={{ email}}
              options={{
                tabBarLabel: 'Cartilla',
                headerShown: false,
              }}
            >
               {(props) => <Cartilla {...props} email={email} />}
            </Tab.Screen>

        <Tab.Screen
          name="Chatbot"
          component={Chatbot}
          options={{
            tabBarLabel: 'ChatBot',
            headerShown: false,

          }}
        />
        <Tab.Screen
          name="CaminoAdiestramiento"
          component={CaminoAdiestramiento}
          options={{
            tabBarLabel: 'Adiestramiento',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={Mapa}
          options={{
            tabBarLabel: 'Mapa',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }
}
