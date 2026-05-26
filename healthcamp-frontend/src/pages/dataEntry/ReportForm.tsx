import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Input,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ReportForm = () => {
  const navigate = useNavigate();
  return (
    <>
      <Title p={10} bg="#6092FE" size="h3" c="white" ta="center">
        Participant Report Form
      </Title>
      <Paper withBorder p={20}>
        <Group gap={50} align="top">
          <Group>
            <Image
              src="img/client.png"
              alt="client"
              w={100}
              h={100}
              radius="50%"
            />
            <Box>
              <Text c="#6092FE">ID: 1234567890</Text>
              <Text fw={600}> John Doe</Text>
              <Text c="dimmed" size="sm">
                abiralmanausya9@gmail.com
              </Text>
              <Text c="dimmed" size="sm">
                Digital Pravidhi Pvt Ltd
              </Text>
            </Box>
          </Group>
          <Flex direction="column" gap={10}>
            <Text>
              <span style={{ color: "#6092FE" }}> Event: </span>
              <span style={{ color: "#878787" }}>
                Dental Health And Screening Package
              </span>
            </Text>
            <Text>
              <span style={{ color: "#6092FE" }}>Teamlead: </span>
              <span style={{ color: "#878787" }}>Rupesh Shah</span>
            </Text>
            <Text>
              <span style={{ color: "#6092FE" }}>Unit Cordinator: </span>
              <span style={{ color: "#878787" }}>Ganga Mahato</span>
            </Text>
          </Flex>

          <Box>
            <Text c="dimmed">2024/09/29</Text>
          </Box>
        </Group>
        <Box w={350}>
          <Text fw={600} mt={50}>
            Report Details
          </Text>
          <Group mt={10} justify="space-between">
            <Text>Haemoglobin :</Text>
            <Input />
          </Group>
          <Group mt={10} justify="space-between">
            <Text>RBC :</Text>
            <Input />
          </Group>
          <Group mt={10} justify="space-between">
            <Text>Platelets :</Text>
            <Input />
          </Group>
          <Group mt={10} justify="space-between">
            <Text>WBC :</Text>
            <Input />
          </Group>
          <Group mt={10} justify="space-between">
            <Text>Khoon :</Text>
            <Input />
          </Group>
          <Group justify="center">
            <Button mt={20} onClick={() => navigate("/submit-report")}>
              Submit
            </Button>
          </Group>
        </Box>
      </Paper>
    </>
  );
};

export default ReportForm;
