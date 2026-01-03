"use client";

import clsx from "clsx";
import Avatar from "@/components/Common/Avatar/Avatar";
import Button from "@/components/Common/Button/Button";
import Comment from "@/components/Boards/Comment";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import InputBox from "@/components/Common/Input/InputBox";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

const ARTICLEDATA = ["수정하기", "삭제하기"];

// 게시글에 있는 데이터와 상세 게시글에 받는 데이터가 다릅니다.
type AtricleMockdata = {
  id: number;
  nickname: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};

// 댓글 목데이터입니다.
type CommentMockdata = {
  commentId: number;
  content: string;
  createdAt: string;
  nickname: string;
  avatarImageUrl?: string;
};

const ARTICLE: AtricleMockdata = {
  id: 1,
  nickname: "우지은",
  title: "게시글 제목입니다.",
  content: "본문에 들어가는 영역입니다.",
  createdAt: "2025.12.29",
  likeCount: 10000,
  commentCount: 0,
  isLiked: false,
};

const COMMENT01: CommentMockdata = {
  commentId: 1,
  content: "This is comment section",
  createdAt: "2025.12.30",
  nickname: "우지우",
  avatarImageUrl: undefined,
};

const COMMENT02: CommentMockdata = {
  commentId: 2,
  content: "This is comment section",
  createdAt: "2025.12.30",
  nickname: "우지박",
  avatarImageUrl: undefined,
};

const COMMENT03: CommentMockdata = {
  commentId: 3,
  content: "This is comment section",
  createdAt: "2025.12.30",
  nickname: "우지호우",
  avatarImageUrl: undefined,
};

const COMMENTLISTS = [COMMENT01, COMMENT02, COMMENT03];

function ArticlePage() {
  const article = ARTICLE;
  const comments = COMMENTLISTS;

  // 게시글 수정하기 삭제하기를 다루는 임시함수 입니다.
  const handleArticleClick = () => {
    if (ARTICLEDATA[0]) {
      console.log("수정하기");
    } else {
      console.log("삭제하기");
    }
  };

  // 댓글 작성 후 버튼을 누르면 처리되는 함수입니다.
  const handleCommentClick = () => {
    console.log("댓글 버튼 작동");
  };

  // 등록된 댓글 개수에 따라 나오는 UI가 다릅니다.
  const renderComment = () => {
    if (article.commentCount > 0) {
      return (
        <>
          {comments.map((comment) => (
            <div className="pb-16" key={comment.commentId}>
              <Comment />
            </div>
          ))}
        </>
      );
    }

    return (
      <div className={clsx("mt-158 text-base text-center text-text-default")}>
        아직 작성된 댓글이 없습니다.
      </div>
    );
  };

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <main
        className={clsx(
          "py-56 max-w-1200 w-full mx-auto",
          "flex flex-col gap-80",
          "px-20 lg:px-0"
        )}
      >
        {/* 게시글 영역 */}
        <section className={clsx("flex flex-col gap-16 py-24")}>
          {/* 게시글 제목 영역 */}
          <div className={clsx("flex justify-between")}>
            <span className="text-2lg">{article.title}</span>
            <span>
              <Dropdown
                options={ARTICLEDATA}
                onSelect={handleArticleClick}
                value={ARTICLEDATA[0]}
                size="md"
                trigger="icon"
                icon="kebabLarge"
              />
            </span>
          </div>
          <div className="border-b border-b-text-primary/10"></div>
          {/* 작성자, 좋아요/댓글 개수 표시 영역 */}
          <div className={clsx("flex justify-between text-slate-400 text-sm")}>
            {/* 작성자, 게시글 생성일자 */}
            <div className="flex gap-16 items-center">
              <div className="flex gap-12 items-center">
                <Avatar imageUrl={undefined} altText="none" size="large" />
                <span className="text-text-primary">{article.nickname}</span>
              </div>
              <div className="text-text-primary/10">|</div>
              <div className="text-slate-400">{article.createdAt}</div>
            </div>
            {/* 좋아요/댓글 개수 표시 */}
            <div className="flex gap-16">
              <div className="flex gap-4 items-center">
                <SVGIcon icon="comment" size={14} />
                <span>{article.commentCount}</span>
              </div>
              <div className="flex gap-4 items-center">
                <SVGIcon icon="heart" size={14} />
                <span>
                  {article.likeCount > 9999 ? "9999+" : article.likeCount}
                </span>
              </div>
            </div>
          </div>
          {/* 게시글 본문 영역 */}
          <div className="text-text-secondary text-base">{article.content}</div>
        </section>
        {/* 댓글 영역 */}
        <section className={clsx("flex flex-col gap-40")}>
          {/* 댓글 작성 영역 */}
          <div className="flex flex-col gap-24">
            <div className="text-text-primary text-xl">댓글달기</div>
            <div>
              <InputBox
                placeholder="댓글을 입력해주세요"
                width="1200px"
                maxHeight="104px"
              />
            </div>
            <div className="self-end">
              <Button label="등록" onClick={handleCommentClick} width="184px" />
            </div>
          </div>
          <div className="border-b border-b-text-primary/10"></div>
          {/* 등록된 댓글 전시 영역 */}
          <div>{renderComment()}</div>
        </section>
      </main>
    </div>
  );
}

export default ArticlePage;
