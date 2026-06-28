import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

interface VerificationEmailProps {
  username?: string;
  otp?: string;
  appName?: string;
}

export default function VerificationEmail({
  username = "Himanshu",
  otp = "483921",
  appName = "Mystery Message",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your ${appName} verification code is ${otp}`}</Preview>

      <Body style={main}>
        <Container style={wrapper}>
          <Section style={card}>
            <Section style={accentBar} />

            <Section style={brandWrap}>
              <Text style={brandBadge}>{appName}</Text>
            </Section>

            <Heading style={heading}>Verify your email</Heading>

            <Text style={paragraph}>Hi {username},</Text>

            <Text style={paragraph}>
              Thanks for signing up. Use the verification code below to complete
              your email verification.
            </Text>

            <Section style={otpBox}>
              <Text style={otpLabel}>Verification code</Text>
              <Text style={otpText}>{otp}</Text>
            </Section>

            <Text style={muted}>
              This code will expire in <strong>10 minutes</strong>.
            </Text>

            <Hr style={divider} />

            <Text style={footer}>
              Need help? Reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#f3f6fb",
  margin: "0",
  padding: "32px 16px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const wrapper: React.CSSProperties = {
  width: "100%",
  maxWidth: "580px",
  margin: "0 auto",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  padding: "0 32px 32px",
};

const accentBar: React.CSSProperties = {
  height: "8px",
  backgroundColor: "#2563eb",
  borderRadius: "18px 18px 0 0",
  margin: "0 -32px 28px",
};

const brandWrap: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
};

const brandBadge: React.CSSProperties = {
  display: "inline-block",
  margin: "0",
  padding: "8px 14px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "13px",
  fontWeight: "700",
  borderRadius: "999px",
};

const heading: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: "28px",
  lineHeight: "34px",
  fontWeight: "700",
  textAlign: "center",
  color: "#111827",
};

const paragraph: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
};

const otpBox: React.CSSProperties = {
  margin: "28px 0",
  padding: "22px 20px",
  backgroundColor: "#f8fafc",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  textAlign: "center",
};

const otpLabel: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const otpText: React.CSSProperties = {
  margin: "0",
  fontSize: "34px",
  lineHeight: "40px",
  fontWeight: "800",
  letterSpacing: "8px",
  color: "#2563eb",
  textAlign: "center",
};

const muted: React.CSSProperties = {
  margin: "0",
  fontSize: "14px",
  lineHeight: "24px",
  color: "#6b7280",
};

const divider: React.CSSProperties = {
  margin: "28px 0 20px",
  borderColor: "#e5e7eb",
};

const footer: React.CSSProperties = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "22px",
  color: "#6b7280",
  textAlign: "center",
};