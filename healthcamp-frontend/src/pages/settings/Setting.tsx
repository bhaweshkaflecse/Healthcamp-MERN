import {
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Input,
  PasswordInput,
  Tabs,
} from "@mantine/core";
import { Box, Paper, Text, Title } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";
import { MdOutlineFileUpload, MdUpload } from "react-icons/md";
import { axiosPrivateInstance } from "../../api";
import {
  getAdminInfo,
  updateAdminInfo,
  updateAdminProfile,
} from "../../api/role";
import { updateAdminPassword } from "../../api/auth";

function BaseDemo(props: Partial<DropzoneProps>) {
  interface formData {
    document: File | null;
  }
  const [formData, setFormData] = useState<formData>({
    document: null,
  });
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<String | null>(null);

  const handleFile = (Files: File[]) => {
    const file = Files[0];
    setFormData({
      ...formData,
      document: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const GetAdminData = async () => {
    const resp = await axiosPrivateInstance.get(getAdminInfo, {});

    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["adminInfo"],
    queryFn: GetAdminData,
  });

  const PostProfile = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        updateAdminProfile,
        {
          profile: formData.document,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return resp.data;
    } catch (err) {
      console.log("Error sending request", err);
      throw err;
    }
  };
  const { mutate, isPending } = useMutation({
    mutationKey: ["adminProfile"],
    mutationFn: PostProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminInfo"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Profile added Successfully");
    },
  });

  return (
    <Box>
      <Paper
        radius="md"
        bg="#EDF2F6"
        w={150}
        h={122}
        withBorder
        // style={{ border: "dotted" }}
      >
        <Dropzone
          onDrop={(files) => handleFile(files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...props}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Group justify="center" h={120} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <MdOutlineFileUpload />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <MdUpload />
            </Dropzone.Reject>

            <Flex direction="column" align="center">
              <Dropzone.Idle>
                {preview ? (
                  <Image
                    radius="md"
                    fit="cover"
                    src={preview}
                    alt="Preview"
                    width={200}
                    height={200}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Image height={200} src={data?.profile} />
                )}
              </Dropzone.Idle>

              <div>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Upload your photo
                </Text>
              </div>
            </Flex>
          </Group>
        </Dropzone>
      </Paper>
      <Button loading={isPending} onClick={() => mutate()} mt={20}>
        Update Photo
      </Button>
    </Box>
  );
}

function Hero() {
  const GetAdminData = async () => {
    const resp = await axiosPrivateInstance.get(getAdminInfo, {});

    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["adminInfo"],
    queryFn: GetAdminData,
  });
  const [info, setInfo] = useState({
    name: "",
    address: "",
    number: "",
    id: "",
  });

  useEffect(() => {
    if (data) {
      setInfo({
        name: data.name,
        address: data.address,
        number: data.contact,
        id: data.id,
      });
    }
  }, [data]);

  const [changePassword, setChangePassword] = useState(true);

  const UpdateAdminProfile = async () => {
    const data = {
      name: info?.name,
      address: info?.address,
      contact: parseInt(info?.number, 10),
    };
    try {
      const resp = await axiosPrivateInstance.patch(updateAdminInfo, data, {});

      if (resp.status === 200) {
        toast.success("Profile Updated Successfully");
      }
    } catch (err) {
      console.log("Error occurred", err);
      throw err;
    }
  };
  const queryClient = useQueryClient();

  const { mutate, isPending: pendingProfile } = useMutation({
    mutationKey: ["updateAdminInfo"],
    mutationFn: UpdateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInfo"] });
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
    },
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      oldPassword: (value) =>
        value.length == 0 ? "Please enter your old password" : null,
      newPassword: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const ChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const data = {
      oldPassword: values.oldPassword,
      password: values.newPassword,
    };

    try {
      const resp = await axiosPrivateInstance.patch(
        updateAdminPassword,
        data,
        {}
      );

      return resp.data;
    } catch (err) {
      console.log("Error occurred", err);
      throw err;
    }
  };

  const { mutate: passwordUpdateFunc, isPending } = useMutation({
    mutationKey: ["updateAdminPassword"],
    mutationFn: ChangePassword,
    onSuccess: () => {
      toast.success("Password has been updated Successfully");
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
    },
  });

  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">Profile Setting</Tabs.Tab>
        <Tabs.Tab value="messages">Login Setting</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <Text my={16} c="dimmed">
          Your Profile Picture
        </Text>
        <BaseDemo />

        <Divider mt={20} />

        <Box mt={30}>
          <Flex direction="column" gap="md">
            <Flex direction="column">
              <Text>Full Name</Text>
              <Input
                onChange={(e) =>
                  setInfo((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                value={info.name}
                placeholder="Please enter your full name"
              />
            </Flex>

            <Flex direction="column">
              <Text>Address</Text>
              <Input
                value={info?.address}
                onChange={(e) =>
                  setInfo((prevState) => ({
                    ...prevState,
                    address: e.target.value,
                  }))
                }
                placeholder="Please enter your address"
              />
            </Flex>

            <Flex direction="column">
              <Text>Phone Number</Text>
              <Input
                maxLength={10}
                value={info?.number}
                onChange={(e) =>
                  setInfo((prevState) => ({
                    ...prevState,
                    number: e.target.value,
                  }))
                }
                placeholder="Please enter your phone number"
              />
            </Flex>
          </Flex>
          <Button
            loading={pendingProfile}
            onClick={() => mutate()}
            mt={12}
            bg="btncolor.1"
          >
            Update Profile
          </Button>
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value="messages">
        {changePassword ? (
          <Box>
            <Box bg="#EDF2F6" mt={20} p={30}>
              <Flex justify="space-between">
                <Box>
                  <Text>Password</Text>
                  <Text>********</Text>
                </Box>

                <Button onClick={() => setChangePassword(!changePassword)}>
                  Change
                </Button>
              </Flex>
            </Box>

            <Button
              size="md"
              c="dimmed"
              variant="transparent"
              leftSection={<IoMdLogOut size={20} />}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box p={30}>
            <Paper>
              <form
                onSubmit={form.onSubmit((values) => passwordUpdateFunc(values))}
              >
                <Text size="xl" c="#878787" mt={10}>
                  Password
                </Text>

                <Box my={20}>
                  <Flex direction="column" gap="md">
                    <Text c="#878787">Old password</Text>
                    <PasswordInput
                      {...form.getInputProps("oldPassword")}
                      placeholder="Please enter your old password"
                    />

                    <Text c="#878787">New password</Text>
                    <PasswordInput
                      {...form.getInputProps("newPassword")}
                      placeholder="Please enter your new password"
                    />

                    <Text c="#878787">Confirm new password</Text>
                    <PasswordInput
                      {...form.getInputProps("confirmPassword")}
                      placeholder="Please enter your new password again"
                    />
                  </Flex>
                  <Button loading={isPending} type="submit" mt={20}>
                    Update
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>
        )}
      </Tabs.Panel>
    </Tabs>
    //this is changess
  );
}

const Setting = () => {
  return (
    <Box>
      <Title>Settings</Title>
      <Paper p={30}>
        <Hero />
      </Paper>
    </Box>
  );
};

export default Setting;
