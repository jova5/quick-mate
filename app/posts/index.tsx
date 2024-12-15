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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const handleTimeChane = (event, selectedTime) => {
    if (event.type === 'set') {
      console.log(selectedTime);
      console.log(selectedTime.split('T'));
      console.log(selectedTime.split('T')[1]);
      setTime(selectedTime);
    }
    setShowTimePicker(false);
  }

  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChane = (event, selectedDate) => {
    if (event.type === 'set') {
      console.log(selectedDate);
      setDate(selectedDate)
    }
    setShowDatePicker(false);
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
          setShowTimePicker(true)
        }}>
          <View style={{
            height: 52,
            borderWidth: 1,
            borderRadius: 4,
            padding: 12,
            justifyContent: 'center'
          }}>

            <Text>Time</Text>
          </View>
        </TouchableWithoutFeedback>

        <Button
            mode='outlined'
            onPress={() => {
          setShowTimePicker(true)
        }}>Time</Button>


        <Button mode='outlined' onPress={() => {
          setShowDatePicker(true);
        }}>Date</Button>
      </ScrollView>
        {
            showTimePicker && (
                <DateTimePicker
                    is24Hour={true}
                    timeZoneName={"Europe/Sarajevo"}
                    mode="time"
                    value={time || new Date()}
                    onChange={handleTimeChane}
                    negativeButton={{label: "cancel"}}
                    positiveButton={{label: "ok"}}
                />
            )
        }
        {
            showDatePicker && (
                <DateTimePicker
                    display='calendar'
                    timeZoneName={"Europe/Sarajevo"}
                    mode="date"
                    value={date || new Date()}
                    onChange={handleDateChane}
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
