import {
  Button,
  Center,
  Group,
  Input,
  NumberInput,
  Paper,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { createpackage } from "../../../api/package";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { CiCircleMinus } from "react-icons/ci";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";

const CreatePackage = (props: Partial<DropzoneProps>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  interface PriceType {
    min: number;
    max: number;
    price: number;
  }

  interface ServiceType {
    id: string;
    name: string;
  }

  interface FormDataType {
    name: string;
    price: PriceType[];
    service: ServiceType[];
    description: string;
    document?: File;
  }

  const [formData, setFormData] = useState<FormDataType>({
    name: location.state?.name || "",
    price: location.state?.price || [],
    service: location.state?.service || [],
    description: location.state?.description || "",
  });
  const [imageURL, setImageURL] = useState("");

  // ================ API ==============
  const handleSubmit = async () => {
    const servicePayload = formData.service.map((item) => item.id);
    const body = {
      name: formData.name,
      description: formData.description,
      img: formData.document,
      prices: formData.price,
      services: servicePayload,
    };

    if (
      !body.name ||
      !body.description ||
      !body.prices.length ||
      !body.services.length ||
      !body.img
    ) {
      toast.error("Insufficient payload");
    }
    try {
      console.log(body);
      const resp = await axiosPrivateInstance.post(createpackage, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("resp:", resp.data);
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending, mutate: mutateCreatePackage } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packagList"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Created Package successfully");
      navigate("/package");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  // =======================================
  const handleDocumentUpload = (files: File[]) => {
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      document: file,
    }));

    const imageUrl = URL.createObjectURL(file);
    setImageURL(imageUrl);
  };

  const reduceService = (id: string) => {
    const newArray = formData.service.filter((item) => item.id !== id);
    setFormData((prev) => ({
      ...prev,
      service: newArray,
    }));
  };

  return (
    <>
      <Title size="h2" c="primary.0">
        Package Management
      </Title>
      <Paper withBorder p={20} mt={20}>
        <Group gap={5} justify="center">
          <Title c="primary.1" size="h4">
            Create New Package
          </Title>
          <MdOutlineAddCircle color="blue" size={25} />
        </Group>
        <Text mt={10} c="#878787" ta="center">
          Fill all the below details for creating a new package
        </Text>
        <Text mt={10} c="primary.0" fw={500}>
          Package Title
        </Text>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          mt={5}
          placeholder="provide a title for your new package"
        />
        <Text mt={20} c="primary.0" fw={500}>
          Package Description
        </Text>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          mt={5}
          placeholder="provide a short description of your package"
        />
        <Text mt={20} c="primary.0" fw={500}>
          List of Services
        </Text>
        <Paper withBorder p={20} mt={5}>
          {formData.service.map((item, index) => (
            <React.Fragment key={index}>
              <Paper mt={10} p={20} withBorder>
                <Group justify="space-between">
                  <Text>{item.name}</Text>
                  <CiCircleMinus
                    color="red"
                    size={20}
                    onClick={() => reduceService(item.id)}
                  />
                </Group>
              </Paper>
            </React.Fragment>
          ))}
          <Group mt={20} justify="right">
            <Button
              bg="primary.0"
              onClick={() =>
                navigate("/package-services", {
                  state: { data: formData, path: location.pathname },
                })
              }
              rightSection={<IoMdAdd size={16} />}
            >
              Add List
            </Button>
          </Group>
        </Paper>

        <Text mt={20} c="primary.0" fw={500}>
          Set price for the packages
        </Text>
        <Paper mt={10} withBorder p={20}>
          <Text fw={500}>Price Summary Per Individual</Text>
          {formData.price.map((item, index) => (
            <React.Fragment key={index}>
              <Group mt={20}>
                <Text c="dimmed">Price:</Text>
                <Text c="dimmed"> From </Text>
                <NumberInput
                  value={item.min}
                  onChange={(value) => {
                    setFormData((prev) => {
                      const newPrice = [...prev.price];
                      newPrice[index].min = +value || 0;
                      return { ...prev, price: newPrice };
                    });
                  }}
                  w={100}
                />
                <Text c="dimmed">To </Text>
                <NumberInput
                  w={100}
                  value={item.max}
                  onChange={(value) => {
                    setFormData((prev) => {
                      const newPrice = [...prev.price];
                      newPrice[index].max = +value || 0;
                      return { ...prev, price: newPrice };
                    });
                  }}
                />
                <Text c="dimmed">Participants</Text>
              </Group>

              <NumberInput
                placeholder="Rs."
                mt={10}
                value={item.price}
                onChange={(value) => {
                  setFormData((prev) => {
                    const newPrice = [...prev.price];
                    newPrice[index].price = +value || 0;
                    return { ...prev, price: newPrice };
                  });
                }}
              />
            </React.Fragment>
          ))}
          <Center>
            <Button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  price: [...prev.price, { min: 0, max: 0, price: 0 }],
                }))
              }
              rightSection={<IoMdAdd size={16} />}
              mt={20}
              bg="primary.0"
            >
              Add More
            </Button>
          </Center>
        </Paper>
        <Text mt={20} c="primary.0" fw={500}>
          Package Picture
        </Text>
        <Paper mt={10} withBorder>
          <Dropzone
            onDrop={(file) => handleDocumentUpload(file)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            {...props}
          >
            {imageURL ? (
              <Center my={20}>
                <img
                  src={imageURL}
                  alt="Uploaded Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
              </Center>
            ) : (
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
                    Attach a picture for your package
                  </Text>
                </div>
              </Group>
            )}
          </Dropzone>
        </Paper>
        <Center>
          <Button
            disabled={isPending}
            loading={isPending}
            onClick={() => mutateCreatePackage()}
            mt={20}
            bg="primary.0"
          >
            Create Package
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default CreatePackage;
