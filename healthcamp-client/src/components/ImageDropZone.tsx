import { ActionIcon, Group, Image, Text } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

interface ImageDropZoneProps extends Partial<DropzoneProps> {
  onUpload?: (files: File[]) => void;
  existingImages?: { id: string; url: string }[]; // Adjust this to hold objects with id and url
  onDelete?: (index: number) => void;
  deleteKycImage?: (imageId: string) => void;
}

export function ImageDropZone({
  onUpload,
  existingImages,
  onDelete,
  deleteKycImage,
  ...props
}: ImageDropZoneProps) {
  // Store images with both id and url
  const [localImages, setLocalImages] = useState<{ id: string; url: string }[]>(existingImages ?? []);

  useEffect(() => {
    if (existingImages && localImages.length === 0) {
      setLocalImages(existingImages);
    }
  }, [existingImages]); 
  

  useEffect(() => {
    console.log("Updated localImages:", localImages);
  }, [localImages]);
  
  

  

  const handleDrop = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: file.name,  
      url: URL.createObjectURL(file),
    }));

    setLocalImages((prev = []) => [...prev, ...newImages]);

    if (onUpload) {
      onUpload(files);
    }
  };
  const handleDelete = (index: number, imageId: string) => {
  
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages); 
  
    if (onDelete) {
      onDelete(index); 
    }
  
    if (deleteKycImage) {
      deleteKycImage(imageId);
    }
  };
  

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        {...props}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
          
          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      <Group mt="md">
        {localImages.map((image, index) => (
         
          <div key={index} style={{ position: "relative", display: "inline-block" }}>
            <Image src={image.url} width={100} height={100} alt="Uploaded preview" />
            <button
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              onClick={() => handleDelete(index, image.id)} 
            >
              <ActionIcon color="red" variant="filled" radius="xl" size="sm">
                <MdDelete size={14} />
              </ActionIcon>
            </button>
          </div>
        ))}
      </Group>
    </>
  );
}
