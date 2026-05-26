import {
  Box,
  Button,
  Flex,
  Input,
  Paper,
  Text,
  Title,
} from "@mantine/core";
// import React, { useEffect } from 'react'
import { axiosPrivateInstance, axiosPublicInstance } from "../../api";
import { editParticipants, getOneParticipant } from "../../api/participants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorAxios from "../../components/ErrorAxios";
import { toast } from "react-toastify";

interface FormDetails {
  name: string;
  participantId: string;
  gender: string;
  grade: number | null;
  contact: string;
  email: string;
}
const Edit = () => {
  const location = useLocation();

  const id = location.state?.id;

  if (!id) {
    return <Text>Error: No participant ID provided</Text>;
  }

  const queryClient = useQueryClient();

  const [formdetails, setFormDetails] = useState<FormDetails>({
    participantId: "",
    name: "",
    gender: "",
    email: "",
    grade: null,
    contact: "",
  });

  const getPartici = async () => {
    const resp = await axiosPublicInstance.get(`${getOneParticipant}/${id}`);
    //   queryClient.invalidateQueries({queryKey:['registeredUsers']});
    return resp.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["registeredUsers", id],
    queryFn: getPartici,
  });

  const editParticipantsInfo = async () => {
    const resp = await axiosPrivateInstance.patch(
      `${editParticipants}/${id}`,
      formdetails
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["editFormDetails"],
    mutationFn: editParticipantsInfo,
    onError: (error: any) => {
      const axios_error: any = error?.response?.data?.message;

      if (Array.isArray(axios_error)) {
        axios_error.map((err) => toast.error(err));
      }

      toast.error(axios_error);
    },
    onSuccess: () => {
      toast.success("Successfully updated");
      queryClient.invalidateQueries({queryKey:['registeredUsers'],exact:true})
    },
    
  });

  useEffect(() => {
    if (data) {
      setFormDetails({
        name: data.name || "",
        participantId: data?.participantId || "",
        email: data.email || "",
        gender: data.gender || "",
        contact: data.contact || "0",
        grade: data.grade || "",
      });
    }
  }, [data]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormDetails((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }
  return (
    <Box px={40}>
      <Title mb={50}>Edit Participant</Title>
      <Paper radius="md" p={60} withBorder>
        {/* <Text size='lg' ta="center">New Participant Added Successfully</Text> */}

        <Flex my="md" justify="space-between">
          <Text>Name</Text>
          <Input
            name="name"
            onChange={handleInputChange}
            value={formdetails?.name}
            type="text"
          />
        </Flex>
        <Flex justify="space-between">
          <Text>ID</Text>
          <Input
          disabled
            name="participantId"
            onChange={handleInputChange}
            value={formdetails?.participantId}
            type="text"
          />
        </Flex>
        <Flex my="md" justify="space-between">
          <Text>Gender</Text>
          <Input
            name="gender"
            onChange={handleInputChange}
            value={formdetails?.gender}
            type="text"
          />
        </Flex>
        <Flex justify="space-between">
          <Text>Class</Text>
          <Input
            name="grade"
            onChange={handleInputChange}
            value={formdetails?.grade ?? undefined}
          />
        </Flex>
        <Flex my="md" justify="space-between">
          <Text>Mail</Text>
          <Input
            name="email"
            onChange={handleInputChange}
            value={formdetails?.email}
            type="text"
          />
        </Flex>
        <Flex justify="space-between">
          <Text>Contact</Text>
          <Input
            name="contact"
            onChange={handleInputChange}
            value={formdetails?.contact}
            type="text"
          />
        </Flex>

        <Flex justify="center" gap="lg">
          <Button loading={isPending} onClick={() => mutate()}>
            Edit Details
          </Button>
          <Button color="green" variant="filled">
            Back to Participants
          </Button>
        </Flex>
      </Paper>
    </Box>
  );
};

export default Edit;
