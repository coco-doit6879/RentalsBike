import React from "react";
import Link from "next/link";
import { news } from "@/data/editorial";
import { ImageSlot, Arrow, SectionHeading } from "./primitives";
export function NewsCard({ post }: { post: (typeof news)[number] }) {
  return (
    <article className="news-card">
      <Link href={`/news/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <ImageSlot
          src={post.image}
          alt={`Ảnh concept minh họa: ${post.title}`}
          caption={false}
        />
      </Link>
      <div className="news-meta">
        <span>{post.category} · BÀI MẪU</span>
        <time dateTime={post.date}>
          {new Intl.DateTimeFormat("vi-VN").format(new Date(post.date))}
        </time>
      </div>
      <h3>
        <Link href={`/news/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <Link
        className="text-link"
        href={`/news/${post.slug}`}
        aria-label={`Đọc thêm: ${post.title}`}
      >
        Đọc câu chuyện <Arrow diagonal />
      </Link>
    </article>
  );
}
export function NewsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="GÓC NHÌN & CẢM HỨNG" title="Tin tức & Sự kiện">
          <Link className="text-link" href="/news">
            Tất cả câu chuyện <Arrow />
          </Link>
        </SectionHeading>
        <div className="news-grid">
          {news.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
