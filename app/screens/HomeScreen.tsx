import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Animated,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import Header from "../../components/Header";
import AssignedElders from "../../components/AssignedElders";
import { ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");

const statsData = [
  { id: "1", image: require("../../assets/images/tasks.png") },
  { id: "2", image: require("../../assets/images/care.png") },
  { id: "3", image: require("../../assets/images/vitals.png") },
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0]?.index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      >
        <>
          {/* Header Section */}
          <Header />

          {/* Animated Horizontal Scrolling Images */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={statsData}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onViewableItemsChanged={viewableItemsChanged}
              viewabilityConfig={viewConfig}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image source={item.image} style={styles.image} />
                </View>
              )}
            />
          </View>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {statsData.map((_, index) => (
              <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
            ))}
          </View>

          {/* Scrollable Assigned Elders List */}
            <AssignedElders />
        </>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  carouselContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  imageContainer: {
    width: width * 0.8,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
  },
  image: {
    width: 400,
    height: 160,
    resizeMode: "contain",
  },
  pagination: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#e57373",
    width: 12,
    height: 12,
  },
});

