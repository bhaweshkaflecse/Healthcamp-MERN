import {
  Box,
  Group,
  Paper,
  Text,
  Flex,
  Image,
  Divider,
  Title,
  Center,
  Button,
} from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";

const MyKycStatus = () => {
  return (
    <Box p={40}>
      <Paper withBorder p={20}>
        <Text fw={500} c="#6092FE">
          Digital Pravhidhi Pvt. Ltd.
        </Text>
        <Group gap={4}>
          <FaCheckCircle size={20} color="green" />
          <Text>KYC is Verified.</Text>
        </Group>
        <Text>Note:Check Your KYC Approval Status</Text>
      </Paper>
      <Title mt={10} size="h2" c="#4CAF50">
        Your KYC is Approved{" "}
      </Title>
      <Paper mt={20} withBorder p={10}>
        <Text mt={10} fw={600}>
          My Details
        </Text>

        <Group gap={0} justify="space-between" mt={10}>
          <Paper w="18%" h={170} p={20} withBorder>
            <Center>
              <Image w={100} src="img/logo.png" />
            </Center>
            <Text>Digital Prabhidhi Pvt Ltd</Text>
          </Paper>

          <Paper p={20} withBorder>
            <Group gap={90}>
              <Flex direction="column" gap={7}>
                <Text fw={600}>Contact Information</Text>
                <Box mt={10}>
                  <Text size="sm">Email</Text>
                  <Text c="#878787" size="sm">
                    digitalpravidhi@gmail.com
                  </Text>
                </Box>
                <Box>
                  <Text size="sm">Contact</Text>
                  <Text c="#878787" size="sm">
                    9812312312
                  </Text>
                </Box>
              </Flex>

              <Divider orientation="vertical" />

              <Flex direction="column">
                <Text fw={600}>Adress Information</Text>
                <Group gap={100}>
                  <Flex direction="column" gap={7}>
                    <Box mt={10}>
                      <Text size="sm">Province/State</Text>
                      <Text c="#878787" size="sm">
                        Bagmati
                      </Text>
                    </Box>
                    <Box>
                      <Text size="sm">Street Address</Text>
                      <Text c="#878787" size="sm">
                        Patan,Krishna Galli
                      </Text>
                    </Box>
                  </Flex>

                  <Flex direction="column" gap={7}>
                    <Box mt={10}>
                      <Text size="sm">Province/State</Text>
                      <Text c="#878787" size="sm">
                        Bagmati
                      </Text>
                    </Box>
                    <Box>
                      <Text size="sm">Street Address</Text>
                      <Text c="#878787" size="sm">
                        Patan,Krishna Galli
                      </Text>
                    </Box>
                  </Flex>
                </Group>
              </Flex>
            </Group>
          </Paper>
        </Group>

        <Paper mt={20} withBorder p={20}>
          <Text fw={600}>Document Details</Text>
          <Group gap={40}>
            <Box>
              <Text mt={10} size="sm">
                Document Type
              </Text>
              <Text c="#878787" size="sm">
                Citizenship
              </Text>
            </Box>
            <Box>
              <Text mt={10} size="sm">
                Document ID
              </Text>
              <Text c="#878787" size="sm">
                28
              </Text>
            </Box>
          </Group>

          <Text mt={10} size="sm">
            Registration Document Image{" "}
          </Text>
          <Image mt={10} w={180} src="img/citizen.png" />
          <Group mt={10} justify="end">
            <Button color="#E8E8E8" c="black">
              {" "}
              Edit Details
            </Button>
            <Button color="#4CAF50"> Dashboard</Button>
          </Group>
        </Paper>
      </Paper>
    </Box>
  );
};

export default MyKycStatus;
