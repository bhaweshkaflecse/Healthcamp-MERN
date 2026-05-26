import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Input,
  Loader,
  NumberInput,
  Paper,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { CiCircleMinus } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdOutlineAddCircle } from "react-icons/md";
import {
  getpackagebyid,
  updateImage,
  updatepackage,
} from "../../../api/package";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

interface PriceType {
  min: number;
  max: number;
  price: number;
}

interface ServiceType {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  price: PriceType[];
  service: ServiceType[];
  description: string;
}

const EditPackage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);

  const [dataToShow, setDataToShow] = useState<FormData>({
    name: "",
    price: [],
    service: [],
    description: "",
  });

  const {
    isLoading: gettingDataLoad,
    data: packageData,
    error: ErrorToGet,
  } = useQuery({
    enabled: !location.state,
    queryKey: [`package/${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getpackagebyid}/${id}`,
        {}
      );
      return response.data;
    },
  });
  const [imageURL, setImageURL] = useState(packageData?.img || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log(packageData);

  useEffect(() => {
    if (location.state) {
      setDataToShow({
        name: location.state?.name || "",
        price: location.state?.price || [],
        service: location.state?.service || [],
        description: location.state?.description || "",
      });
    } else {
      setDataToShow(packageData);
    }
  }, [gettingDataLoad, location.state]);
  const handleEdit = async () => {
    const servicePayload = dataToShow.service?.map((item) => item.id);
    const body = {
      name: dataToShow.name,
      description: dataToShow.description,
      prices: dataToShow.price,
      services: servicePayload,
    };
    await axiosPrivateInstance.patch(`${updatepackage}/${id}`, body);
  };

  const { mutate: updateMutate, isPending: editButtonPending } = useMutation({
    mutationFn: handleEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageList"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [`package/${id}`],
        refetchType: "active",
        exact: true,
      });
      toast.success("Updated Package successfully");
      navigate("/package");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDeleteService = (index: number) => {
    setDataToShow((prev) => ({
      ...prev,
      service: prev.service.filter((_, idx) => idx !== index),
    }));
  };

  const handleDeletePrice = (index: number) => {
    setDataToShow((prev) => ({
      ...prev,
      price: prev.price.filter((_, idx) => idx !== index),
    }));
  };

  const handleDocumentUpload = (files: File[]) => {
    const file = files[0];
    setSelectedFile(file); // Store the file
    const imageUrl = URL.createObjectURL(file);
    setImageURL(imageUrl);
  };
  const handleDocumentUploads = async (file: File) => {
    const formData = new FormData();
    formData.append("img", file);

    const response = await axiosPrivateInstance.patch(
      `${updateImage}/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  };

  const { mutate: updateImageMutate, isPending: updateImageLoading } =
    useMutation({
      mutationFn: handleDocumentUploads,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`package/${id}`],
          refetchType: "active",
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: [`packagList`],
          refetchType: "active",
          exact: true,
        });
        toast.success("Updated Image successfully");
        navigate("/package");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

  console.log("Uploading file:", selectedFile);

  if (gettingDataLoad) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  if (ErrorToGet) {
    return (
      <Alert variant="light" color="red" title="Error Occurred">
        {ErrorToGet.message}
      </Alert>
    );
  }

  return (
    <>
      <Title size="h2" c="primary.0">
        Package Management
      </Title>
      <Paper withBorder p={20} mt={20}>
        <Group gap={5} justify="center">
          <Title c="primary.1" size="h4">
            {packageData ? "Edit Package" : "Create New Package"}
          </Title>
          <MdOutlineAddCircle color="blue" size={25} />
        </Group>
        <Text mt={10} c="#878787" ta="center">
          Fill all the below details{" "}
          {packageData ? "to update" : "for creating"} a package
        </Text>
        <Text mt={10} c="primary.0" fw={500}>
          Package Title
        </Text>
        <Input
          value={dataToShow?.name}
          onChange={(e) =>
            setDataToShow((prev) => ({ ...prev, name: e.target.value }))
          }
          mt={5}
          placeholder="Provide a title for your package"
        />
        <Text mt={20} c="primary.0" fw={500}>
          Package Description
        </Text>
        <Textarea
          value={dataToShow?.description}
          onChange={(e) =>
            setDataToShow((prev) => ({ ...prev, description: e.target.value }))
          }
          mt={5}
          placeholder="Provide a short description of your package"
        />
        <Text mt={20} c="primary.0" fw={500}>
          List of Services
        </Text>
        <Paper withBorder p={20} mt={5}>
          <Paper mt={10} p={20} withBorder>
            {dataToShow?.service?.map((item, index) => (
              <Flex key={index} justify="space-between">
                <Text>{item.name}</Text>
                <CiCircleMinus
                  color="red"
                  size={20}
                  onClick={() => handleDeleteService(index)}
                />
              </Flex>
            ))}
          </Paper>
          <Group mt={20} justify="right">
            <Button
              onClick={() =>
                navigate("/package-services", {
                  state: { data: dataToShow, path: location.pathname },
                })
              }
              bg="primary.0"
              rightSection={<IoMdAdd size={16} />}
            >
              Add Service
            </Button>
          </Group>
        </Paper>
      </Paper>

      <Text mt={20} c="primary.0" fw={500}>
        Set Prices
      </Text>
      <Paper mt={10} withBorder p={20}>
        {dataToShow?.price?.map((item, index) => (
          <React.Fragment key={index}>
            <Group mt={20}>
              <Text c="dimmed">Price from:</Text>
              <NumberInput
                value={item.min}
                min={0}
                onChange={(value) =>
                  setDataToShow((prev) => ({
                    ...prev,
                    price: prev.price.map((price, idx) =>
                      idx === index ? { ...price, min: +value } : price
                    ),
                  }))
                }
                w={100}
              />
              <Text c="dimmed">to</Text>
              <NumberInput
                value={item.max}
                min={0}
                onChange={(value) =>
                  setDataToShow((prev) => ({
                    ...prev,
                    price: prev.price.map((price, idx) =>
                      idx === index ? { ...price, max: +value } : price
                    ),
                  }))
                }
                w={100}
              />
              <CiCircleMinus
                color="red"
                size={20}
                onClick={() => handleDeletePrice(index)}
              />
            </Group>

            <NumberInput
              value={item.price}
              min={0}
              onChange={(value) =>
                setDataToShow((prev) => ({
                  ...prev,
                  price: prev.price.map((price, idx) =>
                    idx === index ? { ...price, price: +value } : price
                  ),
                }))
              }
              placeholder="Enter price"
              mt={10}
            />
          </React.Fragment>
        ))}
        <Center>
          <Button
            onClick={() =>
              setDataToShow((prev) => ({
                ...prev,
                price: [...prev.price, { min: 0, max: 0, price: 0 }],
              }))
            }
            rightSection={<IoMdAdd size={16} />}
            mt={20}
            bg="primary.0"
          >
            Add More Prices
          </Button>
        </Center>

        <Text mt={20} c="primary.0" fw={500}>
          Package Picture
        </Text>
        <Paper mt={10} withBorder w={500} p={20}>
          <Group ta="center" mt={10} align="top" justify="space-between">
            <Dropzone
              onDrop={(file) => handleDocumentUpload(file)}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
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
            <MdDelete color="red" size={20} onClick={() => setImageURL("")} />
          </Group>
        </Paper>
        <Center>
          <Button
            mt={10}
            loading={updateImageLoading}
            onClick={() => {
              if (!selectedFile) {
                toast.error("Please select an image first");
                return;
              }
              updateImageMutate(selectedFile); // Ensure we send the actual File object
            }}
            bg="primary.0"
          >
            Upload Image
          </Button>
        </Center>
      </Paper>

      <Center mt={20}>
        <Button
          mt={20}
          bg="primary.1"
          onClick={() => updateMutate()}
          disabled={editButtonPending}
        >
          {editButtonPending ? "Updating..." : "Update Package"}
        </Button>
      </Center>
    </>
  );
};

export default EditPackage;
