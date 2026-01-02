import { Metadata } from "next";
import ResetContainer from "@/containers/reset/ResetContainer";

export const metadata: Metadata = {
  title: "Coworkers - 비밀번호 재설정",
  description: "비밀번호 재설정 페이지",
};

export default function ResetPage() {
  return <ResetContainer />;
}
