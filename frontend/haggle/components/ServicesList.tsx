import { FlatList } from "react-native";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { useEffect, useState, useCallback } from "react";
import { Link, LinkText } from "./ui/link";
import * as Location from "expo-location";

export const ServicesList = ({ serviceType }: { serviceType: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  console.log("location latitude", location?.coords.latitude);
  console.log("location longitude", location?.coords.longitude);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();

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
    try {
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

      const result = await response.json();

      // console.log("Fetched Data:", result);
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
    <Box>
      <Heading size="xl">Available Services</Heading>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Box>
            <HStack space="md" style={{ justifyContent: "space-between" }}>
              <VStack>
                <Text size="md" bold>
                  {item.displayName.text}
                </Text>
                {item.websiteUri && (
                  <Link href={item.websiteUri}>
                    <LinkText>Website Link</LinkText>
                  </Link>
                )}
              </VStack>
              <Text size="xs" style={{ alignSelf: "flex-start" }}>
                {item.formattedAddress}
              </Text>
            </HStack>
          </Box>
        )}
      />
    </Box>
  );
};
