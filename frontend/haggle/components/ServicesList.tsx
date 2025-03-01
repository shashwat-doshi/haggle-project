import { FlatList } from "react-native";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { useEffect, useState, useCallback } from "react";
import { Link, LinkText } from "./ui/link";
import { Card } from "./ui/card";
import * as Location from "expo-location";
import mockServicesListData from "../mocks/mockServicesListData.json";
import { USE_MOCK_DATA } from "@env";
import { StyleSheet } from "react-native";

export const ServicesList = ({ serviceType }: { serviceType: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const shouldUseMockData = USE_MOCK_DATA === "true";

  console.log("location latitude", location?.coords.latitude);
  console.log("location longitude", location?.coords.longitude);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (err) {
        console.error("Error fetching current location:", err);
        setErrorMsg("Could not fetch location");
      }
    };

    getCurrentLocation();
  }, []);

  // Fetch services when location is available
  const fetchData = useCallback(async () => {
    if (!location?.coords) return;

    setLoading(true);
    let result;

    try {
      if (!shouldUseMockData) {
        const response = await fetch(
          "http://localhost:3000/getPlacesByLocation",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              service: serviceType,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        result = await response.json();
      } else {
        console.log("Using mock data for services");
        result = mockServicesListData;
      }
      setData(result.data.places);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not load services");
    } finally {
      setLoading(false);
    }
  }, [location, serviceType]);

  useEffect(() => {
    if (location) {
      fetchData();
    }
  }, [fetchData, location]);

  // Loading & Error States
  if (loading) return <Text>Loading services...</Text>;
  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p="md" bg="coolGray100">
      <Heading size="xl" mb="md" color="primary700">
        Available Services
      </Heading>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2} // Use 2 columns for grid layout
        columnWrapperStyle={styles.columnWrapper} // Add space between columns
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            p="lg"
            borderRadius="xl"
            shadow="3"
            borderWidth={1}
            borderColor="yellow"
            mb="md"
          >
            <VStack space="md">
              <Text size="lg" bold style={styles.cardTitle}>
                {item.displayName.text}
              </Text>

              {item.websiteUri && (
                <Link href={item.websiteUri}>
                  <LinkText color="primary600" underline>
                    Visit Website
                  </LinkText>
                </Link>
              )}

              <Text size="sm" style={{ color: "white" }}>
                {item.formattedAddress}
              </Text>
            </VStack>
          </Card>
        )}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between", // Spread items evenly across the row
    marginBottom: 10, // Add space between rows
  },
  card: {
    backgroundColor: "orange",
    width: "48%", // Width of each card
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    borderColor: "yellow", // Border color
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "light",
  },
});
