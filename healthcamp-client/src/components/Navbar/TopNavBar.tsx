import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Menu,
  Modal,
  Text,
} from "@mantine/core";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { GoCreditCard, GoPerson } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { RiLogoutCircleRLine } from "react-icons/ri";
import api from "../../api";
import { infoClientAPI } from "../../api/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGlobalContext from "../../providers/context";
import { logout } from "../../api/auth";
import { useContext } from "react";
import { KycContext } from "../../providers/context/KycContext";

const TopNavBar = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { generateAcessToken } = useGlobalContext();
  const context = useContext(KycContext);

  // const accessToken =

  const Logout = async () => {
    try {
      const token = await generateAcessToken();
      const resp = await api.patch(
        logout,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // close();

      navigate("/login");

      return resp.data;
    } catch (error) {
      console.error("Error sending request", error);
      // Handle error state or user feedback here
      throw error;
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["userLogout"],
    mutationFn: Logout,
    onError: (error: any) => {
      console.error("error", error);
    },
  });

  const accessTokenn = async () => {
    try {
      const token = await generateAcessToken();
      const resp = await api.get(infoClientAPI, {
        headers: {
          Authorization: token,
        },
      });

     
      context?.updateKycStatus(resp.data.kyc.kycStatus);

      return resp.data;
    } catch (error:any) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // window.location.href = "/login";
      }
      throw error;
    }
  };

  // useEffect(() =>{
  //   const checkUserLoggedIn = () =>{
  //     if(!accessTokenn || !accessToken){
  //       window.location.href='/login'
  //     }
  //   }

  //   checkUserLoggedIn()

  // },[])

  const { data } = useQuery({
    queryKey: ["userInfo"],
    queryFn: accessTokenn,
  });

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Center>
          <RiLogoutCircleRLine size={30} />
        </Center>
        <Text mt={10} ta="center">
          Are you sure want to logout ?
        </Text>
        <Text ta="center" size="sm" c="dimmed">
          You will no longer be able to log in on the selected devices.
        </Text>
        <Group mt={30} justify="center">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={() => mutate()}>Logout</Button>
        </Group>
      </Modal>
      <Group justify="space-between">
        <Group p={10}>
          <MdAddBox size={25} color="#6092FE" />
          <Text c="primary.2">HEALTH CAMP MS</Text>
        </Group>
        <Group p={10}>
          <Menu shadow="md" width={280}>
            <Menu.Target>
              <Button variant="light">Contact to Teamlead</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item key="kyc-status">
                <Text ta="center" fw="bold" c="blue">
                  Team Lead Details
                </Text>

               {
                data?.teamLead && <Flex direction="column" mt="sm">
                <Group mb="lg" justify="center">
                  <Avatar size="xl" src={data?.teamLead?.profile} />
                </Group>
                <Group w="100%" justify="space-between">
                  <Text fw="bold">Name:</Text>
                  <Text c="dimmed">{data?.teamLead?.name}</Text>
                </Group>

                <Group w="100%" justify="space-between">
                  <Text fw="bold">Email:</Text>
                  <Text c="dimmed">{data?.teamLead?.email}</Text>
                </Group>

                <Group w="100%" justify="space-between">
                  <Text fw="bold">Contact:</Text>
                  <Text c="dimmed">{data?.teamLead?.contact}</Text>
                </Group>
              </Flex>
               } 

               <Center>
               {
                !data?.teamLead && <Text c="red" mt="sm">Sorry, no team lead found</Text>
               }

               </Center>

              
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* <Button p="sm" variant="light">Contact to Teamlead</Button> */}

          <Image h={40} w={40} radius={40} src={data?.profile} />
          <Box>
            <Text c="#6B7280" size="sm">
              Welcome Back !
            </Text>
            <Text>{data?.name}</Text>
          </Box>
          <Menu shadow="md" width={280}>
            <Menu.Target>
              <Button
                w={10}
                variant="transparent"
                leftSection={<RiArrowDropDownLine size={50} />}
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                key="kyc-status"
                onClick={() => navigate("/kycstatus")}
                leftSection={<GoCreditCard size={20} />}
              >
                KYC status
              </Menu.Item>
              <Menu.Item
                key="my-profile"
                onClick={() => navigate("/myprofile", { state: data })}
                leftSection={<GoPerson size={20} />}
              >
                My Profile
              </Menu.Item>

              <Menu.Item
                key="logout"
                onClick={open}
                leftSection={<RiLogoutCircleRLine size={20} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </>
  );
};

export default TopNavBar;
