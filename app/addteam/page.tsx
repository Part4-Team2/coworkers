"use client";

import Form from "@/app/components/Form/Form";
import FormFooter from "@/app/components/Form/FormFooter";
import Avatar from "@/app/components/Avatar/Avatar";

export default function AddTeamPage() {
  return (
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-[140px]"
        onSubmit={() => {}}
        title="팀 생성하기"
        profile={
          <div className="w-full flex flex-col gap-8">
            <label className="text-md text-text-primary">팀 프로필</label>
            <div className="relative inline-block w-64 h-64">
              <Avatar
                // imageUrl={userProfileImage}
                altText="팀 프로필"
                size="xlarge"
                isEditable={true}
                // onEditClick={handleEditClick}
              />
            </div>
          </div>
        }
        input={[
          {
            label: "팀 이름",
            placeholder: "팀 이름을 입력해주세요.",
            variant: "default",
            size: "large",
            type: "text",
            full: true,
          },
        ]}
        button={{
          label: "생성하기",
          variant: "solid",
          size: "large",
          full: true,
          onSubmit: () => {},
        }}
      />
      <FormFooter>
        <span className="text-md">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </span>
      </FormFooter>
    </>
  );
}
