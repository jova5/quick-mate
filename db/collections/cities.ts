import {collection, getDocs, QuerySnapshot} from "@firebase/firestore";
import db from "@/db/firestore";

export interface CityInterface {
  id: string;
  name: string;
}

export interface CountryInterface {
  id: string;
  name: string;
  cities: CityInterface[];
}

const countriesCollection = collection(db, 'countries')

export async function getAllCities() {

  // Fetch all countries
  const countriesSnapshot: QuerySnapshot = await getDocs(countriesCollection);

  // Map over countries and fetch their cities
  const countriesWithCities: CountryInterface[] = await Promise.all(
      countriesSnapshot.docs.map(async (doc) => {
        const countryId = doc.id;
        const countryData = doc.data();
        const countryName = countryData.name as string; // Assuming the country has a "name" field

        // Reference and fetch the cities subcollection
        const citiesCollection = collection(doc.ref, "cities");
        const citiesSnapshot: QuerySnapshot = await getDocs(citiesCollection);

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
}
