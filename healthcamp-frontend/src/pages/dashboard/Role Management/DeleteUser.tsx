import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeleteUser = () => {
    const navigate = useNavigate();
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper h='40vh' withBorder p={20} mt={10}>
        <Flex gap={20} direction='column' align='center'>

      <FaCheckCircle  color="green" size={30} />
      <Text >Razin Ghising has been removed from your staffs.</Text>
      <Button onClick={()=>navigate('/role')} mt={20} variant="default" bg="whitesmoke">
        Dashboard
      </Button>
        </Flex>
      </Paper>
    </>
  );
};

export default DeleteUser;
