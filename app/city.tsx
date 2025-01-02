import {ActivityIndicator, Button, List, MD3Theme, useTheme} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {CountryInterface, getAllCities} from "@/db/collections/cities";
import {router, useLocalSearchParams} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectCity, setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";

const CityScreen = () => {
  const params = useLocalSearchParams();
  const {mode} = params;

  const theme = useTheme();
  const styles = createStyles(theme);

  const [areCountriesLoading, setAreCountriesLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryInterface[]>([]);

  const {selectedCityId} = useAppSelector(selectCity);
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

  const selectCity1 = (id: string, name: string): void => {

    if (mode === "NEW_POST") {
      dispatch(setSelectedCityId(id));
      dispatch(setSelectedCityName(name))
      router.back();
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
