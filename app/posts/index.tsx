import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Checkbox, MD3Theme, TextInput, useTheme} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import {router} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useTranslation} from "react-i18next";
import {addPost, CreatePostInterface, PostStatus} from "@/db/collections/posts";
import {Timestamp} from "@firebase/firestore";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectCity, setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";
import {formatToISODate, formatToISOTime} from "@/assets/functions/dateFormater";
import {selectUser} from "@/redux/user-slice/userSlice";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {selectPost, setNewPostAddress, setNewPostGeoLocation} from "@/redux/post-slice/postSlice";

const NewPost = () => {

  const theme = useTheme();
  const {t} = useTranslation();

  const styles = createStyles(theme);

  const {selectedCityId, selectedCityName} = useAppSelector(selectCity);
  const {user} = useAppSelector(selectUser);
  const {newPostAddress, newPostGeoLocation} = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>("");
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [cowerAdditionalCost, setCowerAdditionalCost] = useState<boolean>(false);

  const [showTime, setShowTime] = useState<string | null>(null);
  const [showDate, setShowDate] = useState<string | null>(null);
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time' | undefined>(undefined);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isPostCreating, setIsPostCreating] = useState<boolean>(false);

  const timeInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const handleTimeChane = (event: any, selectedValue: any) => {

    if (event.type === 'dismissed') {
      if (dateTimeMode === 'time') {
        if (timeInputRef.current !== null) {
          // @ts-ignore
          timeInputRef.current.blur()
        }
      } else {
        if (dateInputRef.current !== null) {
          // @ts-ignore
          dateInputRef.current.blur()
        }
      }
    }
    if (event.type === 'set') {
      if (dateTimeMode === 'time') {
        const hours = String(selectedValue.getHours()).padStart(2, '0'); // Ensures two digits
        const minutes = String(selectedValue.getMinutes()).padStart(2, '0');

        const time = `${hours}:${minutes}`;
        setShowTime(time);
        setTime(selectedValue);
        if (timeInputRef.current !== null) {
          // @ts-ignore
          timeInputRef.current.blur()
        }
      } else {

        const day = String(selectedValue.getDate()).padStart(2, '0');
        const month = String(selectedValue.getMonth() + 1).padStart(2, '0');
        const year = selectedValue.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        setShowDate(formattedDate);
        setDate(selectedValue)
        if (dateInputRef.current !== null) {
          // @ts-ignore
          dateInputRef.current.blur()
        }
      }
    }

    setShowTimePicker(false);
  }

  async function createPost() {

    setIsPostCreating(true);

    try {
      const post: CreatePostInterface = {
        title: title,
        description: description,
        price: parseFloat(price),
        dueDateTime: Timestamp.fromDate(new Date(`${formatToISODate(date!)}T${formatToISOTime(time!)}`)),
        destination: newPostGeoLocation!,
        contactPhoneNumber: contactNumber,
        cityId: selectedCityId ?? user?.cityId!,
        status: PostStatus.OPEN,
        createdBy: user!.id as string,
        workerUserId: "",
        cowerAdditionalCost: cowerAdditionalCost,
        address: newPostAddress!,
      };

      await addPost(post);

      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
      router.back();
    } catch (e) {
      console.log(e);
      setIsPostCreating(false);
      router.back();
    } finally {
      setIsPostCreating(false);
      router.back();
    }
  }

  useEffect(() => {
    dispatch(setSelectedCityId(undefined));
    dispatch(setSelectedCityName(undefined));
    dispatch(setNewPostAddress(undefined));
    dispatch(setNewPostGeoLocation(undefined));
    return () => {
      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
      dispatch(setNewPostAddress(undefined));
      dispatch(setNewPostGeoLocation(undefined));
    }
  }, []);

  return (
      <>
        <View style={styles.container}>
          <ScrollView
              style={{paddingHorizontal: 16}}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
            <TextInput
                mode="outlined"
                label={t("title")}
                value={title}
                onChangeText={text => setTitle(text)}
            />
            <TextInput
                mode="outlined"
                label={t("description")}
                value={description}
                multiline={true}
                style={{height: 160}}
                onChangeText={text => setDescription(text)}
            />
            <TextInput
                mode="outlined"
                label={t("contactPhone")}
                placeholder="06x123456"
                keyboardType="numeric"
                value={contactNumber}
                onChangeText={text => setContactNumber(text)}
            />
            <TextInput
                mode="outlined"
                label={t("city")}
                value={selectedCityName ?? user?.cityName!}
                onPress={() => {
                  router.push('/city?mode=NEW_POST')
                }}
            />
            <TextInput
                ref={timeInputRef}
                onFocus={() => {
                  if (timeInputRef.current !== null) {
                    // @ts-ignore
                    timeInputRef.current.blur()
                  }
                }}
                mode="outlined"
                label={t("time")}
                value={showTime ?? ''}
                onPress={() => {
                  setDateTimeMode('time')
                  setShowTimePicker(true)
                }}
            />
            <TextInput
                ref={dateInputRef}
                onFocus={() => {
                  if (dateInputRef.current !== null) {
                    // @ts-ignore
                    dateInputRef.current.blur()
                  }
                }}
                mode="outlined"
                label={t("date")}
                value={showDate ?? ''}
                onPress={() => {
                  setDateTimeMode('date')
                  setShowTimePicker(true)
                }}
            />
            <TextInput
                mode="outlined"
                label={t("price")}
                keyboardType="numeric"
                placeholder="11KM"
                value={price}
                onChangeText={text => setPrice(text)}
            />
            <Checkbox.Item
                labelStyle={{textAlign: 'left'}}
                position="leading"
                status={cowerAdditionalCost ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCowerAdditionalCost(!cowerAdditionalCost);
                }}
                label={t("coverAdditionalCosts")}
            />
            <TextInput
                mode="outlined"
                label={t("address")}
                value={newPostAddress}
                onChangeText={(text) => dispatch(setNewPostAddress(text))}
            />
            <View style={{
              marginVertical: 12,
              height: 300,
              width: '100%'
            }}>
              <MapView
                  loadingEnabled={true}
                  onPress={() => router.navigate('/map')}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: 43.9,
                    longitude: 17.7,
                    latitudeDelta: 2.8,
                    longitudeDelta: 2.8,
                  }}
                  region={{
                    latitude: newPostGeoLocation ? newPostGeoLocation.latitude : 43.9,
                    longitude: newPostGeoLocation ? newPostGeoLocation.longitude : 17.7,
                    latitudeDelta: newPostGeoLocation ? 0.002 : 2.8,
                    longitudeDelta: newPostGeoLocation ? 0.002 : 2.8,
                  }}
                  scrollEnabled={false}  // Disable scrolling
                  zoomEnabled={false}    // Disable zooming
                  rotateEnabled={false}  // Disable rotation
                  pitchEnabled={false}   // Disable tilting
              >
                {newPostGeoLocation !== undefined && (
                    <Marker
                        coordinate={
                          {
                            latitude: newPostGeoLocation.latitude,
                            longitude: newPostGeoLocation.longitude
                          }
                        }
                    />
                )}
              </MapView>
            </View>
            <Button
                loading={isPostCreating}
                mode='contained'
                style={{marginBottom: 6}}
                onPress={() => createPost()}
            >{t("post").toUpperCase()}</Button>
          </ScrollView>
        </View>
        {
            showTimePicker && (
                <DateTimePicker
                    display='default'
                    is24Hour={true}
                    timeZoneName={"Europe/Sarajevo"}
                    mode={dateTimeMode}
                    value={dateTimeMode === 'time' ? (time ?? new Date()) : (date ?? new Date())}
                    onChange={handleTimeChane}
                    negativeButton={{label: t("cancel")}}
                    positiveButton={{label: t("ok")}}
                />
            )
        }
      </>
  )
}

export default NewPost;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  })
}
