import { createMetadata } from "@/components/Common/Metadata/Metadata";
import MyPageContainer from "@/containers/mypage/MyPageContainer";

export const metadata = createMetadata({
  title: "마이페이지",
  description: "내 정보를 확인하고 팀원들과 협업을 시작하세요.",
  url: "/mypage",
  alt: "Coworkers - 마이페이지",
});

export default function MyPage() {
  return <MyPageContainer />;
}
