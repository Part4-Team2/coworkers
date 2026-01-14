"use client"; // Error boundaries must be Client Components

// global-error must include html and body tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </head>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "84px 16px",
            backgroundImage: "url(/landing/main/size-small.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "50px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              오류가 발생했습니다
            </span>
            <span
              style={{
                fontSize: "1.25rem",
                color: "#ffffff",
                lineHeight: "1.6",
              }}
            >
              예상치 못한 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주시거나,
              <br />
              문제가 계속되면 고객센터로 문의해주세요.
            </span>
            {error.digest && (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                오류 코드: {error.digest}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              width: "100%",
              maxWidth: "460px",
              padding: "0 16px",
            }}
          >
            <button
              onClick={reset}
              style={{
                width: "100%",
                height: "46px",
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#ffffff",
                background: "linear-gradient(to right, #10b981, #059669)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              다시 시도
            </button>
            <button
              onClick={handleHomeClick}
              style={{
                width: "100%",
                height: "46px",
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#10b981",
                background: "#ffffff",
                border: "1px solid #10b981",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#059669";
                e.currentTarget.style.color = "#059669";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#10b981";
                e.currentTarget.style.color = "#10b981";
              }}
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
