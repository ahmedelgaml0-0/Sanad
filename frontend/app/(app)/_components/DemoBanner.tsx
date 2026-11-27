import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";

export async function DemoBanner() {
  const t = await getTranslations("app");

  return (
    <p className="bg-sage-tint px-4 py-2.5 text-center text-sm text-ink">
      {t.rich("demoBanner", {
        link: (chunks) => (
          <Link href={routes.signUp} className="font-bold underline underline-offset-4 hover:text-primary-solid">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
