import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Tính Lãi Shopee";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Reuse the same image for Twitter
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                    backgroundImage: "linear-gradient(135deg, #EE4D2D 0%, #FF6B35 100%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: "24px",
                        padding: "60px 80px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 700,
                            color: "#EE4D2D",
                            marginBottom: 16,
                            textAlign: "center",
                        }}
                    >
                        💰 Tính Lãi Shopee
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            color: "#4B5563",
                            textAlign: "center",
                            maxWidth: 800,
                            lineHeight: 1.4,
                        }}
                    >
                        Công cụ tính phí, lợi nhuận bán hàng trên Shopee
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
