import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { MdVerified } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptPayment,
  getFinanceData,
  rejectPayment,
} from "../../api/finance";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";

const RecentPaid = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isHistory = location.state;

  const { data, error, isLoading } = useQuery({
    queryKey: [`paymentDet${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getFinanceData}/${id}`
      );
      return response.data;
    },
  });
  console.log(data);

  const handleSubmit = async () => {
    try {
      console.log(id);
      const resp = await axiosPrivateInstance.patch(`${acceptPayment}/${id}`);
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paymentData"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentHistory"],
        refetchType: "active",
        exact: true,
      });
      navigate("/finance-dashboard");
      toast.success("Payment Accepted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleReject = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(`${rejectPayment}/${id}`);
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const { mutate: rejectMutation } = useMutation({
    mutationFn: handleReject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paymentHistory"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentData"],
        refetchType: "active",
        exact: true,
      });
      navigate("/dashboard");
      toast.success("Payment Rejected");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (error) {
    console.log(error);
  }
  return (
    <>
      <Title size="h2" c="#6092FE">
        Finance
      </Title>
      <Paper bg="#F8F9FA" mt={10} p={10} withBorder>
        {!isHistory && (
          <Group justify="space-between">
            <Title size="h3">Recently Paid</Title>
            <Group>
              <Button bg="green" onClick={() => mutate()} loading={isPending}>
                Accept
              </Button>
              <Button onClick={() => rejectMutation()} bg="red">
                Reject
              </Button>
            </Group>
          </Group>
        )}

        <Paper withBorder mt={20} p={10}>
          <Group justify="space-between">
            <Group>
              <Image radius={5} w={100} src="/img/paidimage.png" />
              <Box>
                <Text>Name</Text>
                <Text fw={500}>{data?.enroll?.client?.name}</Text>
              </Box>
            </Group>
            <Badge radius="xs" size="xl" bg="#E5ECFA" c="black">
              <MdVerified color="blue" /> {data?.price}
            </Badge>
          </Group>
          <Divider mt={20} />
          <Group mt={10} justify="space-between">
            <Box>
              <Text size="xs" c="dimmed">
                Payment ID
              </Text>
              <Text>{data?.id}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">
                Payment Method
              </Text>
              <Text>{data?.medium}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">
                Invoice Date
              </Text>
              <Text>
                {data?.updatedAt
                  ? `${new Date(data.updatedAt).toLocaleDateString("en-US")} `
                  : "No Date"}
              </Text>
            </Box>
            <Badge
              radius="xs"
              size="xl"
              bg="#E5ECFA"
              c={data?.status === "approved" ? "green" : "red"}
            >
              {data?.status}
            </Badge>
          </Group>
          <Space h="xl" />
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed">
                Package
              </Text>
              <Text>{data?.enroll?.package?.name}</Text>
            </Box>
          </Group>
          <Text c="dimmed">Payment Proof</Text>
          <Image src={data?.proof} w={400} />
        </Paper>
      </Paper>
    </>
  );
};

export default RecentPaid;
