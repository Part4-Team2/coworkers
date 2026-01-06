import { createMetadata } from "@/components/Common/Metadata/Metadata";
import SignupContainer from "@/containers/signup/SignupContainer";

export const metadata = createMetadata({
  title: "회원가입",
  description: "회원가입하고 팀원들과 협업을 시작하세요.",
  url: "/signup",
  alt: "Coworkers - 회원가입",
});

export default function SignupPage() {
  return <SignupContainer />;
}
