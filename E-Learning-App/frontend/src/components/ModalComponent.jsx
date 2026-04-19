import React from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,} from "@heroui/react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";

export default function ModalComponent({title,
                                       mainText,
                                       secondaryText1 = null,
                                       secondaryText2 = null,
                                       secondaryText3 = null,
                                       isOpen,
                                       onClose,
                                       confirmButtonclickHandler = ()=>{},
                                       declineButtonclickHandler = onClose,
                                       signInFlag = false,  // if signInFlag is true, a different confirmation button is rendered
                                       confirmButtonText,
                                       declineButtonText = null}) {

    return (
        <Modal
            backdrop={"blur"}
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                wrapper: "z-[2000]",
                backdrop: "z-[1999]",
                base: "z-[2000]",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-black text-white ">{title}</ModalHeader>

                        <ModalBody>
                            <p>{mainText}</p>
                            {secondaryText1 && <p>{secondaryText1}</p>}
                            {secondaryText2 && <p>{secondaryText2}</p>}
                            {secondaryText3 && <p>{secondaryText3}</p>}
                        </ModalBody>

                        <ModalFooter>
                            {declineButtonText && <Button  variant="faded" onPress={declineButtonclickHandler}>
                                {declineButtonText}
                            </Button>}
                            {signInFlag ?
                                <SignedOut>
                                    <SignInButton className = "bg-(--main-color-orange) font-bold" mode={"modal"}>
                                        <Button className = "w-full h-full" onPress = {onClose}>
                                            {confirmButtonText}
                                        </Button>
                                    </SignInButton>
                                </SignedOut>
                            :
                                <Button variant="shadow" className="bg-(--main-color-orange) font-bold" onPress={confirmButtonclickHandler}>
                                    {confirmButtonText}
                                </Button>}

                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

