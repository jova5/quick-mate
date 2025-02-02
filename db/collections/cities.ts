import firestore from '@react-native-firebase/firestore';

export interface CityInterface {
  id: string;
  name: string;
}

export interface CountryInterface {
  id: string;
  name: string;
  cities: CityInterface[];
}

const countriesCollection = firestore().collection('countries')

export async function getAllCities(): Promise<CountryInterface[]> {
  try {
    // Fetch all countries
    const countriesSnapshot = await countriesCollection.get();

    // Map over countries and fetch their cities
    const countriesWithCities: CountryInterface[] = await Promise.all(
        countriesSnapshot.docs.map(async (doc) => {
          const countryId = doc.id;
          const countryData = doc.data();
          const countryName = countryData.name as string; // Assuming the country has a "name" field

          // Reference and fetch the cities subcollection
          const citiesSnapshot = await firestore()
          .collection('countries')
          .doc(countryId)
          .collection('cities')
          .get();

          const cities: CityInterface[] = citiesSnapshot.docs.map((cityDoc) => ({
            id: cityDoc.id,
            name: cityDoc.data().name as string, // Assuming the city has a "name" field
          }));

          return {
            id: countryId,
            name: countryName,
            cities,
          };
        })
    );

    return countriesWithCities;
  } catch (error) {
    console.error('Error fetching cities: ', error);
    return [];
  }
}
