import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCarauselAPI } from "../../../api/carausel";
import {
  Alert,
  Box,
  Button,
  Center,
  Group,
  Image,
  Indicator,
  Loader,
  Modal,
  Paper,
  Space,
  Text,
} from "@mantine/core";
import { MdDelete } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { useState } from "react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { axiosPrivateInstance } from "../../../api";

const Carousel = (props: Partial<DropzoneProps>) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  interface formDataType {
    img: File | null;
  }
  const [formData, setFormData] = useState<formDataType>();
  const {
    isLoading,
    data,
    error: errorToGet,
  } = useQuery({
    queryKey: ["carauselList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getCarauselAPI, {});
      return response.data;
    },
  });
  console.log(data)
  const handleDelete = async () => {
    await axiosPrivateInstance.delete(`${getCarauselAPI}/${deleteId}`, {});
  };
  const addImgFunc = async () => {
    await axiosPrivateInstance.post(
      `${getCarauselAPI}`,
      {
        file: formData?.img,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const { mutate: deletePackage, isPending } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carauselList"],
        refetchType: "active",
        exact: true,
      });
      close();
      toast.success("Deleted item successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete item");
      console.log(err);
    },
  });

  const { mutate: addImg, isPending: isAddingImg } = useMutation({
    mutationFn: addImgFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carauselList"],
        refetchType: "active",
        exact: true,
      });
      close();
      toast.success("Added successfully");
      setPreviewUrl(null);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed to add item");
    },
  });

  const handleDocumentUpload = (files: File[]) => {
    setFormData({
      img: files[0],
    });
    setPreviewUrl(URL.createObjectURL(files[0]));
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  return (
    <>
      {errorToGet && (
        <Alert variant="light" color="red" title="Error in fetching data">
          {errorToGet.message}
        </Alert>
      )}
      <Group>
        {data?.map((item: any) => {
          return (
            <Group key="item._id">
              <Indicator
                inline
                color="none"
                label={
                  <MdDelete
                    color="red"
                    size={20}
                    onClick={() => {
                      setDeleteId(item._id);
                      open();
                    }}
                  />
                }
                size={16}
              >
                <Image src={item?.img} w={100} />
              </Indicator>
            </Group>
          );
        })}
      </Group>
      <Space h="xl" />
      {previewUrl ? (
        <Paper withBorder p="md">
          <Center>
            <Image
              src={previewUrl}
              alt="Uploaded document"
              style={{ width: "250px", height: "250px" }}
            />
          </Center>
          <Button onClick={() => addImg()} loading={isAddingImg}>
            Submit
          </Button>
          <Button ml="md" bg="red" onClick={() => setPreviewUrl(null)}>
            Remove
          </Button>
        </Paper>
      ) : (
        <Paper mt={10} withBorder>
          <Dropzone
            onDrop={(file) => handleDocumentUpload(file)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            {...props}
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
                  Attach a picture for your package
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Paper>
      )}
      <Modal opened={opened} onClose={close}>
        <Center>
          <CgDanger size={25} color="red" />
        </Center>
        <Text mt={10} fw={600} ta="center">
          Are you sure you want to delete?
        </Text>
        <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
          The action of deletion cannot be undone. Are you sure you want to
          proceed deleting this service?
        </Text>
        <Group mt={20} justify="center">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={() => deletePackage()}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default Carousel;
