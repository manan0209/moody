import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert, SafeAreaView, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const BASE_URL = "http://192.168.174.1:5000"; // Use your local network IP

const App: React.FC = () => {
  const [mood, setMood] = useState<number>(3);
  const [description, setDescription] = useState<string>("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Input Required", "Please enter a description of your mood.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/mood`, {
        mood,
        description,
      });
      setInsights(response.data.insights || "No insights returned.");
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.message || "Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Mood Analyzer</Text>
        <Text style={styles.label}>Mood Level: {mood}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={mood}
          onValueChange={setMood}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#000000"
        />
        <TextInput
          style={styles.input}
          placeholder="Describe your mood..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#1E90FF" />
        </View>
        {loading && <ActivityIndicator size="large" color="#1E90FF" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {insights && <Text style={styles.insights}>{insights}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 40, // Add margin to the top to avoid touching the navbar
    color: "#333333",
    fontFamily: 'Poppins_600SemiBold',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
    fontFamily: 'Poppins_400Regular',
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontFamily: 'Poppins_400Regular',
  },
  insights: {
    marginTop: 20,
    fontSize: 16,
    color: "#333333",
    fontFamily: 'Poppins_400Regular',
  },
});

export default App;
