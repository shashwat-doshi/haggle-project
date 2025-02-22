import { Box } from "@/components/gluestack/box";
import { Card } from "@/components/gluestack/card";
import { Heading } from "@/components/gluestack/heading";
import { HStack } from "@/components/gluestack/hstack";
import { Text } from "@/components/gluestack/text";

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
          <Card
            style={{
              backgroundColor: "orange",
              justifyContent: "space-between",
              margin: 5,
            }}
            key={index}
            size="md"
            variant="elevated"
            // bg="$yellow500"
            className=""
            // borderRadius="$md"
            width="45%"
            mb="$4"
          >
            <Heading size="md">{service}</Heading>
          </Card>
        ))}
      </HStack>
    </Box>
  );
}
