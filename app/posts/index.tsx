import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {Button, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useRef, useState} from "react";
import {router} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const NewPost = () => {

  const theme = useTheme();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const styles = createStyles(theme);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>("");
  const [coordinates, setCoordinates] = useState<string>("");
  const [cityId, setCityId] = useState<number>(0);

  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showTime, setShowTime] = useState<string | null>(null);
  const [showDate, setShowDate] = useState<string | null>(null);
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time' | undefined>(undefined);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timeInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const handleTimeChane = (event: any, selectedValue: any) => {

    if (event.type === 'dismissed') {
      if (dateTimeMode === 'time') {
        timeInputRef.current.blur()
      } else {
        dateInputRef.current.blur()
      }
    }
    if (event.type === 'set') {
      if (dateTimeMode === 'time') {
        const hours = String(selectedValue.getHours()).padStart(2, '0'); // Ensures two digits
        const minutes = String(selectedValue.getMinutes()).padStart(2, '0');

        const time = `${hours}:${minutes}`;
        setShowTime(time);
        setTime(selectedValue);
        timeInputRef.current.blur()
      } else {

        const day = String(selectedValue.getDate()).padStart(2, '0');
        const month = String(selectedValue.getMonth() + 1).padStart(2, '0');
        const year = selectedValue.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        setShowDate(formattedDate);
        setDate(selectedValue)
        dateInputRef.current.blur()
      }
    }

    setShowTimePicker(false);
  }
  return (
      <>
        <View style={styles.container}>
        <ScrollView style={{paddingHorizontal: 16}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TextInput
              mode="outlined"
              label="Title"
              value={title}
              onChangeText={text => setTitle(text)}
          />
          <TextInput
              mode="outlined"
              label="Description"
              value={description}
              multiline={true}
              style={{height: 160}}
              onChangeText={text => setDescription(text)}
          />
          <TextInput
              mode="outlined"
              label="Contact phone"
              placeholder="06x123456"
              value={contactNumber}
              onChangeText={text => setContactNumber(text)}
          />
          <TextInput
              mode="outlined"
              label="City"
              value={''}
              onPress={() => {router.push('/city', {})}}
          />
          <TextInput
              ref={timeInputRef}
              onFocus={() => {timeInputRef.current.blur()}}
              mode="outlined"
              label="Time"
              value={showTime ?? ''}
              onPress={() => {
                setDateTimeMode('time')
                setShowTimePicker(true)
              }}
          />
          <TextInput
              ref={dateInputRef}
              onFocus={() => {dateInputRef.current.blur()}}
              mode="outlined"
              label="Date"
              value={showDate ?? ''}
              onPress={() => {
                setDateTimeMode('date')
                setShowTimePicker(true)
              }}
          />
          <TextInput
              mode="outlined"
              label="Price"
              keyboardType="numeric"
              placeholder="11KM"
              value={price}
              onChangeText={text => setPrice(text)}
          />
          <View style={{
            marginVertical: 12,
            backgroundColor: 'blue',
            height: 300,
            width: '100%'
          }}></View>
          <Button mode='contained' style={{marginBottom: 6}} onPress={() => {
            router.push('/city', {})
          }}>POST</Button>
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
                    negativeButton={{label: "cancel"}}
                    positiveButton={{label: "ok"}}
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
    }
  })
}
