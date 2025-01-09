import 'react-native-get-random-values'
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Alert, Platform, ScrollView, StyleSheet, View} from "react-native";
import React, {useRef, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, MD3Theme, useTheme} from "react-native-paper";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectPost, setNewPostAddress, setNewPostGeoLocation} from "@/redux/post-slice/postSlice";
import {router} from "expo-router";
import { GOOGLE_API_KEY } from '@env';

const MapScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const googlePlacesRef = useRef(null); // Ref for GooglePlacesAutocomplete

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const dispatch = useAppDispatch();
  const {newPostAddress, newPostGeoLocation} = useAppSelector(selectPost);

  const [region, setRegion] = useState({
    latitude: newPostGeoLocation ? newPostGeoLocation.latitude : 43.9,
    longitude: newPostGeoLocation ? newPostGeoLocation.latitude : 17.7,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const [marker, setMarker] = useState(null);

  const handlePlaceSelect = async (placeId) => {
    try {
      const location = await getPlaceDetails(placeId);
      if (location) {
        const {lat, lng} = location;

        // Update the map region and add a marker
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        setMarker({
          latitude: lat,
          longitude: lng,
        });

        dispatch(setNewPostGeoLocation({latitude: lat, longitude: lng}));
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };

  const getPlaceDetails = async (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.result && result.result.geometry) {
      return result.result.geometry.location; // Returns { lat, lng }
    } else {
      throw new Error('Place details not found');
    }
  };

  const handleLongPress = (event) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    // Set a new marker at the pressed location
    setMarker({
      latitude,
      longitude,
    });

    dispatch(setNewPostGeoLocation({latitude: latitude, longitude: longitude}));

    handleMarkerDragEnd(event);
  };

  const handleMarkerDragEnd = async (event) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    // Update marker position
    setMarker({latitude, longitude});

    // Fetch address for the new location
    try {
      const fetchedAddress = await fetchAddressFromCoords(latitude, longitude);
      dispatch(setNewPostAddress(fetchedAddress));

      // Set the fetched address into GooglePlacesAutocomplete
      if (googlePlacesRef.current) {
        googlePlacesRef.current?.setAddressText(fetchedAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'Failed to fetch address. Please try again.');
    }
  };

  const fetchAddressFromCoords = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address; // Return the first address
      } else {
        throw new Error('No address found for these coordinates.');
      }
    } catch (error) {
      console.error('Geocoding API error:', error);
      throw error;
    }
  };

  return (
      <Container style={styles.container}>
        <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={region}
            onLongPress={handleLongPress}
        >
          {marker && (
              <Marker
                  coordinate={marker}
              />
          )}
        </MapView>
          <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder={t('search')}
              onPress={(data) => {
                dispatch(setNewPostAddress(data.description));
                handlePlaceSelect(data.place_id);
                console.log(newPostGeoLocation);
                console.log(newPostAddress);
              }}
              query={{
                key: process.env.GOOGLE_API_KEY,
                language: 'en',
                components: 'country:ba'
              }}
              onFail={error => console.error(error)}
          />

        <Button
            mode='contained'
            style={{marginBottom: 6}}
            onPress={() => {
              if (newPostAddress !== undefined && newPostGeoLocation !== undefined) {
                router.back();
              }
            }
            }
        >{t('confirm')}</Button>
      </Container>
  )
}

export default MapScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  })
}
