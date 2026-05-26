import {
  Box,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { paymentHistory } from "../../api/finance";

const FinanceClient = () => {
  const navigate = useNavigate();
  const forHistory = true;

  const { data: paymentHistoryData, error, isLoading } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(paymentHistory);
      return response.data;
    },
  });
  if(isLoading){
    return <Box>Loading...</Box>
  }
  if (error) {
    console.log(error);
  }
  return (
    <Paper p={18} withBorder>
      <Title size="h2" c="#6092FE">
        Payment History
      </Title>
      {Array.isArray(paymentHistoryData?.paymentHistory) &&
        paymentHistoryData?.paymentHistory?.map((item: any, index: any) => {
          return (
            <Group
              key={index}
              p={10}
              bg="#F5F8FF"
              mt={10}
              justify="space-between"
            >
              <Group>
                <Image
                  w={80}
                  radius={4}
                  src={item?.proof || "img/client.png"}
                />
                <Text c="blue">{item?.enroll?.client?.name}</Text>
              </Group>
              <Box>
                <Text c="blue">
                  {item?.updatedAt
                    ? `${new Date(item.updatedAt).toLocaleDateString(
                      "en-US"
                    )} ${new Date(item.updatedAt).toLocaleTimeString(
                      "en-US"
                    )}`
                    : "No Date"}
                </Text>
              </Box>
              <Group>
                <Text c="blue">{item?.price}</Text>
                <FaChevronRight
                  onClick={() =>
                    navigate("/recent-paid/" + item.id, {
                      state: forHistory,
                    })
                  }
                  color="blue"
                />
              </Group>
            </Group>
          );
        })}
    </Paper>
  );
};

export default FinanceClient;
