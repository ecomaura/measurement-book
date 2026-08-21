import Image from "next/image";
import { BRAND_NAME } from "@/lib/fields";

type Props = {
  size?: "sm" | "lg";
};

export default function Logo({ size = "sm" }: Props) {
  const dimension = size === "lg" ? 96 : 64;

  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt={BRAND_NAME}
        width={dimension}
        height={dimension}
        className="rounded-sm object-contain"
        priority
      />
    </div>
  );
}
