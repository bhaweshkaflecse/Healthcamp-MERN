import { AreaChart } from "@mantine/charts";
import {
  Box,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  SegmentedControl,
  Space,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  chartData,
  getFinanceData,
  paymentHistory,
} from "../../api/finance";
import { axiosPrivateInstance } from "../../api";
import { useState } from "react";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const forHistory = true;

  const [filter, setFilter] = useState("week");

  const { data: PurchaseStat } = useQuery({
    queryKey: ["PurchaseStat", filter],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${chartData}?purchaseState=${filter}`
      );
      return response.data;
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["paymentData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getFinanceData);
      return response.data;
    },
  });

  const { data: paymentHistoryData } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(paymentHistory);
      return response.data;
    },
  });

  console.log(paymentHistoryData)

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
      <Paper mt={10} withBorder p={18}>
        <Group justify="space-between">
          <Box>
            <Title size="h3">Balance</Title>
            <Text>amount of income and results</Text>
          </Box>
          <SegmentedControl
            bg={"#F8F8F8"}
            color="green"
            size="sm"
            radius="xl"
            data={["week", "month", "year"]}
            value={filter}
            onChange={setFilter}
          />
        </Group>
        <Space h="xl" />

        <Title size="h2" c="blue">
          Rs. {PurchaseStat?.totalAmount}
        </Title>
        <AreaChart
          mt={20}
          p={5}
          h={300}
          data={PurchaseStat?.purchaseStat}
          dataKey="label"
          type="stacked"
          series={[{ name: "amount", color: "indigo.6" }]}
          curveType="monotone"
          tickLine="none"
          withDots={false}
          yAxisProps={{
            tickFormatter: (value) => `${value / 10000}k`
          }}
        />
      </Paper>
      <Paper p={18} withBorder>
        <Tabs defaultValue="recently">
          <Tabs.List>
            <Tabs.Tab value="recently">Recently Payment</Tabs.Tab>
            <Tabs.Tab value="payment">Payment History</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="recently">
            {Array.isArray(data) &&
              data?.map((item: any, index: any) => {
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
                        src={item?.enroll.client.profile || "img/client.png"}
                      />
                      <Text c="blue">{item?.enroll.client.name}</Text>
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
                        onClick={() => navigate("/recent-paid/" + item.id)}
                        color="blue"
                      />
                    </Group>
                  </Group>
                );
              })}
          </Tabs.Panel>

          <Tabs.Panel value="payment">
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
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default FinanceDashboard;
