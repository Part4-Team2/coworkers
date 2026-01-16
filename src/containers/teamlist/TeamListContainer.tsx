"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Common/Button/Button";
import TeamListItem from "@/components/Team/TeamListItem";
import noAffiliationImage from "@/assets/img/no-affiliation.webp";
import { displayPendingToast } from "@/utils/pendingToast";

interface Team {
  id: number;
  name: string;
  image: string | null;
}

interface TeamListContainerProps {
  teams: Team[];
}

export default function TeamListContainer({ teams }: TeamListContainerProps) {
  const router = useRouter();

  const hasTeams = teams.length > 0;

  const handleTeamClick = (groupId: number) => {
    router.push(`/${groupId}`);
  };

  // 페이지 이동 후 토스트 메시지 표시
  useEffect(() => {
    displayPendingToast();
  }, []);

  // 팀이 없는 경우
  if (!hasTeams) {
    return (
      <div className="w-full h-[calc(100vh-60px)] bg-background-primary flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center">
          {/* 이미지 - 반응형 크기 */}
          <div className="relative w-312 h-98 sm:w-520 sm:h-164 lg:w-810 lg:h-255">
            <Image
              src={noAffiliationImage}
              alt="소속된 팀이 없습니다"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 312px, (max-width: 1024px) 520px, 810px"
            />
          </div>

          {/* 텍스트 - 반응형 간격 및 폰트 */}
          <div className="mt-32 sm:mt-48 lg:mt-48 text-center">
            <p className="text-text-default text-md font-medium leading-md sm:text-md sm:leading-md lg:text-lg lg:leading-lg">
              아직 소속된 팀이 없습니다.
            </p>
            <p className="text-text-default text-md font-medium leading-md sm:text-md sm:leading-md lg:text-lg lg:leading-lg mt-4">
              팀을 생성하거나 팀에 참여해보세요.
            </p>
          </div>

          {/* 버튼 - 반응형 간격 */}
          <div className="mt-48 sm:mt-80 lg:mt-80 flex flex-col gap-10">
            <Link href="/addteam">
              <Button
                label="팀 생성하기"
                variant="solid"
                size="large"
                width="186px"
              />
            </Link>
            <Link href="/jointeam">
              <Button
                label="팀 참여하기"
                variant="outlined"
                size="large"
                width="186px"
                className="bg-transparent!"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 팀이 있는 경우
  return (
    <div className="w-full min-h-[calc(100vh-60px)] bg-background-primary flex flex-col items-center justify-center px-20 sm:px-24 lg:px-24 py-40 gap-60">
      {/* Title */}
      <h1 className="text-text-primary font-pretendard text-[40px] font-medium leading-normal text-center">
        팀 목록
      </h1>

      {/* 팀 목록 영역 */}
      <div className="w-full max-w-580 flex flex-col gap-10 p-24 pl-25 rounded-xl bg-background-secondary">
        {teams.map((team) => (
          <TeamListItem
            key={team.id}
            teamName={team.name}
            teamImage={team.image ?? undefined}
            onClick={() => handleTeamClick(team.id)}
          />
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-10 items-center">
        <Link href="/addteam">
          <Button
            label="팀 생성하기"
            variant="solid"
            size="large"
            width="186px"
          />
        </Link>
        <Link href="/jointeam">
          <Button
            label="팀 참여하기"
            variant="outlined"
            size="large"
            width="186px"
            className="bg-transparent!"
          />
        </Link>
      </div>
    </div>
  );
}
