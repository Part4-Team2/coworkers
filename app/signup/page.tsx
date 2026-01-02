import { Metadata } from "next";
import SignupContainer from "@/containers/signup/SignupContainer";

export const metadata: Metadata = {
  title: "Coworkers - 회원가입",
  description: "회원가입 페이지",
};

export default function SignupPage() {
  return <SignupContainer />;
}
