import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Input,
  Pagination,
  Paper,
  ScrollArea,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { CiFilter, CiSearch } from "react-icons/ci";
import { IoIosDownload } from "react-icons/io";

const datas = [
  {
    sn: 1,
    contactoparti: 12.011,
    participantId: "C",
    contact: "Carbon",
    address: "Anamnagar, Kathmandu",
  },
  {
    sn: 2,
    contactoparti: 14.007,
    participantId: "N",
    contact: "Nitrogen",
    address: "Dhapakhel, Lalitpur",
  },
  {
    sn: 3,
    contactoparti: 88.906,
    participantId: "Y",
    contact: "Yttrium",
    address: "Buddhanagar, Kathmandu",
  },
  {
    sn: 4,
    contactoparti: 137.33,
    participantId: "Ba",
    contact: "Barium",
    address: "Nepalgunj, Banke",
  },
  {
    sn: 5,
    contactoparti: 140.12,
    participantId: "Ce",
    contact: "Cerium",
    address: "Maitidevi, Kathmandu",
  },
];

const ClientApprovalstatus = () => {
  const rows = datas.map((data) => (
    <Table.Tr key={data.contact}>
      <Table.Td>{data.sn}</Table.Td>
      <Table.Td>{data.contact}</Table.Td>
      <Table.Td>{data.participantId}</Table.Td>
      <Table.Td>{data.contactoparti}</Table.Td>
      <Table.Td>{data.address}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Box>
        <Group justify="space-between">
          <Title size="h2" c="#6092FE">
            Client Approval
          </Title>

          {/* <Button>Accept/Reject</Button> */}
          <Group>
            <Button bg="green">Accept</Button>
            <Button bg="red">Reject</Button>
          </Group>
        </Group>

        <Paper mt={10} withBorder>
          <Title size="h3" fw={400} p={20}>
            Client Details
          </Title>
          <Grid mx={20} p={5}>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <Paper withBorder>
                <Flex
                  h={166}
                  direction="column"
                  align="center"
                  justify="center"
                >
                  <Image
                    // h={50}
                    w={100}
                    fit="contain"
                    src="https://s3-alpha-sig.figma.com/img/f222/1c52/a4ad115a23a857313f8f73f93b4b0c7a?Expires=1714348800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BP2RonBzb421BW2sFpuEvn6ZLbPah2QA4nJFIFfOmwpSfDpdvhDa7DKXFQQQQKiyynOjF4uu~9r-eyvkyjyWy9VTdQwZXVMNV3BjFM1T5-eTwbPIU4N3WaTcltvwSmukLMxLDqovPXMpgk5jsDs6XkI5bkUNajIFtuCmt39szybYOugz10Vfn9Y2YBW0VN732iQoHxPQjSzrTu8BH3iQ9vn9eifcRxRTg6C~8lrPZgp1SQ~KMvGDNsaafbonqsNdolvgGFGH~3kT4lXWfu~xmGepYVYrL2-IpZWePTUcrOtE5Xh5aWWM2~0SkHWKy25UrcIq6V9Eg0FLurSeFWj2yw__"
                  />
                  <Text>Digital Pravidhi Pvt Ltd</Text>
                </Flex>

                <Flex p={16} justify="space-between">
                  <Box>
                    <Text>Client ID</Text>
                    <Text c="dimmed">1212212</Text>
                  </Box>

                  <Box>
                    <Text>Approved By</Text>
                    <Text c="dimmed">Aayush Poudel</Text>
                  </Box>

                  <Box>
                    <Text>Event Status</Text>
                    <Text c="dimmed">Pending</Text>
                  </Box>
                </Flex>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <Paper p={16} withBorder>
                <Text fw={500} size="lg">
                  Contact Information
                </Text>
                <Space h="sm" />
                <Flex justify="space-between">
                  <Box>
                    <Text>Email</Text>
                    <Text c="dimmed">aayushpoudel59@gmail.com</Text>
                    <Space h="sm" />
                  </Box>

                  <Box>
                    <Text>Phone Number</Text>
                    <Text c="dimmed">9843249388</Text>
                  </Box>
                </Flex>

                <Text fw={500} size="lg">
                  Event Venue Information
                </Text>
                <Space h="sm" />

                <Flex justify="space-between">
                  <Box>
                    <Text>Location</Text>
                    <Text c="dimmed">Bagmati, Lalitpur, Patan, </Text>
                    <Text c="dimmed"> Krishna Galli</Text>
                  </Box>

                  <Box>
                    <Text>Event Date</Text>
                    <Text>2080/12/24</Text>
                  </Box>
                </Flex>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper withBorder>
                <Group miw={400} p={10} justify="space-between">
                  <Title size="h2">Participants</Title>
                  <Group justify="flex-end">
                    <Input
                      radius={10}
                      placeholder="Search by Name or Email"
                      leftSection={<CiSearch size={16} />}
                    />
                    <Button
                      variant="default"
                      radius={10}
                      leftSection={<CiFilter size={16} />}
                    >
                      Filter
                    </Button>
                    <Paper px={8} py={4} radius={5} bg="blue">
                      <IoIosDownload color="white" size="25" />
                    </Paper>
                  </Group>
                </Group>
                <ScrollArea>
                  <Table mt={20} horizontalSpacing="xl" withRowBorders={false}>
                    <Table.Thead>
                      <Table.Tr bg="#F3F6F9">
                        <Table.Th>S.N.</Table.Th>
                        <Table.Th>Name of Participants</Table.Th>
                        <Table.Th>Participant ID</Table.Th>
                        <Table.Th>Contact</Table.Th>
                        <Table.Th>Address</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody c="dimmed">{rows}</Table.Tbody>
                  </Table>
                </ScrollArea>

                <Divider my="lg" />
                <Group p={10} justify="space-between">
                  <Text> Showing 1-5 of 22 results</Text>
                  <Pagination total={3} />
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ClientApprovalstatus;
