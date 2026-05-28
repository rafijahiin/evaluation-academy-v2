import { CertificateClient } from "@/components/certificate/CertificateClient";

export const metadata = {
  title: "Certificate of completion",
  description:
    "Your printable certificate for completing the UNFPA CPE methodology course.",
};

export default function CertificatePage() {
  return <CertificateClient />;
}
