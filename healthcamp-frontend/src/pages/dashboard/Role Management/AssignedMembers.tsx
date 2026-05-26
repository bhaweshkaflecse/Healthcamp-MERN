import { useState } from 'react';
import { Button, Checkbox, Divider, Group, Input, Pagination, Paper, ScrollArea, Text, Title } from "@mantine/core";
import { CiFilter, CiSearch } from "react-icons/ci";
import { Table } from '@mantine/core';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { assigneddata } from "../rough/Rough";

const AssignedMembers = () => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate start and end indexes for items on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    // Slice the data array to get only the items for the current page
    const currentPageData = assigneddata.slice(startIndex, endIndex);

    const rows = currentPageData.map((element) => (
        <Table.Tr key={element.ID}>
            <Table.Td><Checkbox /></Table.Td>
            <Table.Td>{element.ID}</Table.Td>
            <Table.Td>{element.fullname}</Table.Td>
            <Table.Td>{element.email}</Table.Td>
            <Table.Td>{element.roles}</Table.Td>
            <Table.Td>
                <Group>
                    <FaEdit size={25} color="blue" />
                    <MdDelete size={25} color="red" />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Title size='h2' c='#6092FE'>Role Management</Title>
            <Paper mt={10} withBorder p={10}>
                <Group justify="space-between">
                    <Title size='h3'>Assigned Members</Title>
                    <Group justify="flex-end">
                        <Input variant='filled' radius={10} placeholder="Search by Name or Email" leftSection={<CiSearch size={16} />} />
                        <Button variant="default" radius={10} leftSection={<CiFilter size={16} />}>Filter</Button>
                    </Group>
                </Group>
                <ScrollArea>
                    <Table mt={10} verticalSpacing='sm' withRowBorders={false}>
                        <Table.Thead>
                            <Table.Tr bg='#F3F6F9'>
                                <Table.Th>#</Table.Th>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Full Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Roles</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </ScrollArea>
                <Divider my='lg' />
                <Group justify="space-between">
                    <Text>Showing {startIndex + 1}-{Math.min(endIndex, assigneddata.length)} of {assigneddata.length} results</Text>
                    <Pagination total={Math.ceil(assigneddata.length / itemsPerPage)} onChange={handlePageChange} />
                </Group>
            </Paper>
        </>
    );
};

export default AssignedMembers;
