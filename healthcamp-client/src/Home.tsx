import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Text,
} from "@mantine/core";
import { MdArrowCircleRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { axiosPrivateInstance, axiosPublicInstance } from "./api";
import { getBannerAPI } from "./api/banner";
import { useQuery } from "@tanstack/react-query";
import ErrorAxios from "./components/ErrorAxios";
import { clientinfo } from "./api/auth";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

interface CarouselImg {
  img: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const getBanner = async (): Promise<CarouselImg[]> => {
    const resp = await axiosPublicInstance.get<CarouselImg[]>(getBannerAPI);
    return resp.data;
  };

  const [kycState, setKycState] = useState(true);

  const {
    isLoading,
    data: kycData,
    error: kycError,
  } = useQuery({
    queryKey: ["KycPending"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(clientinfo, {});
      return response.data;
    },
  });
  if (isLoading) {
    <div>loading...</div>;
  }
  if (kycError) {
    <ErrorAxios error={kycError} fallbackMessage="An error occurred" />;
  }
  useEffect(() => {
    if (kycData && kycData?.kyc?.kycStatus !== "approved") {
      open();
    }
  }, [kycData]);
  

  useEffect(() => {
    if (kycData) {
      if (kycData?.kyc?.kycStatus === "approved") {
        setKycState(false);
      }
    }
  }, [kycData]);

  const { data, error, isLoading:isBannerLoading } = useQuery({
    queryKey: ["bannerImage"],
    queryFn: getBanner,
  });

  if(isBannerLoading){
    return(
      <Center h="50vh">
      <Box ta="center">
        <Loader color="blue" />
      </Box>
    </Center>
    )
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  return (
    <>
      <Carousel slideSize="100%" slideGap="xl" loop withIndicators>
        {data?.map((item) => (
          <Carousel.Slide>
            <Image h={470} src={item.img} radius="lg" />
          </Carousel.Slide>
        ))}
      </Carousel>
      <Group justify="center" gap={30}>
        <Paper radius="lg" mt={20} p={20} shadow="xl" w={500}>
          <Group justify="space-between">
            <Text fw={600} c={"primary.1"}>
              Available Package
            </Text>
            <Button variant="light" disabled={kycState}>
              <MdArrowCircleRight
                onClick={() => navigate("/availabe-package")}
                size={25}
                color="#252C61"
              />
            </Button>

            {kycState && (
              <Modal opened={opened} onClose={close}>
                <Center>
                  <Text ta="center" c="red">
                    Your KYC is not verified. Please complete the verification
                    process.
                  </Text>
                </Center>
                <Button
                  onClick={() => navigate("/kycstatus")}
                  mt="xl"
                  variant="light"
                >
                  Click here to fill up the KYC
                </Button>
              </Modal>
            )}
          </Group>
          <Text mt={5}></Text>
          <Center>
            <Image w={200} src="img/banner1.png" />
          </Center>
        </Paper>
        <Paper radius="lg" mt={20} p={20} shadow="xl" w={500}>
          <Group justify="space-between">
            <Text fw={600} c={"primary.1"}>
              Booked Events
            </Text>
            <Button variant="light" disabled={kycState}>
              <MdArrowCircleRight size={25} color="#252B61" />
            </Button>
          </Group>
          <Center>
            <Image w={200} src="img/banner2.png" />
          </Center>
        </Paper>
      </Group>
      {/* <Paper shadow="xl" p={20} mt={20} withBorder>
        <Text c="primary.1">Packages</Text>
        <Group justify="space-between">
          <Box>
            <Paper shadow="sm" mt={10} p={10} bg="primary.0" w={300}>
              <Group justify="space-between">
                <Text c="white">Approved Packages</Text>
                <MdArrowCircleRight size={25} color="white" />
              </Group>
              <Text fw={700} c="white">
                05
              </Text>
            </Paper>
            <Paper shadow="sm" mt={20} p={10} bg="primary.0" w={300}>
              <Group justify="space-between">
                <Text c="white">Pending Packages</Text>
                <MdArrowCircleRight size={25} color="white" />
              </Group>
              <Text fw={700} c="white">
                01
              </Text>
            </Paper>
          </Box>
          <Image w={250} src="img/banner3.png" />
        </Group>
      </Paper>
      <Paper p={20} mt={20} shadow="xl" withBorder>
        <Text>Participants</Text>
        <Flex gap={40}>
          <Box>
            <Paper p={10} w={300} shadow="xl" mt={10}>
              <Group>
                <IoPeople />
                <Text>Total Participants</Text>
              </Group>
              <Text>110</Text>
            </Paper>
            <Text mt={10}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae illo, sequi voluptas est aperiam labore accusantium
              nisi esse ratione praesentium provident nam aut corporis nobis!
            </Text>
            <Button
              w={300}
              bg="primary.0"
              mt={30}
              rightSection={<MdArrowCircleRight size={20} />}
            >
              {" "}
              View Participants Details{" "}
            </Button>
          </Box>
          <Image w={330} src="img/banner4.png" />
        </Flex>
      </Paper> */}
    </>
  );
};

export default Home;
