import {Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {Button, MD3Theme, Text, TextInput, useTheme} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import {router} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const NewPost = () => {

  const theme = useTheme();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const styles = createStyles(theme);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [contactNumber, setContactNumber] = useState<string>("");
  const [coordinates, setCoordinates] = useState<string>("");
  const [cityId, setCityId] = useState<number>(0);

  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showTime, setShowTime] = useState<string | null>(null);
  const [showDate, setShowDate] = useState<string | null>(null);
  const [dateTimeMode, setDateTimeMode] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const handleTimeChane = (event: any, selectedValue: any) => {

    if (event.type === 'set') {
      if (dateTimeMode === 'time') {
        const hours = String(selectedValue.getHours()).padStart(2, '0'); // Ensures two digits
        const minutes = String(selectedValue.getMinutes()).padStart(2, '0');

        const time = `${hours}:${minutes}`;
        setShowTime(time);
        setTime(selectedValue);
      } else {

        const day = String(selectedValue.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(selectedValue.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const year = selectedValue.getFullYear(); // Full year (e.g., 2024)

        const formattedDate = `${day}.${month}.${year}`;

        setShowDate(formattedDate);
        setDate(selectedValue)
      }
    }

    setShowTimePicker(false);
  }

  return (
      <>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
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
          <Button mode='outlined' onPress={() => {
            router.push('/city', {})
          }}>City</Button>

          <TouchableWithoutFeedback onPress={() => {
            setDateTimeMode('time')
            setShowTimePicker(true)
          }}>
            <View style={{
              height: 52,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: theme.colors.outline,
              padding: 12,
              justifyContent: 'center'
            }}>

              {
                showTime ? (
                    <Text variant="bodyLarge" style={{color: theme.colors.onBackground}}>{showTime}</Text>

                ): (
                    <Text variant="bodyLarge" style={{color: theme.colors.onSurfaceVariant}}>11:12</Text>
                )
              }
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {
            setDateTimeMode('date')
            setShowTimePicker(true)
          }}>
            <View style={{
              height: 52,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: theme.colors.outline,
              padding: 12,
              justifyContent: 'center'
            }}>
              {
                showDate ? (
                    <Text variant="bodyLarge" style={{color: theme.colors.onBackground}}>{showDate}</Text>

                ): (
                    <Text variant="bodyLarge" style={{color: theme.colors.onSurfaceVariant}}>01.01.20XX</Text>
                )
              }
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
      flex: 1,
      padding: 16
    }
  })
}
