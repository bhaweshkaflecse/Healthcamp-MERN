import {
  Button,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

const Package = () => {
  return (
    <>
      <Title size="h2" c="primary.0">
        Package Management
      </Title>
      <Paper p={20} mt={10} withBorder>
        <Center>
          <FaCheckCircle size={30} color="green" />
        </Center>
        <Text ta="center" mt={10} c="dimmed">
          Package has been created successfully{" "}
        </Text>
        <Title mt={20} ta="center" size="h3" c="primary.1">
          Primitive Health Screening Package Details
        </Title>
        <Flex gap={100} mt={40}>
          <Image w={400} radius={30} src="img/package.jpg" />
          <Text c="dimmed" w="30%">
            Involves a thorough examination of your teeth, gums, and mouth to
            detect any potential issues, such as cavities, gum disease, or oral
            cancer.Involves a thorough examination of your teeth, gums, and
            mouth to detect any potential issues..Involves a thorough
            examination of your teeth, gums, and mouth to detect any potential
            issues.
          </Text>
        </Flex>
        <Title mt={20} c="dimmed" size="h4">
          List of Services Included(4)
        </Title>
        <Group mt={10}>
          <FaCheckCircle size={20} color="blue" />
          <Text>Anemia Screening Along Nutrition Councelling</Text>
        </Group>
        <Group mt={5}>
          <FaCheckCircle size={20} color="blue" />
          <Text>Dental Screening Along Oral Hygenic Councelling</Text>
        </Group>
        <Group mt={5}>
          <FaCheckCircle size={20} color="blue" />
          <Text>Opthamlatic Screening Along Eyecare Councelling</Text>
        </Group>
        <Title mt={20} c="dimmed" size="h4">
          Price Range For The Package{" "}
        </Title>
        <Paper mt={10} p={20} withBorder>
          <Text>Price Summary per Participants </Text>
          <Group mt={20}>
            <Text c="dimmed">Price: </Text>
            <Text c="dimmed"> From </Text>
            <Text>0</Text>
            <Text c="dimmed">To </Text>
            <Text>100</Text>
            <Text c="dimmed">Participants</Text>
          </Group>
          <Text mt={10} fw={600}>
            Rs.500
          </Text>
          <Group mt={20}>
            <Text c="dimmed">Price: </Text>
            <Text c="dimmed"> From </Text>
            <Text>100</Text>
            <Text c="dimmed">To </Text>
            <Text>200</Text>
            <Text c="dimmed">Participants</Text>
          </Group>
          <Text mt={10} fw={600}>
            Rs.400
          </Text>
        </Paper>
        <Group mt={20} justify="center">
          <Button leftSection={<CiEdit size={20} />} bg="btncolor.1">
            Make Changes
          </Button>
          <Button variant="default">Dashboard</Button>
        </Group>
      </Paper>
    </>
  );
};

export default Package;
