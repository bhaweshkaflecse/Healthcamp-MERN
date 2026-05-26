import { Center, Image, Paper, Text, Title } from "@mantine/core";

const RepotSubmission = () => {
  return (
    <Paper p={20} withBorder>
      <Title size="h3" c="#6092FE">
        Report Details{" "}
      </Title>
      <Center>
        <Image src={"img/client.png"} w={100} h={100} radius="50%" />
      </Center>
      <Text mt={10} fw={500} c="#6092FE" ta="center">
        Client ID : 12365
      </Text>
      <Text mt={5} fw={500} ta="center">
        Hello
      </Text>
      <Text mt={5} fw={500} size="sm" ta="center" c="dimmed">
        abiral@gmail.com
      </Text>
      <Text mt={5} fw={500} size="sm" ta="center" c="dimmed">
        Digital Prabhidhi
      </Text>
    </Paper>
  );
};

export default RepotSubmission;
