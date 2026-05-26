import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";

const Purchase = () => {
  return (
    <Box>
      <Box px={180}>
        <Paper p={40} withBorder radius="xl">
          <Flex gap={30} direction="column" align="center" justify="center">
            <MdOutlineDone
              color="white"
              size={30}
              style={{
                background: "green",
                width: "60px",
                height: "60px",
                borderRadius: "40px",
              }}
            />
            <Title>Thank you For your Purchase</Title>
            <Text mb={20} w={420} c="dimmed" ta="center">
              Your transaction has been successfully completed and we've sent a
              receipt to your email.
            </Text>
          </Flex>

          <Paper radius="lg" withBorder p={20}>
            <Text ta="center">Total Payment</Text>
            <Text size="xl" fw="bold" ta="center">
              Rs. 20,000
            </Text>

            <Paper p={20} c="dimmed" style={{ border: "dotted" }} withBorder>
              <Box p={20}>
                <Flex justify="space-between">
                  <Text>Payment ID</Text>
                  <Text>Payment Time</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>12112</Text>
                  <Text>25th feb, 2024</Text>
                </Flex>
              </Box>

              <Divider />
              <Box p={20}>
                <Flex justify="space-between">
                  <Text>Payment Method</Text>
                  <Text>Sender</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Esewa</Text>
                  <Text>Digital Pravidhi</Text>
                </Flex>
              </Box>

              <Divider />
              <Center my={40}>
                <Button leftSection={<AiOutlineDownload />} variant="default">
                  Get Receipt PDF
                </Button>
              </Center>
            </Paper>
          </Paper>

          <Flex justify="center" gap="md" my={20}>
            <Button variant="default">View your payment Status</Button>
            <Button bg="green">Dashboard</Button>
          </Flex>
        </Paper>
      </Box>
    </Box>
  );
};

export default Purchase;
