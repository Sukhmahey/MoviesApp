import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import utils from "../utils/utils";
const TMDB_IMG = "https://image.tmdb.org/t/p/w185";
export default function SearchPage({ navigation }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  // Dropdown state
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Multi", value: "multi" },
    { label: "Movie", value: "movie" },
    { label: "TV", value: "tv" },
  ]);
  // Validation errors
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errs = {};
    if (!query.trim()) {
      errs.query = "Movie/TV show name is required";
    }
    if (!type) {
      errs.type = "Search type is required";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const search = async () => {
    if (!validateForm()) {
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const url = `https://api.themoviedb.org/3/search/${type}?api_key=${
        utils.api
      }&query=${encodeURIComponent(query.trim())}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data?.results || []);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }) => {
    const title = item.title || item.name || "(Untitled)";
    const poster = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null;
    const popularity =
      typeof item.popularity === "number"
        ? item.popularity.toLocaleString()
        : "-";
    const releaseDate = item.release_date || item.first_air_date || "-";
    const detailType = item.media_type || type;
    return (
      <View style={styles.card}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterTxt}>No Image</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.meta}>Popularity: {popularity}</Text>
          <Text style={styles.meta}>Release Date: {releaseDate}</Text>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() =>
              navigation.navigate("ShowPage", {
                id: item.id,
                type: detailType,
              })
            }
          >
            <Text style={styles.detailsBtnTxt}>More Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        {/* Query field */}
        <Text>Search Movie/TV Show Name*</Text>
        <View
          style={[
            styles.inputWrap,
            formErrors.query ? styles.errorBorder : null,
          ]}
        >
          <TextInput
            placeholder="i.e. James Bond, CSI"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={search}
            clearButtonMode="while-editing"
          />
        </View>
        {formErrors.query && (
          <Text style={styles.errorText}>{formErrors.query}</Text>
        )}
        {/* Type field */}
        <Text>Choose Search Type*</Text>
        <DropDownPicker
          open={open}
          value={type}
          items={items}
          setOpen={setOpen}
          setValue={setType}
          setItems={setItems}
          style={[styles.dropdown, formErrors.type ? styles.errorBorder : null]}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholder="Select a type"
        />
        {formErrors.type && (
          <Text style={styles.errorText}>{formErrors.type}</Text>
        )}
        {/* Button */}
        <TouchableOpacity style={styles.searchBtn} onPress={search}>
          <Text style={styles.searchBtnTxt}>Search</Text>
        </TouchableOpacity>
      </View>
      {/* Results */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.empty}>{error}</Text>
        ) : !hasSearched ? (
          <Text style={styles.empty}>Please initiate a search</Text>
        ) : results.length === 0 ? (
          <Text style={styles.empty}>No results found.</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(it) => `${it.media_type || type}-${it.id}`}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F5F7" },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginBottom: 6,
  },
  input: { fontSize: 16 },
  dropdown: {
    borderColor: "#E5E7EB",
    marginBottom: 6,
  },
  dropdownContainer: {
    borderColor: "#E5E7EB",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 6,
  },
  searchBtn: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#43B1CF",
    borderRadius: 8,
    marginTop: 6,
  },
  searchBtnTxt: { color: "white", fontWeight: "600" },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#6B7280",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  poster: { width: 90, height: 135, backgroundColor: "#F1F5F9" },
  noPoster: { alignItems: "center", justifyContent: "center" },
  noPosterTxt: { color: "#94A3B8", fontSize: 12 },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  meta: { color: "#475569", marginBottom: 2 },
  detailsBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#43B1CF",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  detailsBtnTxt: { color: "white", fontWeight: "600" },
});
