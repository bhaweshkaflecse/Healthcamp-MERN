import { AreaChart } from "@mantine/charts";
import {
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../../api";
import { chartData, paymentLog } from "../../../api/finance";
import { useState } from "react";

const FinanceDashboard = () => {
  const [filter, setFilter] = useState("week");

  const { data: PurchaseStat, isLoading } = useQuery({
    queryKey: ["PurchaseStat", filter],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${chartData}?purchaseState=${filter}`
      );
      return response.data;
    },
  });

  const { data: paymentData } = useQuery({
    queryKey: ["paymentLogData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${paymentLog}`);
      return response.data;
    },
  });
  console.log(paymentData)
  const rows = paymentData?.paymentHistory?.map((element: any) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element?.id}</Table.Td>
      <Table.Td>{element?.createdAt}</Table.Td>
      <Table.Td>{element?.enroll?.client?.name}</Table.Td>
      <Table.Td>{element?.enroll?.package?.name}</Table.Td>
      <Table.Td>{element?.price}</Table.Td>
      <Table.Td>
        <Badge color={element?.status == "approved" ? "green" : "red"}>
          {element?.status}
        </Badge>
      </Table.Td>
      <Table.Td>{element?.medium}</Table.Td>
    </Table.Tr>
  ));
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
      <Title size="h2" c="#6092FE">
        Finance
      </Title>
      <Paper mt={10} withBorder p={10}>
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
      <Paper mt={20} p={18} withBorder>
        <Title size="h2" c="#6092FE">
          Payment History
        </Title>

        <Table mt={10}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Log ID</Table.Th>
              <Table.Th>Log Date</Table.Th>
              <Table.Th>Client</Table.Th>
              <Table.Th>Packagae Name</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th c="blue">Processor</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </>
  );
};

export default FinanceDashboard;
