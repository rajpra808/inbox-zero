import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/app/(landing)/login/LoginForm";
import { getRequiresReconsentDescription } from "@/app/(landing)/login/messages";
import { env } from "@/env";
import { auth } from "@/utils/auth";
import { isGoogleOauthEmulationEnabled } from "@/utils/google/oauth";
import { getEnabledLoginProviders } from "@/utils/oauth/login-providers";
import { AlertBasic } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { WELCOME_PATH } from "@/utils/config";
import { CrispChatLoggedOutVisible } from "@/components/CrispChat";
import { MutedText } from "@/components/Typography";
import { normalizeInternalPath } from "@/utils/path";
import { UniWordmark } from "@/components/uni-landing/UniWordmark";
import {
  BRAND_NAME,
  SUPPORT_EMAIL,
  getBrandTitle,
  getPossessiveBrandName,
} from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Log in"),
  description: `Log in to ${BRAND_NAME}.`,
  alternates: { canonical: "/login" },
};

export default async function AuthenticationPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const nextPath = normalizeInternalPath(searchParams?.next);
  const isSelfHosted = env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS;

  if (session?.user && !searchParams?.error) {
    redirect(nextPath ?? WELCOME_PATH);
  }

  const enabledProviders = Array.from(getEnabledLoginProviders());

  return (
    <div className="flex min-h-screen text-foreground">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-blue to-brand-green lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_25%_15%,white,transparent_45%)]"
        />
        <div className="relative">
          <UniWordmark
            href="/"
            className="[&_span:last-child]:text-white [&>span:first-child]:bg-white/15"
          />
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight text-white">
            The inbox that runs itself.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Sign in to let {BRAND_NAME} read, sort, and draft your email — so
            you open an inbox already at zero.
          </p>
        </div>
        <p className="relative text-sm text-white/70">
          One calm workspace for every account.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2">
        <div className="mx-auto flex w-full max-w-sm flex-col space-y-6">
          <div className="flex justify-center lg:hidden">
            <UniWordmark href="/" />
          </div>
          <div className="flex flex-col text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              Welcome to {BRAND_NAME}
            </h1>
            <p className="mt-3 text-muted-foreground">
              Sign in to reach inbox zero.
            </p>
          </div>
          <div>
            <Suspense>
              <LoginForm
                enabledProviders={enabledProviders}
                useGoogleOauthEmulator={isGoogleOauthEmulationEnabled()}
              />
            </Suspense>
          </div>

          {searchParams?.error && <ErrorAlert error={searchParams?.error} />}

          {!isSelfHosted ? (
            <MutedText className="px-4 text-center text-xs">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </MutedText>
          ) : null}

          <LoginFooter
            isSelfHosted={isSelfHosted}
            selfHostedLoginFooterText={
              env.NEXT_PUBLIC_SELF_HOSTED_LOGIN_FOOTER_TEXT || undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

function LoginFooter({
  isSelfHosted,
  selfHostedLoginFooterText,
}: {
  isSelfHosted?: boolean;
  selfHostedLoginFooterText?: string;
}) {
  if (isSelfHosted && selfHostedLoginFooterText !== undefined) {
    const trimmedFooterText = selfHostedLoginFooterText.trim();
    if (!trimmedFooterText || trimmedFooterText.toLowerCase() === "none") {
      return null;
    }

    return (
      <MutedText className="whitespace-pre-line px-4 pt-10 text-center">
        {selfHostedLoginFooterText}
      </MutedText>
    );
  }

  return (
    <MutedText
      className={
        isSelfHosted ? "px-4 pt-10 text-center" : "px-4 pt-4 text-center"
      }
    >
      {getPossessiveBrandName()} use and transfer of information received from
      Google APIs to any other app will adhere to{" "}
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy"
        className="underline underline-offset-4 hover:text-foreground"
      >
        Google API Services User Data
      </a>{" "}
      Policy, including the Limited Use requirements.
    </MutedText>
  );
}

function ErrorAlert({ error }: { error: string }) {
  if (error === "RequiresReconsent") {
    return (
      <AlertBasic
        variant="destructive"
        title="Permissions need to be refreshed"
        description={getRequiresReconsentDescription({
          includeSupportText: true,
        })}
      />
    );
  }

  if (error === "OAuthAccountNotLinked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Account already attached to another user"
        description={
          <>
            <span>You can merge accounts instead.</span>
            <Button asChild className="mt-2">
              <Link href="/accounts">Merge accounts</Link>
            </Button>
          </>
        }
      />
    );
  }

  if (error === "email_already_linked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Email Already Linked"
        description={`This email address is already linked to another ${BRAND_NAME} account. Please sign in with the original account, or use a different email address. If this error persists please contact support at ${SUPPORT_EMAIL}`}
      />
    );
  }

  return (
    <>
      <AlertBasic
        variant="destructive"
        title="Error logging in"
        description={`There was an error logging in. Please try logging in again. If this error persists please contact support at ${SUPPORT_EMAIL}`}
      />
      <Suspense>
        <CrispChatLoggedOutVisible />
      </Suspense>
    </>
  );
}
