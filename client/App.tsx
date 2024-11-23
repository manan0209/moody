import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";

const BASE_URL = "http://192.168.174.1:5000"; // Use your local network IP

const App: React.FC = () => {
  const [mood, setMood] = useState<number>(3);
  const [description, setDescription] = useState<string>("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleReset = () => {
    setMood(3);
    setDescription("");
    setInsights(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Mood</Text>

      <Text style={styles.label}>Mood Level: {mood}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={mood}
        onValueChange={setMood}
      />

      <TextInput
        style={styles.input}
        placeholder="How are you feeling today?"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Clear" onPress={handleReset} color="#555" />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {insights && <Text style={styles.result}>Insights: {insights}</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  error: {
    marginTop: 20,
    fontSize: 14,
    color: "red",
  },
});

export default App;
