import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const BASE_URL = "http://192.168.174.1:5000"; // Use your local network IP

const App: React.FC = () => {
  const [emotion, setEmotion] = useState<string>("😐 Neutral");
  const [intensity, setIntensity] = useState<number>(3);
  const [description, setDescription] = useState<string>("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ emotion: string, intensity: number, description: string, insights: string, date: string }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('moodHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };
    loadHistory();
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Input Required", "Please enter a description of your mood.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/mood`, {
        emotion,
        intensity,
        description,
      });
      const newInsight = response.data.insights || "No insights returned.";
      setInsights(newInsight);

      const newEntry = { emotion, intensity, description, insights: newInsight, date: new Date().toISOString() };
      const updatedHistory = [...history, newEntry];
      setHistory(updatedHistory);
      await AsyncStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.message || "Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const emotionLabels = ["😢 Very Sad", "😟 Sad", "😐 Neutral", "😊 Happy", "😁 Very Happy", "😡 Angry"];
  const moodData = {
    labels: history.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        data: history.map(entry => {
          const value = parseFloat(entry.intensity);
          return isNaN(value) ? 0 : value;
        }),
      },
    ],
  };

  console.log("Mood Data:", moodData);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Mood Analyzer</Text>
        <Text style={styles.label}>Select Emotion:</Text>
        <View style={styles.emotionContainer}>
          {emotionLabels.map((label, index) => (
            <TouchableOpacity key={index} style={[styles.emotionButton, emotion === label && styles.selectedEmotionButton]} onPress={() => setEmotion(label)}>
              <Text style={styles.emotionText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Intensity: {intensity}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={intensity}
          onValueChange={setIntensity}
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
        <Text style={styles.chartHeader}>Mood Over Time</Text>
        {history.length > 0 && (
          <LineChart
            data={moodData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#1E90FF",
              backgroundGradientFrom: "#1E90FF",
              backgroundGradientTo: "#87CEFA",
              decimalPlaces: 0, // Ensure no decimal places for mood values
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#1E90FF",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yLabelsOffset={10}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            segments={5}
            formatYLabel={(yValue) => `${parseInt(yValue)}`}
          />
        )}
        <Text style={styles.historyHeader}>Mood History</Text>
        {history.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>Date: {new Date(entry.date).toLocaleDateString()}</Text>
            <Text style={styles.historyText}>Emotion: {entry.emotion}</Text>
            <Text style={styles.historyText}>Intensity: {entry.intensity}</Text>
            <Text style={styles.historyText}>Description: {entry.description}</Text>
            <Text style={styles.historyText}>Insights: {entry.insights}</Text>
          </View>
        ))}
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
    color: "#1E90FF",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
  },
  emotionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  emotionButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  selectedEmotionButton: {
    backgroundColor: "#1E90FF",
  },
  emotionText: {
    fontSize: 18,
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
  },
  insights: {
    marginTop: 20,
    fontSize: 16,
    color: "#333333",
  },
  chartHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#1E90FF",
  },
  historyHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#1E90FF",
  },
  historyItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  historyText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
  },
});

export default App;
