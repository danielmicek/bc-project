import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import ExportCertificateContainer from "./ExportCertificateContainer.jsx";
import {vi} from "vitest";

const mocks = vi.hoisted(() => ({
    getToken: vi.fn().mockResolvedValue("token"),
    getCertificateByUsername: vi.fn(),
    deleteCertificateByUsername: vi.fn(),
    postCertificate: vi.fn(),
    getUniqueTestID: vi.fn(),
    toastError: vi.fn(),
}));

vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({ getToken: mocks.getToken }),
    useUser: () => ({
        user: {
            username: "john",
            id: "user-1",
        },
    }),
}));

vi.mock("@heroui/react", () => ({
    Button: ({children, onPress, isDisabled, ...props}) => (
        <button onClick={onPress} disabled={isDisabled} {...props}>
            {children}
        </button>
    ),
}));

vi.mock("@react-pdf/renderer", () => ({
    PDFDownloadLink: ({document, children, ...props}) => (
        <div
            data-testid="pdf-download-link"
            data-certificate-id={document.props.certificateId}
            data-percentage={String(document.props.percentage)}
            {...props}
        >
            {children({loading: false})}
        </div>
    ),
}));

vi.mock("./Certificate.jsx", () => ({
    default: () => null,
}));

vi.mock("../methods/fetchMethods.js", () => ({
    GET_getCertificateByUsername: mocks.getCertificateByUsername,
    DELETE_deleteCertificateByUsername: mocks.deleteCertificateByUsername,
    POST_postCertificate: mocks.postCertificate,
}));

vi.mock("../methods/methodsClass.js", () => ({
    getUniqueTestID: mocks.getUniqueTestID,
}));

vi.mock("react-hot-toast", () => ({
    toast: {
        error: mocks.toastError,
    },
}));

describe("ExportCertificateContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a new certificate when none exists", async () => {
        mocks.getCertificateByUsername.mockResolvedValueOnce({certificateFound: false});
        mocks.getUniqueTestID.mockReturnValueOnce("ELC-new");
        mocks.postCertificate.mockResolvedValueOnce({message: "ok"});

        render(<ExportCertificateContainer text="x" certificateStatus={{enabled: true, percentage: 10.52}} />);

        fireEvent.click(screen.getByRole("button", {name: /generova/i}));

        await waitFor(() => {
            expect(mocks.postCertificate).toHaveBeenCalledWith(
                "ELC-new",
                "john",
                "user-1",
                expect.any(String),
                10.52,
                mocks.getToken,
            );
        });

        expect(mocks.deleteCertificateByUsername).not.toHaveBeenCalled();
        expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-certificate-id", "ELC-new");
        expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-percentage", "10.52");
    });

    it("reuses the existing certificate when its percentage is higher or equal", async () => {
        mocks.getCertificateByUsername.mockResolvedValueOnce({
            certificateFound: true,
            certificateId: "ELC-existing",
            certificateOwner: "john",
            timestamp: "2026-04-14",
            percentage: 12.34,
        });

        render(<ExportCertificateContainer text="x" certificateStatus={{enabled: true, percentage: 10.52}} />);

        fireEvent.click(screen.getByRole("button", {name: /generova/i}));

        await waitFor(() => {
            expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-certificate-id", "ELC-existing");
        });

        expect(mocks.deleteCertificateByUsername).not.toHaveBeenCalled();
        expect(mocks.postCertificate).not.toHaveBeenCalled();
        expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-percentage", "12.34");
    });

    it("deletes the old certificate and creates a new one when the new percentage is higher", async () => {
        mocks.getCertificateByUsername.mockResolvedValueOnce({
            certificateFound: true,
            certificateId: "ELC-old",
            certificateOwner: "john",
            timestamp: "2026-04-14",
            percentage: 9.52,
        });
        mocks.deleteCertificateByUsername.mockResolvedValueOnce({message: "deleted"});
        mocks.getUniqueTestID.mockReturnValueOnce("ELC-better");
        mocks.postCertificate.mockResolvedValueOnce({message: "ok"});

        render(<ExportCertificateContainer text="x" certificateStatus={{enabled: true, percentage: 10.52}} />);

        fireEvent.click(screen.getByRole("button", {name: /generova/i}));

        await waitFor(() => {
            expect(mocks.deleteCertificateByUsername).toHaveBeenCalledWith("john", "user-1", mocks.getToken);
            expect(mocks.postCertificate).toHaveBeenCalledWith(
                "ELC-better",
                "john",
                "user-1",
                expect.any(String),
                10.52,
                mocks.getToken,
            );
        });

        expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-certificate-id", "ELC-better");
        expect(screen.getByTestId("pdf-download-link")).toHaveAttribute("data-percentage", "10.52");
    });
});
