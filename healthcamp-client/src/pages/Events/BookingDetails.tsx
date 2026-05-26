import { Box, Center, Flex, Paper, Text, Title } from "@mantine/core";
import { BsCalendar2EventFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { RiServerLine } from "react-icons/ri";

const BookingDetails = () => {
  return (
    <Box>
      <Title mb={20} c="#6092fe" size="h4">Your Booking Details</Title>
      <Paper withBorder>
        <Center>
          <Paper radius="sm" mt={40} p={10} w={600} withBorder>
            <Title ta={"center"} c="dimmed" size="h5">
              Booking Status:<span style={{ color: "orange" }}>Pending</span>
            </Title>

            <Box p={10}>
              <Text c="dimmed" ta="center">
                Your booking is under review. Please wait for booking
                confirmation.
              </Text>
              <Text c="dimmed" ta="center">
                {" "}
                You will be notify once your reservation has been approved.
              </Text>
            </Box>
          </Paper>
        </Center>

        <Title my={20} ta="center" size="h5">
          Dental Health Maintenance & Screening Service
        </Title>
        <Text p={20}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
          consectetur soluta in. Ab nulla nisi, illo ipsam, tempore accusantium
          tenetur deserunt reiciendis commodi totam assumenda similique
          excepturi eos soluta reprehenderit perspiciatis, repellendus magnam
          iure quae ex sequi ratione explicabo perferendis! Dolores nesciunt
          quos animi sint quis beatae quasi tempora tenetur.
        </Text>

        <Flex p={10} justify="space-between">
          <Paper withBorder p={10} w={550}>
            <Flex align="center">
              <MdDateRange color="#6092fe" size={35} />
              <Box px={5}>
                <Text>Date</Text>
                <Text my={-4} size="xs" c="dimmed">
                  16 Wed, 2024
                </Text>
              </Box>
            </Flex>
          </Paper>
          <Paper withBorder p={10} w={550}>
            <Flex align="center">
              <RiServerLine color="#6092fe" size={35} />
              <Box px={5}>
                <Text>Service</Text>
                <Text my={-4} size="xs" c="dimmed">
                  Dental Health Maintenance & Screening Package
                </Text>
              </Box>
            </Flex>
          </Paper>
        </Flex>

        <Box p={10}>
          <Paper withBorder mt={-5} p={10}>
            <Flex align="center">
              <IoLocationSharp color="#6092fe" size={35} />
              <Box px={5}>
                <Text>Location</Text>
                <Text my={-4} size="xs" c="dimmed">
                  1Bijyachowk Gausala, Kathmandu near BhimsenGola or <span style={{color:"#6092fe"}}>https://maps.app.goo.gl/PkUYMCp2ajGFBg2H8</span> 
                </Text>
              </Box>
            </Flex>
          </Paper>
          <Paper withBorder my={10} p={10}>
            <Flex align="center">
              <BsCalendar2EventFill color="#6092fe" size={30} />
              <Box px={10}>
                <Text>Event Scheduler</Text>
                <Text my={-4} size="xs" c="dimmed">
                  Himalaya College of Engineering
                </Text>
              </Box>
            </Flex>
          </Paper>
          <Paper withBorder my={10} p={10}>
            <Flex align="center">
              <MdDateRange size={25} />
              <Box px={5}>
                <Text>Participants</Text>
                <Text my={-4} size="xs" c="dimmed">
                  200
                </Text>
              </Box>
            </Flex>
          </Paper>
          <Paper withBorder p={10}>
            <Flex align="center">
              <MdDateRange size={25} />
              <Box px={5}>
                <Text>No. Of Slots Booked</Text>
                <Text my={-4} size="xs" c="dimmed">
                  02
                </Text>
              </Box>
            </Flex>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingDetails;
