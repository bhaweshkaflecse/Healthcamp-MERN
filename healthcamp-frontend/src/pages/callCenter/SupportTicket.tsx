import { Button, Input, Paper, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { postCallCenterDetailsAPI } from "../../api/callcenter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";

const SupportTicket = () => {
  const useClient = useQueryClient();
  const form = useForm({
    initialValues: {
      organizationName: "",
      phoneNumber: "",
      callType: "",
    },

    validate: {
      organizationName: (value) =>
        value ? null : "Please enter organization name",
      phoneNumber: (value) => (value ? null : "Please enter your Phone Number"),
      callType: (value) => (value ? null : "Please select call Type"),
    },
  });

  const details = {
    name: form.getValues().organizationName,
    contact: +form.getValues().phoneNumber,
    callType: form.getValues().callType,
  };

  const postCallDetails = async () => {
    const resp = await axiosPrivateInstance.post(
      postCallCenterDetailsAPI,
      details,
      {}
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["postCalls"],
    mutationFn: postCallDetails,
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["getCallsDetails"] }),
        toast.success("Added Successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Error Occurred");
      console.log(err);
    },
  });

  const handleSubmit = (values: any) => {
    mutate(values);
  };

  console.log(form.getValues());

  return (
    <>
      <Title size="h2">Support Ticket</Title>
      <Paper mt={10} p={20} withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            placeholder="Name of Organization or Full Name "
            {...form.getInputProps("organizationName")}
          />
          <Input
            mt={20}
            type="number"
            placeholder="Phone Number"
            {...form.getInputProps("phoneNumber")}
          />
          <Select
            placeholder="Select Request Type "
            {...form.getInputProps("callType")}
            mt={20}
            data={["outgoing", "incoming"]}
          />
          <Button loading={isPending} mt={20} type="submit">
            Submit
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default SupportTicket;
