import {
  Button,
  Center,
  Group,
  Input,
  Paper,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { createService } from "../../../api/service";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const CreateService = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttribute] = useState<string[]>([""]);
  const queryClient = useQueryClient();
  const handleQualificationChange = (index: number, value: string) => {
    const newQualifications = [...attributes];
    newQualifications[index] = value;
    setAttribute(newQualifications);
  };

  const handleSubmit = async () => {
    const body = { name, description, attributes };
    console.log(body);
    try {
      const resp = await axiosPrivateInstance.post(createService, body, {});
      return resp.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { isPending, mutate} = useMutation({
    mutationFn: () => handleSubmit(),
    onSuccess: (_data) => {
      setName("");
      setDescription("");
      setAttribute(["", "", ""]);
      queryClient.invalidateQueries({
        queryKey: ["serviceList"],
        refetchType: "active",
        exact: true,
      });
      navigate("/services");
      toast.success("Service Has Beed Created Successfully !");
    },
    onError: (error: any) => {
      const mess = error.response?.data?.message;

      if (Array.isArray(mess)) {
        mess.forEach((msg) => toast.error(msg));
      }
      toast.error(mess);
    },
  });

  return (
    <>
      <Title size="h2" c="primary.0">
        Service Management
      </Title>
      <Paper withBorder p={20} mt={20}>
        <Group gap={5} justify="center">
          <Title c="primary.1" size="h4">
            Create New Services{" "}
          </Title>
          <MdOutlineAddCircle color="blue" size={25} />
        </Group>
        <Text mt={10} c="#878787" ta="center">
          Fill all the below details for creating a new service.
        </Text>
        <Text mt={10} c="primary.0" fw={700}>
          Service Title
        </Text>
        <Input
          onChange={(e) => setName(e.target.value)}
          mt={10}
          value={name}
          placeholder="Provide a title for your new service"
        />
        <Text mt={10} c="primary.0" fw={700}>
          Service Description
        </Text>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mt={10}
          placeholder="Provide a short description of your service"
        />

        <Text mt={10} c="primary.0" fw={700}>
          Add Attribute
        </Text>
        <Paper mt={10} withBorder p={10}>
          <Text c="textcolor.0" mt={10}>
            Add your service attributes
          </Text>
          {attributes.map((qualification, index) => (
            <React.Fragment key={index}>
              <Text size="sm" c="textcolor.0" mt={10}>
                Attribute {index + 1}{" "}
                <TiDelete
                  color="red"
                  size={20}
                  onClick={() =>
                    setAttribute((prev) => {
                      const newAttributes = [...prev];
                      newAttributes.splice(index, 1);
                      return newAttributes;
                    })
                  }
                />
              </Text>
              <Input
                value={qualification}
                onChange={(e) =>
                  handleQualificationChange(index, e.target.value)
                }
                mt={10}
                placeholder="Enter Your First Attribute"
              />
            </React.Fragment>
          ))}
          <Button
            onClick={() => setAttribute((prev) => [...prev, ""])}
            variant="default"
            mt={10}
            rightSection={<IoMdAdd />}
          >
            Add More
          </Button>
        </Paper>
        <Center>
          <Button
            bg={isPending ? "btncolor.1" : "btncolor.1"}
            loading={isPending}
            onClick={() => mutate()}
            mt={20}
          >
            Create
          </Button>
          {/* <ToastContainer /> */}
        </Center>
      </Paper>
    </>
  );
};

export default CreateService;
