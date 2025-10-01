import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import utils from "../utils/utils";

export default function ShowPage({ route, navigation }) {
  const { id, type } = route.params;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const API_KEY = utils.api;
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!details) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{details.title || details.name}</Text>

      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
        }}
        style={styles.poster}
        resizeMode="contain"
      />

      <Text style={styles.overview}>{details.overview}</Text>

      <Text style={styles.meta}>
        Popularity: {details.popularity} | Release Date:{" "}
        {details.release_date || details.first_air_date}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
  },
  backText: {
    alignSelf: "flex-start",
    color: "#3B82F6",
    marginBottom: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  poster: {
    width: 250,
    height: 350,
    borderRadius: 8,
    marginBottom: 15,
  },
  overview: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#444",
  },
  meta: {
    fontSize: 14,
    color: "#555",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
