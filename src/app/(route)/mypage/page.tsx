import { createMetadata } from "@/components/Common/Metadata/Metadata";
import MyPageContainer from "@/containers/mypage/MyPageContainer";
import { getUser } from "@/api/user";

export const metadata = createMetadata({
  title: "마이페이지",
  description: "내 정보를 확인하고 팀원들과 협업을 시작하세요.",
  url: "/mypage",
  alt: "Coworkers - 마이페이지",
});

export default async function MyPage() {
  const userData = await getUser();

  if ("error" in userData) {
    // 에러 처리 - 기본값으로 처리하거나 에러 페이지로 리다이렉트
    return (
      <MyPageContainer initialImage={null} initialNickname="" initialEmail="" />
    );
  }

  return (
    <MyPageContainer
      initialImage={userData.image}
      initialNickname={userData.nickname}
      initialEmail={userData.email}
    />
  );
}
