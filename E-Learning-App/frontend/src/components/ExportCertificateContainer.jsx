import React, {useState} from "react";
import {Button} from "@heroui/react";
import {PDFDownloadLink} from "@react-pdf/renderer";
import Certificate from "./Certificate.jsx";
import {GET_getCertificateByUsername, POST_postCertificate} from "../methods/fetchMethods.js";
import {getUniqueTestID} from "../methods/methodsClass.js";
import {useAuth, useUser} from "@clerk/clerk-react";

export default function ExportCertificateContainer({
    text,
    certificateStatus
}) {
    const [certificate, setCertificate] = useState(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const { getToken } = useAuth();
    const {user} = useUser();

    async function clickHandler() {
        setIsPreparing(true);

        const foundCertificate = await GET_getCertificateByUsername(user.username, user.id, getToken);

        if (foundCertificate.certificateFound) {
            setCertificate({
                certificateId: foundCertificate.certificateId,
                owner: foundCertificate.certificateOwner,
                timestamp: foundCertificate.timestamp,
                percentage: foundCertificate.percentage
            });
        } else {
            const certId = getUniqueTestID("ELC");
            const timestamp = new Date().toISOString().slice(0, 10);
            const newCertificate = {
                certificateId: certId,
                owner: user.username,
                timestamp,
                percentage: certificateStatus.percentage
            };

            setCertificate(newCertificate);
            await POST_postCertificate(certId, user.username, user.id, timestamp, certificateStatus.percentage, getToken);
        }

        setIsPreparing(false);
    }

    return (
        <div id="EXPORT_CERT" className="flex md:flex-row flex-col items-center justify-between mt-20 gap-5 w-[90%]
        bg-gray-600 shadow-[5px_10px_30px_rgba(252,147,40,0.5)] rounded-lg border-2 border-(--main-color-orange) px-10
        py-3 hover:shadow-[5px_10px_30px_rgba(252,147,40,0.8)]">
            <p className="font-bold text-white">{text}</p>
            {!certificate ? (
                <Button
                    isDisabled={!certificateStatus.enabled || isPreparing}
                    variant="light"
                    className="bg-(--main-color-orange) font-bold px-15"
                    onPress={() => clickHandler()}
                >
                    {isPreparing ? "Generuje sa..." : "Generovať certifikát"}
                </Button>
            ) : (
                <PDFDownloadLink
                    document={
                        <Certificate
                            certificateId={certificate.certificateId}
                            userName={certificate.owner}
                            timestamp={certificate.timestamp}
                            percentage={certificate.percentage}
                        />
                    }
                    fileName="eleonore_certificate.pdf"
                >
                    {({ loading }) => (
                        <Button
                            variant="light"
                            className="bg-(--main-color-orange) font-bold px-15"
                            isDisabled={loading}
                        >
                            {loading ? "Certifikát sa načítava" : "Stiahnuť certifikát"}
                        </Button>
                    )}
                </PDFDownloadLink>
            )}
        </div>
    );
}
