import { Box, Paper, Text } from '@mantine/core'
import { SlLogout } from "react-icons/sl";


const Logout = () => {
  return (
    <Box>
        <Text>Logout</Text>

        <Paper withBorder>
                <SlLogout />

        </Paper>

    </Box>
  )
}

export default Logout
