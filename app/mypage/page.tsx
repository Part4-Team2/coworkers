import { Metadata } from "next";
import MyPageContainer from "@/containers/mypage/MyPageContainer";

export const metadata: Metadata = {
  title: "Coworkers - 마이페이지",
  description: "마이페이지",
};

export default function MyPage() {
  return <MyPageContainer />;
}
