import {
  Box,
  Button,
  Flex,
  Paper,
  Text,
  Title,
  Badge,
  ScrollArea,
  Center,
  Loader,
} from "@mantine/core";
import { BiSolidReport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { clientForward } from "../../api/event";
import { useQuery } from "@tanstack/react-query";

const CompletedEvents = () => {
  const navigate = useNavigate();

  const getAllReports = async () => {
    const resp = await axiosPrivateInstance.get(`${clientForward}`);
    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-reports"],
    queryFn: getAllReports,
  });


  if(isLoading){
    return (
      <Center h="50vh">
      <Box ta="center">
        <Loader color="blue" />
      </Box>
    </Center>
    )
  }
  return (
    <Box p="lg">
      <Title size={22} fw="bold" c="blue" mb="sm">
         Completed Events Report
      </Title>


      <Flex direction="column" gap="md">
        {data?.booking?.map((reports: any) => (
          <Paper
            key={reports.id}
            shadow="sm"
            radius="md"
            p="lg"
            withBorder
            style={{
              transition: '0.3s ease',
              ':hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Flex direction="column" gap="sm">
              {/* Service Name and Button */}
              <Flex justify="space-between" align="center" wrap="wrap">
                <Box>
                  <Text size="sm" c="dimmed">
                    Service Name
                  </Text>
                  <Text fw={600} size="lg" c="dark">
                    {reports?.serviceCalendar?.service?.name}
                  </Text>
                </Box>

                <Button
                  onClick={() =>
                    navigate("/view-report", {
                      state: reports?.id,
                    })
                  }
                  size="sm"
                  rightSection={<BiSolidReport />}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  radius="md"
                >
                  View Report
                </Button>
              </Flex>

              {/* Date Scroll Area */}
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb={4}>
                  Event Dates
                </Text>
                <ScrollArea type="never" offsetScrollbars>
                  <Flex gap="xs" wrap="nowrap">
                    {reports.bookingDates?.map((item: any, index: number) => (
                      <Badge
                        key={item.id ?? index}
                        color="blue"
                        variant="light"
                        radius="md"
                        size="lg"
                        style={{
                          minWidth: 100,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.date}
                      </Badge>
                    ))}
                  </Flex>
                </ScrollArea>
              </Box>
            </Flex>
          </Paper>
        ))}

        {data?.booking?.length === 0 && (
          <Paper withBorder p="md" radius="md">
            <Text ta="center" size="md" c="red" my={40}>
              No completed event reports found.
            </Text>
          </Paper>
        )}
      </Flex>
    </Box>
  );
};

export default CompletedEvents;
