import {
  Box,
  Paper,
  Text,
  Flex,
  Image,
  Grid,
  Space,
  Divider,
  Title,
  Group,
  Button,
  Modal,
  Textarea,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getclient } from "../../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { rejectkyc, verifyKyc } from "../../../api/team";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const ClientDetailsKyc = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState("");

  const { data, error, isLoading } = useQuery({
    queryKey: ["kycPendingClient", id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getclient}/${id}`, {});
      return response.data;
    },
  });

  const handleSubmit = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(`${verifyKyc}/${id}`);
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kycPendingClient", id],
        refetchType: "active",
        exact: true,
      });
      toast.success("KYC Status Updated Successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDeclingKyc = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(`${rejectkyc}/${id}`, {
        comment: message, // Sending the rejection message
      });
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending: isPendingKycReject, mutate: mutateKycReject } =
    useMutation({
      mutationFn: handleDeclingKyc,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["kycPendingClient", id],
          refetchType: "active",
          exact: true,
        });
        toast.success("KYC Rejected Successfully");
        navigate("/team-kyc");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
  }

  return (
    <Box>
      <Title size="h2" c="#6092FE">
        KYC Approval Status
      </Title>

      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Title order={3} mb={10}>
          Decline Reason
        </Title>
        <Textarea
          placeholder="Type your reason for declining the KYC..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={5}
        />
        <Group align="right" mt={20}>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            bg="red"
            loading={isPendingKycReject}
            onClick={() => {
              mutateKycReject();
              close();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Paper mt={10} p={20} withBorder>
        <Group justify="space-between">
          <Title size="h3" c="dimmed">
            Client Details
          </Title>
          {data?.kyc.kycStatus === "pending" && (
            <Group>
              <Button
                loading={isPending}
                onClick={() => mutate()}
                bg="btncolor.1"
              >
                Accept
              </Button>

              <Button bg="red" loading={isPendingKycReject} onClick={open}>
                Decline
              </Button>
            </Group>
          )}
        </Group>

        <Grid>
          <Grid.Col p={20} span={{ base: 12, md: 12, lg: 8.5 }} mt={10}>
            <Paper withBorder>
              <Flex justify="space-between" p={20}>
                <Box p={10}>
                  <Text fw={500} size="md">
                    Contact Information
                  </Text>

                  <Space h="md" />
                  <Text>Name</Text>
                  <Text mt={4} c="dimmed">
                    {data?.name}
                  </Text>

                  <Space h="md" />
                  <Text>Email</Text>
                  <Text mt={4} c="dimmed">
                    {data?.email}
                  </Text>

                  <Space h="md" />
                  <Text>Contact</Text>
                  <Text c="dimmed">{data?.contact}</Text>
                </Box>

                <Divider orientation="vertical" />

                <Box>
                  <Text fw={500} size="md">
                    Address Information
                  </Text>
                  <Space h="md" />

                  <Flex direction="column" gap="md">
                    <Box>
                      <Text>Province/State </Text>
                      <Text c="dimmed">{data?.kyc?.province}</Text>
                    </Box>

                    <Box>
                      <Text>Street Address</Text>
                      <Text c="dimmed">{data?.kyc?.streetAddress}</Text>
                    </Box>

                    <Box>
                      <Text>City </Text>
                      <Text c="dimmed">{data?.kyc?.city}</Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Paper>
          </Grid.Col>

          <Grid.Col ml={9} span={11.4}>
            <Paper p={18} withBorder>
              <Text fw={500} size="md" mt={30}>
                Document Details
              </Text>
              <Flex direction="row" justify="space-between" w="42%">
                <Box mt={20}>
                  <Text>Document Type</Text>
                  <Text c="dimmed">{data?.kyc?.documentType}</Text>
                </Box>
              </Flex>

              <Flex justify="space-between" mt={30}>
                <Box>
                  <Text>Registration Document Images:</Text>
                  <Flex gap="xl">
                    {data?.kyc?.kycDocument?.map((kycDoc: any) => (
                      <Image
                        w={80}
                        src={kycDoc?.document}
                        key={kycDoc.document}
                      />
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ClientDetailsKyc;
