import { ServicesList } from "@/components/ServicesList";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function ServicePage() {
  const { service } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    if (service && !Array.isArray(service)) {
      navigation.setOptions({
        title: service.charAt(0).toUpperCase() + service.slice(1), // Set title dynamically
        headerBackTitle: "Home", // Change back button text
      });
    }
  }, [service, navigation]);

  console.log("service", service);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ServicesList serviceType={service} />
    </View>
  );
}
