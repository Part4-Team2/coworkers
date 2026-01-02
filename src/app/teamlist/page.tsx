import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Common/Button/Button";
import noAffiliationImage from "@/assets/img/no-affiliation.png";

export default function NoTeamPage() {
  return (
    <div className="w-full min-h-screen bg-background-primary flex items-center justify-center">
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
