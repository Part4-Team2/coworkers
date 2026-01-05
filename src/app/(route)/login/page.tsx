import { createMetadata } from "@/components/Common/Metadata/Metadata";
import LoginContainer from "@/containers/login/LoginContainer";

export const metadata = createMetadata({
  title: "로그인",
  description: "로그인하고 팀원들과 협업을 시작하세요.",
  url: "/login",
  alt: "Coworkers - 로그인",
});

export default function LoginPage() {
  return <LoginContainer />;
}
