import { Box, Button, Center, Text, Title } from "@mantine/core";
// import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
 

  return (
    <Center style={{ flexDirection: "column", height: "80vh" }}>
      <Box maw={500}>
        {/* <Lottie options={unauthorized} /> */}
      </Box>
      <Title order={3}>Oops!</Title>

      <Text style={{ color: "red", textAlign: "center" }} fw={"bold"} fz={32}>
        You are not authorized to view this page
      </Text>
      <Button size="md" onClick={() => navigate("/dashboard")} mt={16}>
        Go to Dashboard
      </Button>
    </Center>
  );
};

export default Unauthorized;
