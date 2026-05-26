import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Menu,
  Modal,
  Text,
} from "@mantine/core";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";

import { useDisclosure } from "@mantine/hooks";
import { RiLogoutCircleRLine } from "react-icons/ri";
//   import { infoClientAPI } from "../../api/users";
import { adminSignOut } from "../../api/auth";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";

interface TopbarProps {
  data: {
    profile: File;
    name: string;
  } | null;
}
const Admin = ({ data }: TopbarProps) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const Logout = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(adminSignOut, {}, {});
      toast.success("Logout Successful");
      navigate("/login");
      return resp.data;
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

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
          <Button onClick={() => Logout()}>Logout</Button>
        </Group>
      </Modal>
      <Group justify="space-between">
        <Group p={10}>
          <MdAddBox size={25} color="#6092FE" />
          <Text c="primary.2">HEALTH CAMP MS</Text>
        </Group>
        <Group p={10}>
          <Image
            h={40}
            w={40}
            radius={40}
            src={data?.profile || "/img/teamlead.jpg"}
          />
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
                key="my-profile"
                onClick={() => navigate("/team-profile")}
                leftSection={<GoPerson size={20} />}
              >
                My Profile
              </Menu.Item>
              <Menu.Item
                key="settings"
                onClick={() => navigate("/team-setting")}
                leftSection={<IoSettingsOutline size={20} />}
              >
                Settings
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

export default Admin;
