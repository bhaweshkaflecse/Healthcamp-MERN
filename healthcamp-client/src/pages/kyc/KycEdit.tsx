import { Button, Center, Paper, Text, TextInput, Title } from "@mantine/core";
import { ImageDropZone } from "../../components/ImageDropZone";
import ErrorAxios from "../../components/ErrorAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { clientinfo } from "../../api/auth";
import { deleteKycImage, updatekyc } from "../../api/kyc";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const KycEdit = () => {
  const [formData, setFormData] = useState<any>({
    province: "",
    city: "",
    streetAddress: "",
    document: null,
  });
  const [localImages, setLocalImages] = useState<{ file: File; url: string }[]>([]);
  const queryClient = useQueryClient();


  useEffect(() => {
    if (formData.document) {
      setLocalImages((prev) => [...prev, ]);
    }
  }, [formData.document]);

  const { isLoading, data, error } = useQuery({
    queryKey: ["kycStatus"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(clientinfo, {});
      return response.data;
    },
    
  });

  useEffect(() => {
    if (data) {
      setFormData({
        province: data?.kyc?.province || "",
        city: data?.kyc?.city || "",
        streetAddress: data?.kyc?.streetAddress || "",
        document: data?.kyc?.document || null,
      });
    }
  
    if (data?.kyc?.kycDocument && data.kyc.kycDocument.length > 0) {
      const images = data.kyc.kycDocument.map((doc:any) => ({
        file: null, 
        url: doc.document,
        id: doc.id
      }));
      setLocalImages(images);
    }
  }, [data]);
  


  const imagesArray = localImages?.map((imageOnly) =>(
    imageOnly?.file
  ))

  console.log('image array', imagesArray)

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleUpload = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), 
    }));
  
    setLocalImages((prev) => [...prev, ...newImages]);
  };
  
  const KycUpdate = async () => {
    const form = new FormData();
    form.append("province", formData.province);
    form.append("city", formData.city);
    form.append("streetAddress", formData.streetAddress);

    // const documents = [];

    const filteredImages = localImages.filter((image) => image.file !== null && image.file !== undefined);


    filteredImages.forEach((image) => {
      form.append("documents", image.file);
    });
  
   



    const resp = await axiosPrivateInstance.patch(updatekyc, form,{
      headers:{
        "Content-Type": "multipart/form-data"
      }
    });
    return resp.data;
  };


  const kycImageDelete = async (imageId:string) =>{
    const resp = await axiosPrivateInstance.delete(`${deleteKycImage}/${imageId}`)
    return resp.data
  }

  const { mutate: deleteKycImageMutation } = useMutation({
    mutationKey: ['kyc-image-delete'],
    mutationFn: kycImageDelete,
    onSuccess: () =>{
      toast.success("Image has been deleted successfully!");
      queryClient.invalidateQueries({
        queryKey:['userInfo'],
        exact:true
      })
    }
  });


  const { mutate, isPending } = useMutation({
    mutationKey: ["kyc-update"],
    mutationFn: KycUpdate,
    onSuccess: () =>{
      toast.success("KYC photos have been updated successfully!")
    }
  });

  const handleSubmit = () => {
    mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  return (
    <Paper p={20} withBorder>
      <Title size="h4">Edit KYC</Title>
      <Paper mt={10} p={20} withBorder>
        <Text mt={10}>Province</Text>
        <TextInput
          mt={5}
          placeholder="Please enter your province"
          value={formData.province}
          onChange={(e) => handleChange("province", e.target.value)}
        />

        <Text mt={10}>City</Text>
        <TextInput
          mt={5}
          placeholder="Please enter your city"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />

        <Text mt={10}>Street Address</Text>
        <TextInput
          mb={30}
          placeholder="Please enter your street address"
          value={formData.streetAddress}
          onChange={(e) => handleChange("streetAddress", e.target.value)}
        />

        <ImageDropZone
          onUpload={handleUpload}
          deleteKycImage={deleteKycImageMutation}
           //@ts-ignore
          existingImages={localImages.map((img) => img)} 
          onReject={(files) => console.log("Rejected files:", files)}
          maxSize={10 * 1024 ** 2}
        />

        <Center>
          <Button loading={isPending} bg="btncolor.0" mt={20} onClick={handleSubmit}>
            Update
          </Button>
        </Center>
      </Paper>
    </Paper>
  );
};

export default KycEdit;
