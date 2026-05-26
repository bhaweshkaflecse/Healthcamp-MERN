import { useState } from "react";
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
import { axiosPrivateInstance } from "../../api";
import { createTicketAPI } from "../../api/itTeam";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TicketForm = () => {
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["post-file"],
    mutationFn: async () => {
      if (!title || !description || uploadedImages.length === 0) {
        throw new Error("Please enter all the details");
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      uploadedImages.forEach((image) => formData.append("files", image.file));

      const resp = await axiosPrivateInstance.post(createTicketAPI, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Ticket has been created successfully!");
      setTitle("");
      queryClient.invalidateQueries({
        queryKey:['get-all-tickets'],
        exact:true
      })
      setDescription("");
      setUploadedImages([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create ticket");
    },
  });

  function ImageDrop(props: Partial<DropzoneProps>) {
    const handleDrop = (files: File[]) => {
      const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index: number) => {
      setUploadedImages((prev) => {
        const newImages = [...prev];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        return newImages;
      });
    };

    return (
      <Box mt="xl">
        <Dropzone
          style={{ cursor: "pointer" }}
          onDrop={handleDrop}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...props}
        >
          <Paper withBorder>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
             
              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach multiple files, each should not exceed 5MB
                </Text>
              </div>
            </Group>
          </Paper>
        </Dropzone>

        <Group mt="md">
          {uploadedImages.map((image, index) => (
            <Box key={index} style={{ position: "relative" }}>
              <Image src={image.preview} width={100} height={100} radius="md" />
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
      <Title c="primary.2" size="h4">
        Add Ticket Details
      </Title>
      <Paper withBorder p={20} mt={10}>
        <Text c="primary.2" mt={10}>
          Title
        </Text>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} mt={5} placeholder="Enter your title" />

        <Text c="primary.2" mt={10}>
          Ticket Description
        </Text>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your ticket description" />

        <ImageDrop />

        <Center>
          <Button loading={mutation.isPending} bg="btncolor.0" mt={20} onClick={() => mutation.mutate()}>
            Submit
          </Button>
        </Center>
      </Paper>
    </Box>
  );
};

export default TicketForm;