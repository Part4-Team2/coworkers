import { Metadata } from "next";
import LoginContainer from "@/containers/login/LoginContainer";

export const metadata: Metadata = {
  title: "Coworkers - 로그인",
  description: "로그인 페이지",
};

export default function LoginPage() {
  return <LoginContainer />;
}
