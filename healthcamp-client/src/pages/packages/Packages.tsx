import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Tabs,
  Text,
  Title,
  Card,
  Avatar,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../providers/context";
import api, { axiosPrivateInstance } from "../../api";
import { getpackage } from "../../api/package";
import { getPackageByStatus } from "../../api/enrollment";
import { useContext, useState } from "react";
import { KYContext, KycContext } from "../../providers/context/KycContext";
import ErrorAxios from "../../components/ErrorAxios";

const Packages = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");

  const kycContext = useContext(KycContext) as KYContext;
  const { isKycVerified } = kycContext;

  const { generateAcessToken } = useGlobalContext();
  const [status, setStatus] = useState("");

  const { data } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const token = await generateAcessToken();
      const response = await api.get(getpackage, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
  });

  const getPackageStatus = async () => {
    const resp = await axiosPrivateInstance.get(`${getPackageByStatus}?status=${status}`);
    return resp.data;
  };

  const { data: selectedPackage, isLoading: isLoadingPackage, error } = useQuery({
    queryKey: [`getPackageStatus/${status}`, status],
    queryFn: getPackageStatus,
  });

  const { data: approvedData } = useQuery({
    queryKey: ["packageCount/approved"],
    queryFn: async () => {
      const resp = await axiosPrivateInstance.get(`${getPackageByStatus}?status=approved`);
      return resp.data;
    },
  });

  const { data: pendingData } = useQuery({
    queryKey: ["packageCount/pending"],
    queryFn: async () => {
      const resp = await axiosPrivateInstance.get(`${getPackageByStatus}?status=pending`);
      return resp.data;
    },
  });

  const { data: rejectedData } = useQuery({
    queryKey: ["packageCount/reject"],
    queryFn: async () => {
      const resp = await axiosPrivateInstance.get(`${getPackageByStatus}?status=reject`);
      return resp.data;
    },
  });

  console.log('selected package', selectedPackage)

  if (isLoadingPackage) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }
  console.log(data);

  return (
    <>
      <Title size={22} fw="bold" c="blue" mb="sm">
        Packages
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Tabs defaultValue={activeTab}>
          <Tabs.List>
            <Tabs.Tab value="available">Available Packages ({data?.packages?.length || 0})</Tabs.Tab>
            <Tabs.Tab
              onClick={() => {
                setStatus("approved");
                setActiveTab("approved");
              }}
              value="approved"
            >
              Approved Packages ({approvedData?.length || 0})
            </Tabs.Tab>
            <Tabs.Tab
              onClick={() => {
                setStatus("pending");
                setActiveTab("pending");
              }}
              value="pending"
            >
              Pending Packages ({pendingData?.length || 0})
            </Tabs.Tab>
            <Tabs.Tab
              onClick={() => {
                setStatus("reject");
                setActiveTab("reject");
              }}
              value="reject"
            >
              Rejected Packages ({rejectedData?.length || 0})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel mt={20} value="available">
            {data && data?.packages?.length > 0 ? (
              data?.packages?.map((item: any, index: any) => (
                <Card mt={10} key={index} padding="lg" shadow="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Group>
                      <Avatar src={item?.img} radius="xl" size={60} />
                      <Box>
                        <Text w={600}>{item.name}</Text>
                        <Text size="sm" c="dimmed" maw={300}>
                          {item?.description}
                        </Text>
                      </Box>
                    </Group>
                    <Button
                      disabled={!isKycVerified}
                      onClick={() => navigate(`/package/${item?.id}`)}
                      variant="filled"
                      color="blue"
                    >
                      View More
                    </Button>
                  </Group>
                </Card>
              ))
            ) : (
              <Center h="xxl">
              <Text my={40} c="red" >No Package available at the moment</Text>
            </Center>
            )}
          </Tabs.Panel>

          <Tabs.Panel mt={20} value="pending">
            {selectedPackage && selectedPackage.length > 0 ? (
              selectedPackage?.map((item: any, index: any) => (
                <Card mt={10} key={index} padding="lg" shadow="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Group>
                      <Avatar src={item?.package?.img} radius="xl" size={60} />
                      <Box>
                        <Text w={600}>{item?.package?.name}</Text>
                        <Text size="sm" c="dimmed" maw={300}>
                          {item?.package?.description}
                        </Text>
                      </Box>
                    </Group>
                    <Button disabled variant="outline" color="gray">
                      View More
                    </Button>
                  </Group>
                </Card>
              ))
            ) : (
              <Center h="xxl">
                <Text my={40} c="red" >No pending packages.</Text>
              </Center>
            )}
          </Tabs.Panel>

          <Tabs.Panel mt={20} value="approved">
            {selectedPackage && selectedPackage.length > 0 ? (
              selectedPackage?.map((item: any, index: any) => (
                <Card mt={10} key={index} padding="lg" shadow="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Group>
                      <Avatar src={item?.package?.img} radius="xl" size={60} />
                      <Box>
                        <Text w={600}>{item?.package?.name}</Text>
                        <Text size="sm" c="dimmed" maw={300}>
                          {item?.package?.description}
                        </Text>
                      </Box>
                    </Group>
                    <Button
                      onClick={() =>
                        navigate(`/view-packages/${item?.package?.id}/${item?.id}`, {
                          state: item?.id,
                        })
                      }
                      variant="filled"
                      color="blue"
                    >
                      View More
                    </Button>
                  </Group>
                </Card>
              ))
            ) : (
              <Center h="xxl">
              <Text my={40} c="red" >No Approved packages.</Text>
            </Center>
            )}
          </Tabs.Panel>

          <Tabs.Panel mt={20} value="reject">
            {selectedPackage && selectedPackage.length > 0 ? (
              selectedPackage?.map((item: any, index: any) => (
                <Card mt={10} key={index} padding="lg" shadow="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Group>
                      <Avatar src={item?.package?.img} radius="xl" size={60} />
                      <Box>
                        <Text w={600}>{item?.package?.name}</Text>
                        <Text size="sm" c="dimmed" maw={300}>
                          {item?.package?.description}
                        </Text>
                        <Text mt={2} size="xs">
                          Comment: <span style={{ color: "red" }}>{item?.comment}</span>
                        </Text>
                      </Box>
                    </Group>
                    <Button disabled variant="outline" color="gray">
                      View More
                    </Button>
                  </Group>
                </Card>
              ))
            ) : (
              <Center h="xxl">
              <Text my={40} c="red" >No rejected packages.</Text>
            </Center>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default Packages;
