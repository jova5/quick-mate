import React from 'react';

import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, useTheme} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "@/app/(tabs)/home";
import ProfileScreen from "@/app/(tabs)/profile";

const Tab = createBottomTabNavigator();


const HomeScreens = () => {

  const theme = useTheme();


  // return(
  //     <Stack>
  //       <Stack.Screen name="home" options={{headerShown: false}}/>
  //       <Stack.Screen name="posts/[id]" options={
  //         {
  //           headerShown: true,
  //           headerStyle: {backgroundColor: theme.colors.surfaceVariant} ,
  //           headerTitleStyle: {color: theme.colors.onSurfaceVariant},
  //           headerTintColor: theme.colors.onSurfaceVariant
  //         }}/>
  //     </Stack>
  // )

  // return (
  //     <Tabs
  //         screenOptions={{
  //           tabBarActiveTintColor:  'black',
  //           headerShown: false,
  //           tabBarButton: HapticTab,
  //           tabBarBackground: TabBarBackground,
  //           tabBarStyle: Platform.select({
  //             android: {
  //               backgroundColor: theme.colors.tertiaryContainer,
  //             },
  //             ios: {
  //               // Use a transparent background on iOS to show the blur effect
  //               position: 'absolute',
  //             },
  //             default: {},
  //           }),
  //         }}>
  //       <Tabs.Screen
  //           name="home"
  //           options={{
  //             title: 'Home',
  //             tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={theme.colors.onTertiaryContainer}/>,
  //           }}
  //       />
  //       <Tabs.Screen
  //           name="profile"
  //           options={{
  //             headerShown: true,
  //             headerStyle: {backgroundColor: theme.colors.surfaceVariant},
  //             headerTitleStyle: {color: theme.colors.onSurfaceVariant},
  //             headerTintColor: theme.colors.onSurfaceVariant,
  //             title: 'Profile',
  //             tabBarIcon: ({color}) => <IconSymbol size={28} name="paperplane.fill" color={theme.colors.onTertiaryContainer}/>,
  //           }}
  //       />
  //     </Tabs>
  // );

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
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}
        />
        <Tab.Screen
            name="profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => {
                return <Icon name="cog" size={size} color={color} />;
              },
            }}
        />
      </Tab.Navigator>
  );
}

export default HomeScreens;
