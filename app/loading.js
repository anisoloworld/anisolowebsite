

export default function Loading() {
  return (
    <>
      <div className="loader-screen">
        <div className="loader-line"></div>
      </div>

      <style>{`
        .loader-screen {
          position: fixed;
          inset: 0;

          background: rgba(0, 0, 0, 0.61);
          backdrop-filter: blur(8px);

          display: flex;
          justify-content: center;
          align-items: center;

          z-index: 99999;
        }

        .loader-line {
          width: 220px;
          height: 4px;

          background: rgba(255,255,255,0.15);

          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .loader-line::before {
          content: "";
          position: absolute;

          width: 40%;
          height: 100%;

          background: #A020F0;

          animation: netflixLoader 0.35s linear infinite;
        }

        @keyframes netflixLoader {
          0% {
            left: -40%;
          }

          100% {
            left: 100%;
          }
        }
      `}</style>
    </>
  );
}