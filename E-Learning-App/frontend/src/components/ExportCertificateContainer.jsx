import React from "react";
import {Button} from "@heroui/react";
import {PDFDownloadLink} from "@react-pdf/renderer";
import Certificate from "./Certificate.jsx";
import {POST_postCertificate} from "../methods/fetchMethods.js";
import {getUniqueTestID} from "../methods/methodsClass.js";

export default function ExportCertificateContainer({
                                                       text,
                                                       certificateEnabled,
                                                       userName,
                                                       percentage}){
    const certificateId = getUniqueTestID("ELC")

    return (
        <div className = "flex md:flex-row flex-col items-center justify-between mt-20 gap-5 w-[90%]
        bg-gray-600 shadow-[5px_10px_30px_rgba(252,147,40,0.5)] rounded-lg border-2 border-(--main-color-orange) px-10
        py-3 hover:shadow-[5px_10px_30px_rgba(252,147,40,0.8)]">
            <p className="font-bold text-white">{text}</p>
            <Button isDisabled = {!certificateEnabled} variant="light" className="bg-(--main-color-orange) font-bold px-15"
                    onPress={() => {void POST_postCertificate(certificateId)}}>
                <PDFDownloadLink document={
                    <Certificate userName={userName}
                                 percentage={percentage}
                                 certificateId={certificateId}
                    />
                } fileName="eleonore_certificate.pdf">
                    {({ loading }) =>
                        loading ? 'Certifikát sa načítava' : 'Stiahnuť certifikát'
                    }
                </PDFDownloadLink>
            </Button>
        </div>
    )
}