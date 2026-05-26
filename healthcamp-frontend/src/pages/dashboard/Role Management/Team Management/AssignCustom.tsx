import { useState } from "react";
import {
  Group,
  Text,
  Button,
  Paper,
  Center,
  TextInput,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { assignCustom } from "../../../../api/subteam";
import { axiosPrivateInstance } from "../../../../api";

interface AssignCustomProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const AssignCustom: React.FC<AssignCustomProps> = ({ setActiveTab }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      contact: "",
      email: "",
      address: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      contact: (value) =>
        /^9[678]\d{8}$/.test(String(value)) ? null : "Invalid Contact number",
    },
  });

  const { mutate: mutateCreateSubTeam, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return handleCreateCustom(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`subteam/${id}`],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["subTeam"],
      });
      form.reset();
      setFile(undefined);
      toast.success("Custom member assigned");
      setActiveTab("subteam");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("contact", values.contact);
    formData.append("address", values.address);

    if (file) {
      formData.append("profile", file);
    }

    mutateCreateSubTeam(formData);
  };
  const handleCreateCustom = async (body: any) => {
    const resp = await axiosPrivateInstance.post(
      `${assignCustom}/${id}`,
      body,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log(resp.data);
    return resp.data;
  };

  return (
    <>
      <Paper withBorder p={20}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Group justify="center">
            <Text>Assign a custom member for your team</Text>
          </Group>
          <TextInput
            mt={10}
            label="Full Name"
            placeholder="enter your full name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          ></TextInput>
          <TextInput
            mt={10}
            label="Email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          ></TextInput>
          <TextInput
            mt={10}
            label="Contact"
            type="number"
            placeholder="enter your contact number"
            key={form.key("contact")}
            {...form.getInputProps("contact")}
          />
          <TextInput
            mt={10}
            label="Address"
            placeholder="enter your address"
            key={form.key("address")}
            {...form.getInputProps("address")}
          ></TextInput>

          <Paper withBorder mt={20}>
            {file ? (
              <Center>
                <Image
                  w={300}
                  src={URL.createObjectURL(file)}
                  alt="uploaded file"
                />
              </Center>
            ) : (
              <Dropzone
                onDrop={(files) => setFile(files[0])}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <div>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Attach as many files as you like, each file should not
                      exceed 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
          </Paper>

          <Group justify="center" mt={20}>
            <Button variant="default" onClick={() => setActiveTab("subteam")}>
              Cancel
            </Button>
            <Button loading={isPending} type="submit">
              Create and Assign
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};
export default AssignCustom;
