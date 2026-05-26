import {
  Anchor,
  Button,
  Center,
  FileInput,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { GrUploadOption } from "react-icons/gr";
import { axiosPrivateInstance } from "../../api";
import {
  addparticipants,
  bulkUploadParticipants,
  getSampleFile,
} from "../../api/participants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ErrorAxios from "../../components/ErrorAxios";
import { useForm } from "@mantine/form";

const AddParticipants = () => {
  const queryClient = useQueryClient();

  const [fileValue, setFileValue] = useState<File | null>(null);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   participantId: "",
  //   gender: "",
  //   grade: "",
  //   contact: 0,
  //   email: "",
  // });

  const handleEdit = async (formData1: any) => {
    const resp = await axiosPrivateInstance.post(addparticipants, formData1);
    if (resp.status === 201) {
      form.reset();
    }

    return resp.data;
  };

  const ParticipantsBulkUpld = async () => {
    if (!fileValue) {
      throw new Error("No file selected");
    }
    const formData = new FormData();
    formData.append("participantFile", fileValue);
    const resp = await axiosPrivateInstance.post(
      bulkUploadParticipants,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return resp.data;
  };

  const { mutate: fileUploadMutate, isPending: isUploadPending } = useMutation({
    mutationKey: ["file-upload"],
    mutationFn: ParticipantsBulkUpld,
    onSuccess: () => {
      toast.success("Bulk Participants added successfully");
      queryClient.invalidateQueries({
        queryKey: ["registeredUsers"],
        exact: true,
      });
    },
    onError: (errorbro: any) => {
      const messages = errorbro?.response?.data?.message;

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(messages || "An unexpected error occurred");
      }
    },
  });
  // const downloadiFile = async () => {
  //   const resp = await axiosPrivateInstance.get(downloadFile);

  //   return resp.data;
  // };

  const form = useForm({
    initialValues: {
      name: "",
      gender: "",
      grade: "",
      phone: "",
      email: "",
    },
    validate: {
      name: (value) => (value ? null : "Please enter participant's name"),
      gender: (value) => (value ? null : "Please select participant's gender"),
      phone: (value) => (value ? null : "Please enter your contact number"),
      email: (value) => (value ? null : "Please enter participant's email"),
      grade: (value) => (value ? null : "Please enter participant's grade"),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["userParticipants"],
    mutationFn: handleEdit,
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["registeredUsers"] });
      toast.success("Participant added successfully");
    },
    onError: (errorbro: any) => {
      const messages = errorbro?.response?.data?.message;

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(messages || "An unexpected error occurred");
      }
    },
  });

  const { isLoading, data, error } = useQuery({
    queryKey: ["sampleFile"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getSampleFile, {
        responseType: "blob",
      });
      return response.data;
    },
  });

  const downloadFile = () => {
    if (!data) return;

    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sampleFile.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  const handleSubmit = (formDataa: any) => {
    mutate(formDataa);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title c="primary.2" size="h4">
          Add New Participants
        </Title>
        <Paper withBorder p={20} mt={10}>
          <Text> Enter Individual Participants Details</Text>
          <Text c="primary.2" mt={10}>
            Name
          </Text>
          <TextInput
            key={form.key("name")}
            {...form.getInputProps("name")}
            mt={5}
            placeholder="enter your name"
          />
          {/* <Text c="primary.2" mt={10}>
            ID
          </Text> */}

          <Text c="primary.2" mt={10}>
            Gender
          </Text>
          <Select
            key={form.key("gender")}
            {...form.getInputProps("gender")}
            placeholder="Select gender"
            data={["male", "female", "others"]}
          />
          <Text c="primary.2" mt={10}>
            Grade
          </Text>
          <NumberInput
            key={form.key("grade")}
            {...form.getInputProps("grade")}
            mt={5}
            placeholder="enter your grade"
          />
          <Text c="primary.2" mt={10}>
            Contact
          </Text>
          <NumberInput
            // onChange={(e: any) =>
            //   setFormData((prev) => ({ ...prev, contact: e }))
            // }
            // value={formData.contact}

            key={form.key("phone")}
            {...form.getInputProps("phone")}
            mt={5}
            placeholder="enter your contact"
          />
          <Text c="primary.2" mt={10}>
            Email
          </Text>
          <TextInput
            key={form.key("email")}
            {...form.getInputProps("email")}
            mt={5}
            placeholder="enter your email"
          />
          <Center>
            <Button loading={isPending} bg="btncolor.0" mt={20} type="submit">
              Submit
            </Button>
          </Center>
        </Paper>
      </form>

      <Center>
        <Text c="dimmed" mt={20}>
          OR
        </Text>
      </Center>
      <Paper mt={20} p={20} withBorder>
        <Text>Add Participants Details in Bulk</Text>

        <Paper withBorder p={20} mt={20}>
          <Center>
            <GrUploadOption size={40} />
          </Center>
          <Text mt={20} fw={600} ta={"center"}>
            Participants Lists
          </Text>
          <Text ta={"center"} mt={5} c="dimmed">
            First download the XLS file format that we have provided
          </Text>
          <Center>
            <Anchor onClick={downloadFile} mt={20} download={getSampleFile}>
              Download
            </Anchor>
          </Center>

          <Text ta={"center"} mt={10} c="dimmed">
            Fill the data and upload the list in the same provided format
          </Text>
          <Center>
            <FileInput
              onChange={setFileValue}
              value={fileValue}
              mt={20}
              variant="default"
              placeholder="Choose file"
            />
          </Center>
        </Paper>

        <Center>
          <Button
            loading={isUploadPending}
            onClick={() => fileUploadMutate()}
            mt={20}
            bg="btncolor.0"
          >
            Submit
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default AddParticipants;
