import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * Template de email de boas-vindas com React Email.
 *
 * Preview: pnpm email dev
 * Build: pnpm email export
 *
 * Uso:
 *   import WelcomeEmail from "./welcome";
 *   const html = render(<WelcomeEmail userName="João" />);
 */
export function WelcomeEmail({ userName = "Usuário" }: { userName?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao Base Template!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Bem-vindo, {userName}!</Heading>
          <Text style={paragraph}>
            Obrigado por se cadastrar. Seu conta está pronta para uso.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://your-domain.com/dashboard">
              Acessar Dashboard
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Base Template — Monorepo Turborepo + Next.js + Supabase
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

const main = {
  fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
  backgroundColor: "#f6f9fc",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  color: "#4a4a4a",
  lineHeight: "1.5",
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #f0f0f0",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
};
