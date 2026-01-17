import { createMetadata } from "@/components/Common/Metadata/Metadata";
import MyPageContainer from "@/containers/mypage/MyPageContainer";
import { getUser } from "@/lib/api/user";
import { redirect } from "next/navigation";

export const metadata = createMetadata({
  title: "마이페이지",
  description: "내 정보를 확인하고 팀원들과 협업을 시작하세요.",
  url: "/mypage",
  alt: "Coworkers - 마이페이지",
});

export default async function MyPage() {
  const userData = await getUser();

  if ("error" in userData) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    redirect("/login");
  }

  return (
    <MyPageContainer
      initialImage={userData.data.image}
      initialNickname={userData.data.nickname}
      initialEmail={userData.data.email}
    />
  );
}
