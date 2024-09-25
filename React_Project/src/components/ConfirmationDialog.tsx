import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Box, Text } from "@mantine/core";

function ConfirmationDialog({
    children,
    onClick,
    title = "Confirm",
    description = "Do you really want to perform this action?",
}: {
    children: React.ReactNode;
    onClick: () => void;
    title?: string;
    description?: string;
}) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title={title} centered>
                <Text>{description}</Text>
                <Box className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" color="gray" onClick={close}>
                        Close
                    </Button>
                    <Button variant="outline" color="red" onClick={onClick}>
                        Confirm
                    </Button>
                </Box>
            </Modal>
            <Box onClick={open}>{children}</Box>
        </>
    );
}

export default ConfirmationDialog;
