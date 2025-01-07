import {ActivityIndicator, Button, List, MD3Theme, useTheme} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {CountryInterface, getAllCities} from "@/db/collections/cities";
import {router, useLocalSearchParams} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectCity, setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";
import {updateUserCity, updateUserPhoneNumberAndCityId} from "@/db/collections/users";
import {selectUser, setUserPhoneAndCity} from "@/redux/user-slice/userSlice";

const CityScreen = () => {
  const params = useLocalSearchParams();
  const {mode} = params;

  const theme = useTheme();
  const styles = createStyles(theme);

  const [areCountriesLoading, setAreCountriesLoading] = useState<boolean>(false);
  const [isUserCityUpdating, setIsUserCityUpdating] = useState<boolean>(false);
  const [chosenCityId, setChosenCityId] = useState<string>("");
  const [countries, setCountries] = useState<CountryInterface[]>([]);

  const {selectedCityId} = useAppSelector(selectCity);
  const {user} = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  async function getAllCountriesWithCities() {

    setAreCountriesLoading(true);
    setCountries([]);

    try {
      const countries: CountryInterface[] = await getAllCities();
      setCountries(countries);
      setAreCountriesLoading(false);
    } catch (e) {
      console.log(e);
      setAreCountriesLoading(false);
    } finally {
      setAreCountriesLoading(false);
    }
  }

  useEffect(() => {
    getAllCountriesWithCities();
  }, [])

  const selectCity1 = async (id: string, name: string): void => {

    setChosenCityId(id);

    if (mode === "NEW_POST") {
      dispatch(setSelectedCityId(id));
      dispatch(setSelectedCityName(name))
      router.back();
    }
    if (mode === "AFTER_LOGIN") {
      dispatch(setSelectedCityId(id));
      dispatch(setSelectedCityName(name))
      router.back();
    }
    if (mode === "CHANGE_USER_CITY") {
      await updateCurrentUserCity(id, name);
      dispatch(setSelectedCityId(id));
      dispatch(setSelectedCityName(name))
      router.back();
    }

  }


  const updateCurrentUserCity = async (cityId: string, cityName: string) => {

    setIsUserCityUpdating(true);

    try {
      await updateUserCity(user?.id!, cityId, cityName);

      dispatch(setUserPhoneAndCity({
        phoneNumber: user?.phoneNumber,
        cityId: cityId,
        cityName: cityName
      }));

      setIsUserCityUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUserCityUpdating(false);
    } finally {
      setIsUserCityUpdating(false);
    }
  }


  return (
      <View style={styles.container}>
        {
          areCountriesLoading ?
              (
                  <ActivityIndicator style={{flex: 1}} size="large" animating={true}/>
              )
              :
              (
                  <List.Section>
                    {
                      countries.map(country => {
                        return (
                            <List.Accordion key={country.id} title={country.name}>
                              {
                                country.cities.map(city => {
                                  return (
                                      <Button
                                          loading={chosenCityId === city.id && isUserCityUpdating}
                                          key={city.id}
                                          onPress={() => selectCity1(city.id, city.name)}
                                          style={{margin: 4}}
                                          mode='contained-tonal'
                                      >{city.name}</Button>
                                  )
                                })
                              }
                            </List.Accordion>
                        )
                      })
                    }
                  </List.Section>
              )
        }
      </View>
  )
}

export default CityScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    surface: {
      padding: 8,
      margin: 8,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 16
    },
  })
}
