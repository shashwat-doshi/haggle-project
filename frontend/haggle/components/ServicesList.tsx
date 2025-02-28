import { FlatList } from "react-native";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { useEffect, useState } from "react";
import { Link, LinkText } from "./ui/link";

export const ServicesList = ({ serviceType }: any) => {
  console.log("serviceType", serviceType);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "POST",
          //   mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: 40.7128, // TODO: get lat and long through geolocation on the FE!!
            longitude: -74.006, // TODO: get lat and long through geolocation on the FE!!
            service: serviceType,
          }),
        };
        const response = await fetch(
          "http://localhost:3000/getPlacesByLocation",
          options,
        );
        if (response && response.ok) {
          const data = await response.json();
          console.log("data", data);
          setData(data.data.places); // Set the fetched data to state
        }
      } catch (err) {
        setError("Error fetching data"); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false after data is fetched or an error occurs
      }
    };

    fetchData();
  }, []);

  // Loading or error state handling
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  console.log("data is:", data);
  return (
    <Box>
      <Heading size="xl">Inbox</Heading>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Box>
            <HStack space="md" style={{ justifyContent: "space-between" }}>
              {/* <Avatar size="md">
              <AvatarImage source={{ uri: item.avatarUrl }} />
            </Avatar> */}
              <VStack>
                <Text
                  size="md"
                  bold
                  // color="$coolGray800"
                  // fontWeight="$bold"
                  // $dark-color="$warmGray100"
                >
                  {item.displayName.text}
                </Text>
                <Link href="item.websiteUri">
                  <LinkText>Website Link</LinkText>
                </Link>
              </VStack>
              <Text
                size="xs"
                style={{
                  alignSelf: "flex-start",
                }}
                $dark-color="$warmGray100"
              >
                {item.formattedAddress}
              </Text>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};
