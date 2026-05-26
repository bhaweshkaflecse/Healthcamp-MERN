import {
  Button,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ChangeRole = () => {
    const navigate = useNavigate();
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper p={20} withBorder mt={10}>
        <Group justify="center">
          <Image radius="50%" w={70} src="img/teamlead.jpg" />
          <Text fw={500}>Change role for Razin Ghising</Text>
        </Group>
        <Center>
          <Paper w={300} mt={20} lh={2.0}>
            <Text fw={500}>Select Roles</Text>
            <Flex justify="space-between">
              <p>Team lead</p>
              <Switch defaultChecked />
            </Flex>
            <Flex justify="space-between">
              <p>Unit Cordinator</p>
              <Switch />
            </Flex>
            <Flex justify="space-between">
              <p>Data Entry</p>
              <Switch />
            </Flex>
            <Flex justify="space-between">
              <p>Finance</p>
              <Switch />
            </Flex>
            <Flex justify="space-between">
              <p>Sales</p>
              <Switch />
            </Flex>
            <Flex justify="space-between">
              <p>Call Center</p>
              <Switch />
            </Flex>
            <Flex justify="space-between">
              <p>It Team</p>
              <Switch />
            </Flex>
          </Paper>
        </Center>
        <Group justify="center" mt={20}>
          <Button variant="default">Cancel</Button>
          <Button onClick={()=>navigate('/saverole')} bg="green">Save</Button>
        </Group>
      </Paper>
    </>
  );
};

export default ChangeRole;
