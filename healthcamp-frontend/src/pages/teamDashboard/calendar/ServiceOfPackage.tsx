import { Box, Button, Group, Paper, Text, Title } from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { serviceByCalendar } from "../../../api/calender";
import { axiosPrivateInstance } from "../../../api";

const ServiceOfPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { isLoading, data, error } = useQuery({
    queryKey: [`serviceListof${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${serviceByCalendar}?id=${id}`,
        {}
      );
      return response.data;
    },
  });
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (error) {
    <div>error is due to {error.message}</div>;
  }
  console.log("calendar data", data);
  return (
    <>
      <Title size="h2" c="primary.1">
        Calendar
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Title size="h3" c="primary.2">
          Calendar Opened for {location.state} Package
        </Title>
        {data?.map((item: any, index: any) => {
          return (
            <Paper key={index} withBorder mt={10} p={20}>
              <Group justify="space-between">
                <Box>
                  <Text fw={600}>{item.name}</Text>

                  <Text size="sm" c={item.hasCalendar ? "#128983" : "red"}>
                    {item.hasCalendar
                      ? "calendar opened"
                      : "calendar not opened"}
                  </Text>
                </Box>
                <Button
                  onClick={() =>
                    navigate(`/openCalender/${item.id}`, { state: {id:id, name:item?.name} })
                  }
                  disabled={!item.hasCalendar}
                  variant="default"
                  rightSection={<FaCalendarAlt />}
                >
                  View Info
                </Button>
              </Group>
            </Paper>
          );
        })}
      </Paper>
    </>
  );
};

export default ServiceOfPackage;
