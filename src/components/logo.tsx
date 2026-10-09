import Image from "next/image";

interface LogoProps {
  /** Ukuran mark dalam pixel */
  size?: number;
  /** dark = mark hijau (untuk background terang), light = mark krem (untuk background gelap) */
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
}

/**
 * Mark logo SIRAJ.
 * Gunakan bersama teks "SIRAJ" di sebelahnya; karena dekoratif, alt dikosongkan
 * agar pembaca layar tidak mengulang nama brand.
 */
export default function Logo({
  size = 32,
  variant = "dark",
  className = "",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src={variant === "light" ? "/logo-mark-light.png" : "/logo-mark.png"}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 ${className}`}
    />
  );
}
