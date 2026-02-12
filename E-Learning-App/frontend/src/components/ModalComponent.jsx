import React from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,} from "@heroui/react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";

export default function ModalComponent({title,
                                       mainText,
                                       secondaryText = null,
                                       isOpen,
                                       onClose,
                                       confirmButtonclickHandler = ()=>{},
                                       declineButtonclickHandler = onClose,
                                       signInFlag = false,  // if signInFlag is true, a different confirmation button is rendered
                                       confirmButtonText,
                                       declineButtonText}) {



    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} className="">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-black text-white ">{title}</ModalHeader>
                        <ModalBody>
                            <p>{mainText}</p>
                            {secondaryText && <p>{secondaryText}</p>}
                            {/*<p>
                                Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                                adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                                officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                                nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                                deserunt nostrud ad veniam.
                            </p>*/}
                        </ModalBody>
                        <ModalFooter>
                            <Button  variant="faded" onPress={declineButtonclickHandler}>
                                {declineButtonText}
                            </Button>
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

