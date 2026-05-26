import {
  Button,
  Center,
  Group,
  Image,
  NumberInput,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { infoClientAPI, updateClientAPI, updateProfile } from "../../api/users";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

const EditProfile = () => {
  interface formData {
    document: File | null;
  }

  const [formData, setFormData] = useState<formData>({
    document: null,
  });

  const [preview, setPreview] = useState<String | null>(null);

  const queryClient = useQueryClient();

  const handleFile = (Files: File[]) => {
    const file = Files[0];
    setFormData({
      ...formData,
      document: file,
    });

    setPreview(URL.createObjectURL(file));
  };


  const accessTokenn = async () => {
    const resp = await axiosPrivateInstance.get(infoClientAPI);

    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["userInfo"],
    queryFn: accessTokenn,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setNumber(data.contact);
    }
  }, [data]);

  const PostProfile = async () => {
    const resp = await axiosPrivateInstance.patch(
      updateProfile,
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
  };

  const { mutate: post } = useMutation({
    mutationKey: ["userProfile"],
    mutationFn: PostProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully.");
    },
    onError: (err:any) =>{
      toast.error(err?.response?.data?.message)

    }
  });

  function BaseDemo(props: Partial<DropzoneProps>) {
    return (
      <>
        <Group>
          <Dropzone
            w={60}
            h={60}
            radius="xl"
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
            {preview ? (
              <Image
                fit="cover"
                src={preview}
                alt="Preview"
                width={200}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <Image
                src={data?.profile}
                fit="cover"
                width={200}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            )}
          </Dropzone>
          <Button onClick={() => post()} variant="outline">
            Upload Profile
          </Button>
        </Group>
      </>
    );
  }

  const Authorization = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(updateClientAPI, {
        name,
        email,
        contact: +number,
        address,
      });
      toast.success("Profile updated successfully");
      return resp.data

    } catch (error: any) {
      toast.error(error.message);
  
    }
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateUserInfo"],
    mutationFn: Authorization,
    onSuccess: () => {
      navigate("/myprofile");
      queryClient.invalidateQueries({
        queryKey: ["userInfo"],
        exact: true,
        refetchType: "active",
      });
    },
  });

  return (
    <Paper p={20} withBorder>
      <Title size="h4">Edit Profile</Title>
      <Paper mt={10} p={20} withBorder>
        <Text>Your Profile Picture</Text>
        {/* <Group>
       <Image mt={10} w={100} src="img/logo.png"/>

       <Group gap={5}>
        <CiEdit />
        <Text>Change</Text>
       </Group>
       </Group> */}
        <BaseDemo />

        <Text mt={10}>Full Name</Text>
        <TextInput disabled
          mt={5}
          placeholder="Please enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Text mt={10}>Email</Text>
        <TextInput
          disabled
          mt={5}
          placeholder="Please enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Text mt={10}>Phone Number</Text>
        <NumberInput
          mt={5}
          placeholder="Please enter your phone number"
          value={number}
          onChange={(value) =>
            setNumber(typeof value === "string" ? +value : value)
          }
        />
        <Text mt={10}>Address</Text>
        <TextInput disabled
          mt={5}
          placeholder="Please enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Center>
          <Button
            onClick={() => mutate()}
            bg="btncolor.0"
            mt={20}
            loading={isPending}
          >
            {isPending ? "Updating..." : "Update"}
          </Button>
        </Center>
      </Paper>
      {error && <Text c="red">{error.message}</Text>}
    </Paper>
  );
};

export default EditProfile;
