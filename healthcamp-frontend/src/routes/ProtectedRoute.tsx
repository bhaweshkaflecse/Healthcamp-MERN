import PropTypes from "prop-types";
import useAuthStore from "../providers/context/useAuthStore";
import { Box, Center, Loader, Text } from "@mantine/core";

// @ts-ignore
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { role } = useAuthStore();

  if (role === null || role === undefined) {
    return (
      <Box>
        <Center>
          <Loader color="blue" />
        </Center>
      </Box>
    );
  }

  if (requiredPermission.includes(role)) {
    return children;
  }
  return (
    <Box>
      <Text c="red">Unauthorised to view this page</Text>
    </Box>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.array,
};

export default ProtectedRoute;
