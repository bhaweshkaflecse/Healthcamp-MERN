import {
  Alert,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Menu,
  Paper,
  Text,
} from "@mantine/core";

import { CiFilter } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { getTeamPackagesAPI } from "../../../api/enrollment";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosPrivateInstance } from "../../../api";

const PackageRequest = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("pending");

  const getPackages = async () => {
    const resp = await axiosPrivateInstance.get(getTeamPackagesAPI, {
      params: {
        status: state,
      },
    });
    return resp.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["verifyPackages", state],
    queryFn: getPackages,
  });

  const Time = (time: any) => {
    const createdTime = new Date(time);
    const nowTime: Date = new Date();
    const diffInMins: number = nowTime.getTime() - createdTime.getTime();
    const diffInMin: number = Math.floor(diffInMins / (1000 * 60));
    const diffInHr: number = Math.floor(diffInMins / (1000 * 60 * 60));
    const diffInDays: number = Math.floor(diffInMins / (1000 * 60 * 60 * 24));
    let time1: string = "";

    if (diffInMin < 60) {
      time1 = `${diffInMin} mins ago`;
    } else if (diffInHr < 24) {
      time1 = `${diffInHr} mins ago`;
    } else {
      time1 = `${diffInDays} days ago`;
    }

    return time1;
  };
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
    // @ts-ignore
    return (      <Alert variant="light" color="red" title="Error Occurred">        {error?.response?.data?.message || "Error Occurred"}
      </Alert>
    );
  }

  function Demo() {
    // const {} = useMutation()
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="default" leftSection={<CiFilter />}>
            Filter
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Status</Menu.Label>
          <Menu.Item
            value="Approved"
            onClick={() => setState("approved")}
            c="green"
          >
            Approved
          </Menu.Item>
          <Menu.Item onClick={() => setState("pending")} c="yellow">
            Pending
          </Menu.Item>
          <Menu.Item onClick={() => setState("reject")} c="red">
            Denied
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Box>
      <Text size="xl" c="blue">
        Package Request
      </Text>

      <Paper p={20} mt={20} withBorder>
        <Flex my={20} align="center" justify="space-between">
          <Text fw="bold" size="lg" c="blue" my={10}>
            Package Purchase Requests
          </Text>
          <Demo />
        </Flex>

        { data?.length > 0 ? data?.map((packa: any) => (
          <Flex
            key={packa?.id}
            p={20}
            align="center"
            bg="#F4F5F6"
            justify="space-between"
          >
            <Flex gap="sm" align="center">
              <Avatar src={packa?.client?.profile} />
              <Box>
                <Text>{packa?.client?.name}</Text>
                <Text c="dimmed">{packa?.client?.email}</Text>
              </Box>
            </Flex>

            <Text c="blue">{Time(packa?.createdAt)}</Text>

            <Button
              onClick={() =>
                navigate(`/package-verify/${packa.id}`, { state: { state } })
              }
              bg="green"
            >
              View
            </Button>
          </Flex>
        )): <Center><Text c='red' fw="bolder">No Package Purchase request at the moment</Text></Center>}
      </Paper>
    </Box>
  );
};

export default PackageRequest;
