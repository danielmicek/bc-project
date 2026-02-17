import React from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,} from "@heroui/react";

export default function DetailsModal({
                                         textArray,
                                         isOpen,
                                         onClose}) {

    return (
        <Modal className="max-w-3xl w-[95%]" backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-black text-white ">Detaily</ModalHeader>

                        <ModalBody>
                            <ul className="list-disc ml-5 mt-5 text-lg space-y-3">
                                {textArray.map((textComponent, index) =>
                                    React.cloneElement(textComponent, { key: index })
                                )}
                            </ul>
                        </ModalBody>

                        <ModalFooter>
                            <Button  variant="faded" onPress={onClose}>
                                Zatvoriť
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

