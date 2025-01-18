import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Checkbox, HelperText, MD3Theme, TextInput, useTheme} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import {router} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useTranslation} from "react-i18next";
import {CreatePostInterface, editPost, PostInterface} from "@/db/collections/posts";
import {Timestamp} from "@firebase/firestore";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectCity, setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";
import {
  formatToDate,
  formatToISODate,
  formatToISOTime,
  formatToTime
} from "@/assets/scripts/dateFormater";
import {selectUser} from "@/redux/user-slice/userSlice";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {selectPost, setNewPostAddress, setNewPostGeoLocation} from "@/redux/post-slice/postSlice";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

type PostFormData = {
  title: string,
  description: string,
  price: string,
  time: string,
  date: string,
  contactPhoneNumber: string,
  city: string,
  address: string
}

const REGEX = {
  numbers: /^[0-9]+$/,
}

const EditPostScreen = ({post}:{post: PostInterface}) => {

  const theme = useTheme();
  const {t} = useTranslation();

  const styles = createStyles(theme);

  const {selectedCityId, selectedCityName} = useAppSelector(selectCity);
  const {user} = useAppSelector(selectUser);
  const {newPostAddress, newPostGeoLocation} = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  const [time, setTime] = useState(post.dueDateTime.toDate());
  const [date, setDate] = useState(post.dueDateTime.toDate());
  const [cowerAdditionalCost, setCowerAdditionalCost] = useState<boolean>(post.cowerAdditionalCost);

  const [showTime, setShowTime] = useState<string | null>(formatToTime(post.dueDateTime.toDate()));
  const [showDate, setShowDate] = useState<string | null>(formatToDate(post.dueDateTime.toDate()));
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time' | undefined>(undefined);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isPostUpdating, setIsPostUpdating] = useState<boolean>(false);
  const [isDestinationError, setIsDestinationError] = useState<boolean>(false);

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

  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<PostFormData>({
    mode: "onSubmit",
  });

  const submit: SubmitHandler<PostFormData> = async (data: PostFormData) => {

    setIsPostUpdating(true);

    try {
      const editedPost: CreatePostInterface = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        dueDateTime: Timestamp.fromDate(new Date(`${formatToISODate(date)}T${formatToISOTime(time)}`)),
        destination: newPostGeoLocation!,
        contactPhoneNumber: data.contactPhoneNumber,
        cityId: selectedCityId ?? user?.cityId!,
        status: post.status,
        createdBy: post.createdBy,
        workerUserId: post.workerUserId,
        cowerAdditionalCost: cowerAdditionalCost,
        address: data.address,
        cityName: selectedCityName ?? user?.cityName!
      };

      await editPost(post.id, editedPost);

      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
    } catch (e) {
      console.error("Error editing post: ", e);
      setIsPostUpdating(false);
      router.back();
    } finally {
      setIsPostUpdating(false);
      router.back();
    }
  }

  useEffect(() => {
    dispatch(setSelectedCityId(post.cityId));
    dispatch(setSelectedCityName(post.cityName));
    dispatch(setNewPostAddress(post.address));
    dispatch(setNewPostGeoLocation(post.destination));
    return () => {
      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
      dispatch(setNewPostAddress(undefined));
      dispatch(setNewPostGeoLocation(undefined));
    }
  }, []);

  useEffect(() => {
    setValue('address', newPostAddress!, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [newPostAddress, control]);

  useEffect(() => {
    setValue('time', showTime!, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [showTime, control]);

  useEffect(() => {
    setValue('date', showDate!, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [showDate, control]);

  useEffect(() => {

    if (newPostGeoLocation !== undefined) {
      setIsDestinationError(false);
    }
  }, [newPostGeoLocation]);

  return (
      <>
        <View style={styles.container}>
          <ScrollView
              style={{paddingHorizontal: 16}}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
            <Controller
                control={control}
                defaultValue={post.title}
                name="title"
                rules={{
                  required: {value: true, message: t('fieldRequired')},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.title ? theme.colors.error : undefined}
                          activeOutlineColor={errors.title ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          mode="outlined"
                          label={t("title")}
                          value={value}
                          onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.title?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={post.description}
                name="description"
                rules={{
                  required: {value: true, message: t('fieldRequired')},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.description ? theme.colors.error : undefined}
                          activeOutlineColor={errors.description ? theme.colors.error : undefined}
                          style={{height: 160, color: theme.colors.error}}
                          mode="outlined"
                          label={t("description")}
                          value={value}
                          multiline={true}
                          onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.description?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={post.contactPhoneNumber}
                name="contactPhoneNumber"
                rules={{
                  required: {value: true, message: t('fieldRequired')},
                  pattern: {message: t('phoneNumberInvalid'), value: REGEX.numbers},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.contactPhoneNumber ? theme.colors.error : undefined}
                          activeOutlineColor={errors.contactPhoneNumber ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          mode="outlined"
                          label={t("contactPhone")}
                          placeholder="06x123456"
                          keyboardType="numeric"
                          value={value}
                          onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.contactPhoneNumber?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={selectedCityName}
                name="city"
                rules={{
                  required: {value: true, message: t('fieldRequired')},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.city ? theme.colors.error : undefined}
                          activeOutlineColor={errors.city ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          mode="outlined"
                          label={t("city")}
                          value={selectedCityName ?? value}
                          onPress={() => {
                            router.push('/city?mode=NEW_POST')
                          }}
                      />
                      <HelperText type="error">{errors.city?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={showTime ?? ''}
                name="time"
                rules={{
                  required: {value: showTime !== null, message: t('fieldRequired')},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          ref={timeInputRef}
                          outlineColor={errors.time ? theme.colors.error : undefined}
                          activeOutlineColor={errors.time ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          onFocus={() => {
                            if (timeInputRef.current !== null) {
                              // @ts-ignore
                              timeInputRef.current.blur()
                            }
                          }}
                          mode="outlined"
                          label={t("time")}
                          value={showTime ?? value}
                          onPress={() => {
                            setDateTimeMode('time')
                            setShowTimePicker(true)
                          }}
                          // onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.time?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={showDate ?? ''}
                name="date"
                rules={{
                  required: {value: showDate !== null, message: t('fieldRequired')},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          ref={dateInputRef}
                          outlineColor={errors.date ? theme.colors.error : undefined}
                          activeOutlineColor={errors.date ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          onFocus={() => {
                            if (dateInputRef.current !== null) {
                              // @ts-ignore
                              dateInputRef.current.blur()
                            }
                          }}
                          mode="outlined"
                          label={t("date")}
                          value={showDate ?? value}
                          onPress={() => {
                            setDateTimeMode('date')
                            setShowTimePicker(true)
                          }}
                          // onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.date?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                defaultValue={post.price.toString()}
                name="price"
                rules={{
                  required: {value: true, message: t('fieldRequired')},
                  pattern: {message: t('priceInvalid'), value: REGEX.numbers},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.price ? theme.colors.error : undefined}
                          activeOutlineColor={errors.price ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          mode="outlined"
                          label={t("price")}
                          placeholder="11"
                          keyboardType="numeric"
                          value={value}
                          onChangeText={(value) => onChange(value)}
                      />
                      <HelperText type="error">{errors.price?.message}</HelperText>
                    </>
                )}
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
            <View style={[{
              marginVertical: 12,
              height: 300,
              width: '100%',
            }, isDestinationError && {borderWidth: 2, borderColor: theme.colors.error}]}>
              <MapView
                  loadingEnabled={true}
                  onPress={() => router.navigate('/map')}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  scrollEnabled={false}  // Disable scrolling
                  zoomEnabled={false}    // Disable zooming
                  rotateEnabled={false}  // Disable rotation
                  pitchEnabled={false}   // Disable tilting
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
            <Controller
                control={control}
                defaultValue={newPostAddress}
                name="address"
                rules={{
                  required: {
                    value: newPostAddress !== undefined,
                    message: t('fieldRequired')
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <>
                      <TextInput
                          outlineColor={errors.address ? theme.colors.error : undefined}
                          activeOutlineColor={errors.address ? theme.colors.error : undefined}
                          style={{color: theme.colors.error}}
                          mode="outlined"
                          label={t("address")}
                          value={newPostAddress ?? value}
                          onChangeText={(value) => {
                            dispatch(setNewPostAddress(value))
                            onChange(value)
                          }}
                      />
                      <HelperText type="error">{errors.address?.message}</HelperText>
                    </>
                )}
            />
            <Button
                loading={isPostUpdating}
                mode='contained'
                style={{marginBottom: 6}}
                onPress={() => {
                  if (newPostAddress === undefined) {
                    dispatch(setNewPostAddress(""));
                  }
                  if (showTime === null) {
                    setShowTime("");
                  }
                  if (showDate === null) {
                    setShowDate("");
                  }
                  if (newPostGeoLocation === undefined) {
                    setIsDestinationError(true);
                  }
                  handleSubmit(submit)();
                }}
            >{t("save").toUpperCase()}</Button>
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

export default EditPostScreen;

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
