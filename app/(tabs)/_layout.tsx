import React from 'react';

import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "@/app/(tabs)/home";
import ProfileScreen from "@/app/(tabs)/profile";
import {useTranslation} from "react-i18next";

const Tab = createBottomTabNavigator();

const HomeScreens = () => {

  const {t} = useTranslation();

  return (
      <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={({ navigation, state, descriptors, insets }) => (
              <BottomNavigation.Bar
                  navigationState={state}
                  safeAreaInsets={insets}
                  onTabPress={({ route, preventDefault }) => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.name,
                      canPreventDefault: true,
                    });

                    if (event.defaultPrevented) {
                      preventDefault();
                    } else {
                      navigation.dispatch({
                        ...CommonActions.navigate(route.name, route.params),
                        target: state.key,
                      });
                    }
                  }}
                  renderIcon={({ route, focused, color }) => {
                    const { options } = descriptors[route.key];
                    if (options.tabBarIcon) {
                      return options.tabBarIcon({ focused, color, size: 24 });
                    }

                    return null;
                  }}
                  getLabelText={({ route }) => {
                    const { options } = descriptors[route.key];
                    return options.tabBarLabel;
                  }}
              />
          )}
      >
        <Tab.Screen
            name="home"
            component={HomeScreen}
            options={{
              tabBarLabel: t("home"),
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}
        />
        <Tab.Screen
            name="profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: t("profile"),
              tabBarIcon: ({ color, size }) => {
                return <Icon name="account-circle" size={size} color={color} />;
              },
            }}
        />
      </Tab.Navigator>
  );
}

export default HomeScreens;
