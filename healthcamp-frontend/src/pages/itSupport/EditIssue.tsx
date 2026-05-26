import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Group,
  Paper,
  Text,
  Textarea,
  TextInput,
  Title,
  Image,
  ActionIcon,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getIndividualTicketAPI, updateIndividualTicketAPI } from "../../api/itTeam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoContractSharp } from "react-icons/io5";

const EditIssue = () => {
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const ticketId = state;
  const navigate = useNavigate();

  const getIndividualTicketDetails = async () => {
    if (!ticketId) return null;
    const resp = await axiosPrivateInstance.get(`${getIndividualTicketAPI}/${ticketId}`);
    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["individual-ticket", ticketId],
    queryFn: getIndividualTicketDetails,
    enabled: !!ticketId,
  });

  useEffect(() => {
    if (data) {
      setTitle(data?.title || "");
      setDescription(data?.description || "");
      setExistingImages(data?.images?.map((img: any) => img.url) || []);
    }
  }, [data]);

  const handleRemoveExistingImage = async (imageUrl: string) => {
    try {
      await axiosPrivateInstance.delete(`${updateIndividualTicketAPI}/${ticketId}/delete-image`, {
        data: { imageUrl },
      });
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const editIndividualTicketDetails = async () => {
    if (!ticketId) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    uploadedImages.forEach((image) => {
      formData.append("images", image.file);
    });
    formData.append("existingImages", JSON.stringify(existingImages));
    await axiosPrivateInstance.patch(`${updateIndividualTicketAPI}/${ticketId}`, formData);
  };

  const { mutate } = useMutation({
    mutationKey: ["edit-tickets"],
    mutationFn: editIndividualTicketDetails,
    onSuccess: () => {
      toast.success("Ticket has been updated successfully!");
      queryClient.invalidateQueries({queryKey:["get-all-tickets"], exact:true})
      navigate('/it-dashboard')
    },
  });

  function ImageDrop(props: Partial<DropzoneProps>) {
    const handleDrop = (files: File[]) => {
      const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index: number) => {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <Box mt="xl">
        <Dropzone onDrop={handleDrop} maxSize={5 * 1024 ** 2} accept={IMAGE_MIME_TYPE} {...props}>
          <Paper withBorder>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
              

              <div>
                <Text size="xl">Drag images here or click to select files</Text>
                <Text size="sm" color="dimmed" mt={7}>
                  Attach multiple files, each should not exceed 5MB
                </Text>
              </div>
            </Group>
          </Paper>
        </Dropzone>

        <Group mt="md">
          {uploadedImages.map((image, index) => (
            <Box key={index} style={{ position: "relative" }}>
              <Image src={image.preview} radius="md" />
              <ActionIcon
                color="red"
                size="sm"
                style={{ position: "absolute", top: -5, right: -5, background: "white", borderRadius: "50%" }}
                onClick={() => handleRemoveImage(index)}
              >
                {/* <IconTrash color="red" size={16} /> */}
              </ActionIcon>
            </Box>
          ))}
        </Group>
      </Box>
    );
  }

  return (
    <Box>
      <Text>Update your ticket form here</Text>
      <Box>
        <Title size="h4">Update ticket details</Title>
        <Paper withBorder p={20} mt={10}>
          <Text>Enter Individual Participants Details</Text>
          <Text color="primary.2" mt={10}>Title</Text>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} mt={5} placeholder="Enter title" />
          <Text color="primary.2" mt={10}>Ticket Description</Text>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
          <ImageDrop />
          {existingImages.length > 0 && (
            <Group mt="md">
              {existingImages.map((img, index) => (
                <Box key={index} style={{ position: "relative" }}>
                  <Image src={img} w={100} />
                  <ActionIcon
                    color="red"
                    size="sm"
                    style={{ position: "absolute", top: -5, right: -5, background: "white", borderRadius: "50%" }}
                    onClick={() => handleRemoveExistingImage(img)}
                  >
                    <IoContractSharp color="red" size={16} />
                  </ActionIcon>
                </Box>
              ))}
            </Group>
          )}
          <Center>
            <Button bg="btncolor.0" mt={20} onClick={() => mutate()}>Submit</Button>
          </Center>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditIssue;