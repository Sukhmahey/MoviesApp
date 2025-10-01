import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import utils from "../utils/utils";

export default function MoviesPage({ navigation }) {
  const [type, setType] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Now Playing", value: "now_playing" },
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "top_rated" },
    { label: "Upcoming", value: "upcoming" },
  ]);

  useEffect(() => {
    setMovies([]); // reset when type changes
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [type]);

  const fetchMovies = async (pageNumber = 1, reset = false) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const API_KEY = utils.api;
    const url = `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&page=${pageNumber}`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setMovies((prev) =>
          reset ? data.results : [...prev, ...data.results]
        );
        setPage(pageNumber + 1);
        if (pageNumber >= data.total_pages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Popularity: {item.popularity}</Text>
        <Text>Release Date: {item.release_date}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("ShowPage", { id: item.id, type: "movie" })
          }
        >
          <Text style={styles.buttonText}>More Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={type}
        items={items}
        setOpen={setOpen}
        setValue={setType}
        setItems={setItems}
        style={styles.dropdown}
        containerStyle={{ marginBottom: 10 }}
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchMovies(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
