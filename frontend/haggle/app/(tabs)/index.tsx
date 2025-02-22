import { Box } from "@/components/gluestack/box";
import { Card } from "@/components/gluestack/card";
import { Heading } from "@/components/gluestack/heading";
import { HStack } from "@/components/gluestack/hstack";
import { Pressable } from "@/components/gluestack/pressable";
import { Text } from "@/components/gluestack/text";
import { useRouter } from "expo-router";

export const services = [
  "Plumbing",
  "Electrician",
  "Moving Services",
  "Laundry Services",
  "Mechanic",
  "Salons",
  "Lawyer Services",
];

export default function Home() {
  const router = useRouter();

  return (
    <Box style={{ flex: 1, padding: 4 }}>
      <HStack
        style={{
          flex: 1,
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        {services.map((service, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(`/service/${service.toLowerCase()}`)}
          >
            <Card
              style={{
                backgroundColor: "orange",
                justifyContent: "center",
                alignItems: "center",
                margin: 5,
                padding: 10,
              }}
              size="md"
              variant="elevated"
              mb="$4"
            >
              <Heading size="md">{service}</Heading>
            </Card>
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
}
