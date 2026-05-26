import {
  Box,
  Button,
  Checkbox,
  Flex,
  Paper,
  Text,
} from "@mantine/core";
import { IoIosClipboard } from "react-icons/io";
import { IoCalendar, IoLocation } from "react-icons/io5";
import { MdBook } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

const EventStarted = () => {
  return (
    <Box>
      <Text my={20} size="xl" c="#6092FE">
        Events
      </Text>

      <Paper p={40} withBorder>
        <Text fw="bold">Digital Pravidhi Pvt. Ltd</Text>
        <Text c="dimmed">
          Digital Pravidhi has booked an event date for Dental Health
          Maintenance & Screening Service
        </Text>

        <Paper my={20} w={600} p={30} withBorder>
          <Text fw="bold">Event Status</Text>
          <Text c="dimmed">
            Notify Business Head and Team Lead about the status of the event.{" "}
          </Text>

          <Box>
            <Flex my={20} gap="md" align="center">
              <Paper bg="blue" w={20} h={20} radius="xl"></Paper>
              <Box>
                <Text>Event Started</Text>
                <Text c="dimmed" size="xs">
                  09:30 - Event has been started
                </Text>
              </Box>
              <Checkbox checked />
            </Flex>

            <Flex gap="md" align="center">
              <Paper bg="blue" w={20} h={20} radius="xl"></Paper>
              <Text>Event Completed</Text>
              <Checkbox />
            </Flex>
          </Box>
        </Paper>

        <Text c="blue">Event Details</Text>

        <Paper withBorder p={30} my={20}>
          <Text my={20} fw="bold" ta="center">
            Dental Health Maintenance & Screening Service
          </Text>

          <Text c="dimmed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
            labore assumenda. In qui eius iusto, praesentium a architecto
            explicabo laboriosam voluptates velit voluptatem sint minima sed
            nesciunt suscipit ad neque.
          </Text>

          <Box my={20}>
            <Flex gap="md" justify="space-between">
              <Flex p={10} gap="md" w={500} align="center" bg="#E5ECFA">
                <IoCalendar size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Date</Text>
                  <Text c="dimmed">30th July, 2024</Text>
                </Box>
              </Flex>

              <Flex p={10} gap="md" w={500} align="center" bg="#E5ECFA">
                <IoIosClipboard size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Service</Text>
                  <Text c="dimmed">
                    Dental Health Maintenance & Screening Package
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <IoLocation size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">Location</Text>
                <Text c="dimmed">
                  Bijyachowk Gausala, Kathmandu near BhimsenGola{" "}
                  <b style={{ color: "black" }}>or</b>{" "}
                  <span style={{ color: "#6092FE" }}>
                    https://maps.app.goo.gl/PkUYMCp2ajGFBg2H8
                  </span>
                </Text>
              </Box>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <RiCalendarScheduleFill size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">Event Scheduler</Text>
                <Text c="dimmed">Himalaya College of Engineering</Text>
              </Box>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              p={10}
              my={20}
              bg="#E5ECFA"
            >
              <Flex gap="md" align="center">
                <IoIosClipboard size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Service</Text>
                  <Text c="dimmed">
                    Dental Health Maintenance & Screening Package
                  </Text>
                </Box>
              </Flex>

              <Button variant="default">View Details</Button>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <MdBook size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">No. Of Slots Booked</Text>
                <Text c="dimmed">02</Text>
              </Box>
            </Flex>
          </Box>
        </Paper>
      </Paper>
    </Box>
  );
};

export default EventStarted;
