import { createMetadata } from "@/components/Common/Metadata/Metadata";
import ResetContainer from "@/containers/reset/ResetContainer";

export const metadata = createMetadata({
  title: "비밀번호 재설정",
  description: "비밀번호를 재설정하고 팀원들과 협업을 시작하세요.",
  url: "/reset-password",
  alt: "Coworkers - 비밀번호 재설정",
});

export default function ResetPage() {
  return <ResetContainer />;
}
