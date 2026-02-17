import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import React, {useRef} from "react";
import {toast, Toaster} from "react-hot-toast";
import {getCertificateById} from "../methods/fetchMethods.js";

export default function VerifyCertificateModal({title,
                                               isOpen,
                                               onClose}) {

    const inputRef = useRef(null);

    return (
        <>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />

            <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 bg-black text-white ">{title}</ModalHeader>

                            <ModalBody>
                                <form className="flex h-[55px] px-1 gap-3"
                                      onSubmit={async (event) => {
                                          event.preventDefault(); // prevent page reload
                                          const certificateFound = await getCertificateById(inputRef.current.value)
                                          if(certificateFound.certificateFound) toast.success("Platný certifikát");
                                          else toast.error("Neplatný certifikát")
                                          inputRef.current.value = "";
                                      }}
                                >
                                    <input className="col-span-6 flex w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5
                                        text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600
                                        dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500
                                        dark:focus:ring-blue-500"
                                           ref={inputRef}
                                           type="text"
                                           placeholder="Zadaj Certificate ID"
                                           pattern="^ELC-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
                                           onInvalid={(event) => {
                                               event.preventDefault();
                                               toast.error("Nesprávny formát Certificate ID")
                                           }} // show an error message when input is invalid
                                           required  // when present, it specifies that the input field must be filled out before submitting the form
                                    />
                                    <Button type="submit" variant="light" className="bg-(--main-color-orange) font-bold h-[55px] px-2">
                                        Overiť
                                    </Button>
                                </form>
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
        </>
    );
}