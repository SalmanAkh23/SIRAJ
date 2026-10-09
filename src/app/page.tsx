"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { dailyVerse } from "@/data/quran";
import {
  BookOpen,
  Heart,
  Users,
  Clock,
  Star,
  Sun,
  ArrowRight,
  BookMarked,
  ChevronRight,
} from "lucide-react";

const learningTopics = [
  { icon: BookOpen, title: "Al-Qur'an", desc: "Temukan dan baca ayat-ayat Al-Qur'an.", href: "/quran" },
  { icon: Heart, title: "Aqidah", desc: "Pelajari dasar-dasar keimanan.", href: "/belajar" },
  { icon: BookMarked, title: "Fiqih", desc: "Kenali tuntunan ibadah dalam kehidupan sehari-hari.", href: "/belajar" },
  { icon: Users, title: "Akhlak", desc: "Belajar membangun akhlak yang baik.", href: "/belajar" },
  { icon: Clock, title: "Sirah", desc: "Kenali perjalanan Rasulullah ﷺ dan generasi terdahulu.", href: "/belajar" },
  { icon: Star, title: "Adab", desc: "Pelajari adab dalam kehidupan sehari-hari.", href: "/belajar" },
];

const steps = [
  { num: "01", title: "Belajar sedikit demi sedikit", desc: "Mulai dengan membaca satu ayat, satu hadits, atau satu materi setiap hari. Konsistensi lebih baik daripada kuantitas." },
  { num: "02", title: "Amalkan ilmu yang dipelajari", desc: "Ilmu yang diamalkan akan menjadi cahaya. Terapkan apa yang kamu pelajari dalam kehidupan sehari-hari." },
  { num: "03", title: "Bagikan kebaikan kepada sesama", desc: "Berbagi ilmu adalah salah satu amal yang pahalanya tidak terputus. Sampaikan walau satu ayat." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 pattern-star opacity-[0.05] pattern-fade pointer-events-none"
          aria-hidden="true"
        />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 border border-primary/10 rounded-full" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
              <Sun size={14} />
              Temukan ilmu, satu langkah setiap hari.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight text-balance">
              Belajar Islam,
              <br />
              <span className="text-primary">dengan langkah yang bermakna.</span>
            </h1>

            <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Temukan Al-Qur&apos;an, ilmu Islam, doa, hadits, dan pembelajaran yang membantu kita terus bertumbuh dalam kebaikan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                Mulai Belajar
                <ArrowRight size={18} />
              </Link>
              <Link href="/quran" className="btn-secondary text-base px-8 py-3">
                Jelajahi Al-Qur&apos;an
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Apa yang ingin kamu pelajari?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="card group flex items-start gap-4 hover:border-primary/20 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{topic.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ayat Hari Ini */}
      <section className="py-16 lg:py-24 bg-primary/[0.03]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Ayat Hari Ini</h2>
          </div>

          <div className="card p-8 lg:p-12 text-center">
            <p className="arabic-text text-3xl sm:text-4xl text-text leading-loose mb-6" lang="ar">
              {dailyVerse.arabic}
            </p>
            <p className="text-xs text-muted mb-4 uppercase tracking-wider">
              QS. {dailyVerse.surahName}: {dailyVerse.ayatNumber}
            </p>
            <p className="text-base text-text/80 leading-relaxed max-w-xl mx-auto">
              &ldquo;{dailyVerse.translation}&rdquo;
            </p>
            <Link
              href={`/quran/${dailyVerse.surahNumber}`}
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              Baca selengkapnya
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Mulai dari hal sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-5xl font-bold text-primary/10 mb-3">{step.num}</div>
                <h3 className="text-lg font-semibold text-text mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-10 lg:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ilmu adalah perjalanan.
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Mulai satu langkah hari ini.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Mulai Belajar
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
