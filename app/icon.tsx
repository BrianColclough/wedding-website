import { ImageResponse } from "next/og";

export const size = {
  width: 256,
  height: 256,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8484ff 0%, #4b4bb8 100%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          width="180"
          height="180"
        >
          <path
            fill="#ffffff"
            d="M512 780c-180-120-300-220-300-340 0-90 70-160 160-160 56 0 108 28 140 72 32-44 84-72 140-72 90 0 160 70 160 160 0 120-120 220-300 340z"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}


