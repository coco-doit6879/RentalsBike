"use client";
import React from "react";
import {useLanguage} from "./language";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
export function ImageSlot({
  src = "/images/scooter-ivory.svg",
  alt,
  priority = false,
  className = "",
  caption = true,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  caption?: boolean;
}) {
  const {t}=useLanguage();
  return (
    <figure className={`image-slot ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={760}
        priority={priority}
        sizes="(max-width: 700px) 100vw, 65vw"
        unoptimized={src.endsWith(".svg")}
      />
      {caption && (
        <figcaption>
          {t('Ảnh concept minh họa · Không phải ảnh sản phẩm thực tế','Concept illustration · Not an actual product photograph')}
        </figcaption>
      )}
    </figure>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? {} : { opacity: [0.8, 1], y: [14, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <ArrowUpRight size={18} aria-hidden="true" />
  ) : (
    <ArrowRight size={18} aria-hidden="true" />
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="muted section-description">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
