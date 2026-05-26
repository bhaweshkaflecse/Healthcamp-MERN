import {
  Alert,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getIndividualPackageAPI,
  rejectPackageAPI,
  showPackageAPI,
  verifyPackageAPI,
} from "../../../api/enrollment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { MdOutlineVerified } from "react-icons/md";
import { useState } from "react";
import { axiosPrivateInstance } from "../../../api";
import { AxiosError } from "axios";

const PackageVerify = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state?.state;
  console.log(state);

  const [opened, { close }] = useDisclosure(false);
  const [openedd, { open: openDropdown, close: closeDropdown }] =
    useDisclosure(false);
  const [comment, setComment] = useState("invalidate document");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const VerifyPackage = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        `${verifyPackageAPI}/${id}`
      );
      return resp.data;
    } catch (err) {
      console.error("Error occurred while verifying package", err);
      throw err;
    }
  };

  const { mutate: verify, isPending: isVerifyLoading } = useMutation({
    mutationKey: ["verifyPackage"],
    mutationFn: VerifyPackage,
    onSuccess: () => (
      toast.success("Package has been Approved Successfully"),
      navigate("/package-request"),
      queryClient.invalidateQueries({
        queryKey: ["verifyPackages", state],
        exact: true,
        refetchActive: true,
      })
    ),
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const RejectPackage = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        `${rejectPackageAPI}/${id}`,
        {
          comment: comment,
        }
      );
      return resp.data;
    } catch (err) {
      console.error("Error occurred while rejecting package", err);
      throw err;
    }
  };

  const { mutate: reject, isPending: isRejectLoading } = useMutation({
    mutationKey: ["rejectPackage"],
    mutationFn: RejectPackage,
    onSuccess: () => (
      toast.success("Package has been rejected successfully"),
      queryClient.invalidateQueries({
        queryKey: ["verifyPackages", state],
        exact: true,
        refetchActive: true,
      }),
      navigate("/package-request")
    ),
    onError: (error) => toast.error(error.message),
  });

  const DisplayPackage = async () => {
    try {
      const resp = await axiosPrivateInstance.get(
        `${getIndividualPackageAPI}/${id}`
      );

      return resp.data;
    } catch (err) {
      console.error("Error occurred while fetching package details", err);
      throw err;
    }
  };

  const {
    data,
    isLoading: isFetching,
    error,
  } = useQuery({
    queryKey: ["getPackageDetails", id],
    queryFn: DisplayPackage,
    enabled: !!id,
  });

  console.log(data);
  const ShowPaymentDetails = async () => {
    try {
      const resp = await axiosPrivateInstance.get(
        `${showPackageAPI}/${id}`,
        {}
      );
      return resp.data;
    } catch (err) {
      console.log("Error Occurred", err);
      throw err;
    }
  };

  const { data: details } = useQuery({
    queryKey: ["showPackage"],
    queryFn: ShowPaymentDetails,
    enabled: !!id,
  });

  if (isFetching) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert variant="light" color="red" title="Error Occurred">
        {/* @ts-ignore */}
        {error?.response?.data?.message || "Error Occurred"}
      </Alert>
    );
  }

  return (
    <Box>
      <Title size="h2" c="#6092FE">
        Package Request
      </Title>

      <Paper p={40} withBorder>
        <Text c="blue" fw="bold" mb={20}>
          Package Purchase Requests Details
        </Text>

        <Paper p={20} withBorder>
          <Flex gap="md" justify="center" align="center" my={20}>
            <Avatar src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" />
            <Text c="blue">{data?.client?.name}</Text>
          </Flex>

          <Text my={20} fw="bold" c="blue" size="xl" ta="center">
            {data?.package?.name}
          </Text>

          <Flex justify="center">
            <Image width={200} h={200} my={40} src={data?.payment?.proof} />
          </Flex>

          <Box py={10} px={20} bg="#E5ECFA">
            <Text fw="bold">No. of Participants</Text>
            <Text c="dimmed">{data?.participant}</Text>
          </Box>

          <Flex align="center" py={10} px={20} my={20} bg="#E5ECFA" gap={30}>
            <Box>
              <Text fw="bold">Total Payment</Text>
              <Text c="dimmed">Rs. {data?.payment?.price}</Text>
            </Box>

            <Box>
              <Text fw="bold">Payment Status</Text>
              {data?.payment?.status == "approved" ? (
                <Text c="green">Approved by Finance</Text>
              ) : (
                <Text c="yellow">{data?.payment?.status}</Text>
              )}
            </Box>
            <Modal size="lg" opened={opened} onClose={close}>
              <Text c="primary.0" size="xl" my={8}>
                Payment Details
              </Text>
              <Paper p={20} withBorder>
                <Flex justify="space-between" align="center">
                  <Flex gap="md">
                    <Image
                      fit="contain"
                      radius="sm"
                      w={100}
                      src={details?.payment?.proof}
                    />

                    <Box>
                      <Text size="xs" c="dimmed">
                        Name
                      </Text>
                      <Text>{details?.client?.name}</Text>
                    </Box>
                  </Flex>
                  <Flex p={8} bg="#E5ECFA" align="center" gap="sm">
                    <MdOutlineVerified color="blue" size={20} />
                    <Text>Rs. {details?.payment?.price}</Text>
                  </Flex>
                </Flex>

                <Divider my={20} />

                <Flex justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed">
                      Payment ID
                    </Text>
                    <Text>{details?.payment?.id}</Text>
                  </Box>

                  <Box>
                    <Text size="xs" c="dimmed">
                      Payment Method
                    </Text>
                    <Text>{details?.payment?.medium}</Text>
                  </Box>
                </Flex>

                <Flex mt={40} justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed">
                      Package
                    </Text>
                    <Text>{details?.package?.name}</Text>
                  </Box>

                  <Box>
                    <Text size="xs" c="dimmed">
                      Payment Status
                    </Text>
                    {details?.status == "approved" ? (
                      <Text c="green">Approved</Text>
                    ) : (
                      <Text c="red">Not Approved</Text>
                    )}
                  </Box>
                </Flex>
              </Paper>
            </Modal>
          </Flex>

          {location.state?.state !== "approved" && state !== "reject" && (
            <Flex my={20} gap="lg" justify="center">
              <Button
                loading={isVerifyLoading}
                color="green"
                onClick={() => verify()}
              >
                Approve
              </Button>
              <Modal size="lg" opened={openedd} onClose={closeDropdown}>
                <Text>Reason:</Text>
                <Box>
                  <Paper p={10} withBorder>
                    <Textarea
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />

                    <Group mt={20} justify="right">
                      <Button
                        loading={isRejectLoading}
                        onClick={() => reject()}
                        bg="green"
                      >
                        Submit
                      </Button>
                      <Button onClick={closeDropdown} bg="red">
                        Cancel
                      </Button>
                    </Group>
                  </Paper>
                </Box>
              </Modal>
              <Button color="red" onClick={openDropdown}>
                Deny
              </Button>
            </Flex>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default PackageVerify;
