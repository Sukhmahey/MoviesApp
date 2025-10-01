import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import utils from "../utils/utils";

const API_KEY = utils.api;
const IMG_BASE = "https://image.tmdb.org/t/p/w185";
export default function TvPage({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("popular");
  const [items, setItems] = useState([
    { label: "popular", value: "popular" },
    { label: "top rated", value: "top_rated" },
    { label: "airing today", value: "airing_today" },
    { label: "on the air", value: "on_the_air" },
  ]);
  const fetchTv = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const url = `https://api.themoviedb.org/3/tv/${type}?api_key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setShows(data?.results || []);
    } catch (e) {
      setErr("Failed to load shows.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [type]);
  useEffect(() => {
    fetchTv();
  }, [fetchTv]);
  const renderItem = ({ item }) => {
    console.log("Dtatata", item);
    const poster = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
            }}
            style={styles.poster}
          />
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.sub}>
              Popularity: {item.popularity?.toFixed?.(3) ?? item.popularity}
            </Text>
            <Text style={styles.sub}>
              Release Date: {item.first_air_date || "—"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ShowPage", { id: item.id, type: "tv" })
              }
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>More Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>TV Shows</Text>
      <View style={{ zIndex: 10, marginBottom: open ? 180 : 12 }}>
        <DropDownPicker
          open={open}
          value={type}
          items={items}
          setOpen={setOpen}
          setValue={setType}
          setItems={setItems}
          placeholder="popular"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          ArrowDownIconComponent={({ style }) => (
            <Text style={[style, { fontSize: 16 }]}>▾</Text>
          )}
          ArrowUpIconComponent={({ style }) => (
            <Text style={[style, { fontSize: 16 }]}>▴</Text>
          )}
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : err ? (
        <View style={styles.center}>
          <Text>{err}</Text>
        </View>
      ) : (
        <FlatList
          data={shows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  dropdown: {
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    height: 42,
  },
  dropdownContainer: {
    borderColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
  },
  poster: {
    width: 90,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  meta: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  sub: {
    fontSize: 12,
    color: "#6B6B6B",
    marginBottom: 2,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#63B1CF",
    borderRadius: 6,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
