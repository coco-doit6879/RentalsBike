import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
export function Breadcrumb({
  title,
  parent,
}: {
  title: string;
  parent?: { label: string; href: string };
}) {
  return (
    <nav className="breadcrumb container" aria-label="Breadcrumb">
      <Link href="/">Trang chủ</Link>
      <ChevronRight size={11} />
      {parent && (
        <>
          <Link href={parent.href}>{parent.label}</Link>
          <ChevronRight size={11} />
        </>
      )}
      <span aria-current="page">{title}</span>
    </nav>
  );
}
export function PageIntro({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow: string;
}) {
  return (
    <div className="page-intro">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}
