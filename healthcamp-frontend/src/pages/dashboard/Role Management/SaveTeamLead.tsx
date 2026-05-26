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
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SaveTeamLead = () => {
    const navigate = useNavigate()
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Paper mt={10} p={10} withBorder>
        <Flex mt={10} direction="column" align="center">
          <FaCheckCircle size={35} color="green" />
          <Text mt={10}>Team Lead has been assigned successfully</Text>
        </Flex>
        <Center>
          <Paper mt={20} p={20} w={400} withBorder>
            <Flex direction="column">
              <Flex direction="column" align="center">
                <Image radius="50%" w={50} src="img/teamlead.jpg" />
                <Text>Razin Ghising</Text>
                <Text size="sm" c="dimmed">
                  Team Lead
                </Text>
              </Flex>
              <Flex mt={10} justify="space-between">
                <Text>Full Name</Text>
                <Text>Razin Ghising</Text>
              </Flex>
              <Flex mt={10} justify="space-between">
                <Text>Email Account</Text>
                <Text>razin@gmail.com</Text>
              </Flex>
              <Flex mt={10} justify="space-between">
                <Text>Phone Number</Text>
                <Text>+977-9806473221</Text>
              </Flex>
              <Flex mt={10} justify="space-between">
                <Text>Position</Text>
                <Text>CEO</Text>
              </Flex>
              <Group mt={20} justify="center">
                <Button onClick={()=>navigate('/editstaff')} leftSection={<AiFillEdit size={20} />}>Edit</Button>
                <Button fw={1000} bg="whitesmoke" variant="default">
                  Dashboard
                </Button>
              </Group>
            </Flex>
          </Paper>
        </Center>
      </Paper>
    </>
  );
};

export default SaveTeamLead;
