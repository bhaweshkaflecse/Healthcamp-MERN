import { Button, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SaveRole = () => {
  const navigate = useNavigate();
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper h={"40vh"} mt={10} p={20} withBorder>
        <Flex direction="column" align="center">
          <FaCheckCircle color="green" size={30} />
          <Text mt={10}>Role Successfully updated for Razin Ghising</Text>
          <Group mt={40}>
            <Button bg="primary.1" leftSection={<FaEdit size={20} />}>
              Make Changes 
            </Button>
            <Button
              bg="whitesmoke"
              onClick={() => navigate("/role")}
              variant="default"
            >
              Back to Services
            </Button>
          </Group>
        </Flex>
      </Paper>
    </>
  );
};

export default SaveRole;
