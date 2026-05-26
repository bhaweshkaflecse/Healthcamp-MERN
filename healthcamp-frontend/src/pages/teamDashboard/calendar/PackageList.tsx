import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getpackage } from "../../../api/package";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const PackageList = () => {
  const navigate = useNavigate();

  const { isLoading, data, error } = useQuery({
    queryKey: ["CalanderList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getpackage, {});
      return response.data;
    },
  });
  console.log(data);
  if (isLoading) {
    <div>loading...</div>;
  }
  if (error) {
    <div>error is due to {error.message}</div>;
  }
  return (
    <>
      <Title size="h2" c="primary.1">
        Calendar
      </Title>
      <Paper mt={20} withBorder p={20}>
        <Title size="h3">List of Packages</Title>
        {data?.packages?.map((item: any, index: any) => {
          return (
            <Paper key={index} withBorder mt={20} p={10}>
              <Flex justify="space-between" align="center">
                <Group>
                  <Image w={50} radius="50%" src="img/teamlead.jpg" />
                  <Box>
                    <Text>{item.name}</Text>
                    <Text size="sm" c="#128983">
                      Calendar opened For 2/4 Services
                    </Text>
                  </Box>
                </Group>
                <Button
                  bg="btncolor.1"
                  onClick={() =>
                    navigate(`/packageservice/${item.id}`, {
                      state: item?.name,
                    })
                  }
                >
                  View More
                </Button>
              </Flex>
            </Paper>
          );
        })}
      </Paper>
    </>
  );
};

export default PackageList;
