"use client";
import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Eye } from "lucide-react";
import { useLanguage } from "./language";
import { scooterVideo, whiteScooterVideo } from "@/data/fleet";

export function ScooterVideo({ color = "pink" }: { color?: "pink" | "white" }) {
  const isWhite = color === "white";
  const video = isWhite ? whiteScooterVideo : scooterVideo;
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => { });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  return (
    <section className="scooter-video-section" aria-label={isWhite ? t("Video xe trắng ngọc", "Pearl white scooter video") : t("Video xe thực tế", "Actual scooter video")}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isWhite ? t("EVO GRAND LITE · TRẮNG NGỌC", "EVO GRAND LITE · PEARL WHITE") : t("VIDEO THỰC TẾ", "ACTUAL SCOOTER VIDEO")}</p>
          <h2 className="section-title">
            {t("Chiêm ngưỡng chiếc xe\ntrước khi bạn thuê.", "See the scooter\nbefore you rent.")}
          </h2>
          <p className="muted section-description">
            {t(
              isWhite ? "Khám phá Evo Grand Lite trắng ngọc qua video giới thiệu. Bấm phát để ngắm dáng xe trước khi chọn gói thuê." : "Đoạn quay thực tế chiếc Evo Grand Lite màu hồng tại công viên và đường phố. Bấm để xem chuyển động và góc dáng xe.",
              isWhite ? "Explore the pearl white Evo Grand Lite in this video. Press play to see the scooter before choosing your rental plan." : "Actual walkaround of the blush pink Evo Grand Lite in the park and on the street. Click play to see the scooter in motion.",
            )}
          </p>
        </div>
      </div>

      <div className="scooter-video-wrapper">
        <video
          ref={videoRef}
          className="scooter-video-element"
          poster={video.poster}
          playsInline
          muted={isMuted}
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={video.srcMp4} type="video/mp4" />
          {t("Trình duyệt không hỗ trợ video HTML5.", "Your browser does not support HTML5 video.")}
        </video>

        {!isPlaying && (
          <button
            type="button"
            className="video-overlay-play"
            aria-label={isWhite ? t("Phát video xe trắng ngọc", "Play pearl white scooter video") : t("Phát video xe thực tế", "Play actual scooter video")}
            onClick={togglePlay}
          >
            <span className="video-play-icon" aria-hidden="true">
              <Play size={28} fill="currentColor" />
            </span>
            <span className="video-play-label">
              {t(`Xem video (${video.durationSec}s)`, `Watch video (${video.durationSec}s)`)}
            </span>
          </button>
        )}

        <div className="video-controls-bar">
          <button
            type="button"
            className="video-control-btn"
            aria-label={isPlaying ? t("Tạm dừng", "Pause") : t("Phát", "Play")}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </button>
          <span className="video-meta-badge" aria-hidden="true">
            <Eye size={14} /> {t(`${isWhite ? "Trắng ngọc" : "Quay thực tế"} · ${video.durationSec} giây`, `${isWhite ? "Pearl white" : "Actual footage"} · ${video.durationSec}s`)}
          </span>
          <button
            type="button"
            className="video-control-btn video-mute-btn"
            aria-label={isMuted ? t("Bật âm thanh", "Unmute") : t("Tắt âm thanh", "Mute")}
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>


    </section>
  );
}
