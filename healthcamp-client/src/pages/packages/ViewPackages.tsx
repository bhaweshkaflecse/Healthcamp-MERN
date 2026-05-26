import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { getServiceOfPackageStatus } from "../../api/package";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ViewPackages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {enrollId} = useParams();
  console.log("enrollId", enrollId);
  const getServiceOfPackage = async () => {
    try {
      const resp = await axiosPrivateInstance.get(
        `${getServiceOfPackageStatus}/${enrollId}?packageId=${id}`,
      
      );
      return resp.data;
    } catch (err) {
      console.log("Error Occurred", err);
    }
  };

  const { data: serviceOfPackage, isLoading } = useQuery({
    queryKey: [`getServiceOfPackage/${id}/${enrollId}`],
    queryFn: getServiceOfPackage,
  });

  console.log("hehe", serviceOfPackage);

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  return (
    <>
      <Title size="h4" c="primary.2">
        Packages
      </Title>
      <Box mt={10} p={10} bg="primary.2">
        <Text ta="center" c="white">
          service name
        </Text>
      </Box>

      {serviceOfPackage?.map((service: any) => (
        <Paper id={service?.id} p={20} withBorder>
          <Paper withBorder mt={10} p={10}>
            <Group>
              <FaCheckCircle color="#6092FE" size={20} />
              <Text c="dimmed">{service?.name}</Text>
            </Group>
            <Group ml={35} mt={10} gap={8}>
              <FaCalendarAlt color="#696969" />
              <Text c="dimmed" size="sm">
                Event Calender Status:
                {!service.isCalendarOpen ? (
                  <span style={{ color: "red" }}> Not Published Yet </span>
                ) : (
                  <Button
                    onClick={() =>
                      navigate(`/my-bookings/${service?.id}/${enrollId}`, {
                        state: {
                          enrollPackageId: location.state,
                        },
                      })
                    }
                    c="green"
                    variant="transparent"
                  >
                    Published
                  </Button>
                )}
              </Text>
            </Group>
          </Paper>
        </Paper>
      ))}

      {/* <Text ta="center" mt={20} c="primary.2">
          {" "}
          Total Payment
        </Text>
        <Center>
          <Paper w={400} p={20} withBorder mt={20}>
            <Text ta="center">Rs. 20,000</Text>
            <Group justify="space-between">
              <Box>
                <Text c="dimmed">Payment ID</Text>
                <Text size="sm">121212</Text>
              </Box>
              <Box>
                <Text c="dimmed">Payment Time</Text>
                <Text size="sm">25 Feb 2023 , 13:22</Text>
              </Box>
            </Group>
            <Group mt={10} justify="space-between">
              <Box>
                <Text c="dimmed">Payment Method</Text>
                <Text size="sm">Esewa</Text>
              </Box>
              <Box>
                <Text c="dimmed">Sender</Text>
                <Text size="sm">Digital Pravidhi</Text>
              </Box>
            </Group>
            <Divider mt={10} />
            <Group gap={4} justify="center" mt={30}>
              <HiOutlineDownload size={25} color="#696969" />
              <Text td="underline" c="dimmed">
                Get Receipt PDF
              </Text>
            </Group>
          </Paper>
        </Center> */}
    </>
  );
};

export default ViewPackages;
