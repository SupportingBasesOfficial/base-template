import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

/**
 * i18n setup com next-intl.
 *
 * Para ativar i18n no template:
 * 1. Crie app/[locale]/ e mova suas rotas para lá
 * 2. Adicione o middleware do next-intl no middleware.ts
 * 3. Configure messages/pt-BR.json e messages/en.json
 * 4. Use useTranslations() nos componentes
 *
 * Por padrão, o template não usa i18n para manter simplicidade.
 * Este arquivo fornece o setup pronto para quando precisar.
 */

export const locales = ["pt-BR", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "pt-BR",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
