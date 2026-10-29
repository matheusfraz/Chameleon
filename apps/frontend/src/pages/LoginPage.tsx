import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import chameleon from "@/assets/chameleon.png";
import { Button } from "@/components/ui/button";

// Rota do backend que inicia o OAuth com o Google
const GOOGLE_LOGIN_URL = "/api/auth/google";

// Códigos que o callback do backend pode devolver em /login?error=...
const LOGIN_ERRORS: Record<string, string> = {
  access_denied: "O acesso foi cancelado. Tente novamente quando quiser.",
  email_not_verified: "Essa conta Google não tem o e-mail verificado.",
  session_expired: "Sua sessão expirou. Entre novamente.",
};
const FALLBACK_ERROR = "Não foi possível entrar com o Google. Tente novamente.";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);

  const errorCode = searchParams.get("error");
  const errorMessage = errorCode
    ? (LOGIN_ERRORS[errorCode] ?? FALLBACK_ERROR)
    : null;

  // Ao voltar do Google pelo botão "voltar", o navegador pode restaurar a
  // página do cache com o botão ainda carregando. Isso reseta o estado.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) setRedirecting(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function handleGoogleLogin() {
    setRedirecting(true);
    window.location.assign(GOOGLE_LOGIN_URL);
  }

  return (
    <div className="flex min-h-dvh items-stretch justify-center max-sm:px-7 max-sm:pb-[calc(3rem+env(safe-area-inset-bottom))] sm:items-center sm:p-6 2xl:p-8">
      <div className="grid min-h-[calc(100dvh-3rem-env(safe-area-inset-bottom))] w-full grid-rows-[auto_auto] max-sm:content-center animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden bg-transparent sm:min-h-0 sm:max-w-md sm:grid-rows-none sm:rounded-2xl sm:bg-[#030D2B] sm:shadow-[0_0_120px_-20px_rgba(37,99,235,0.55)] md:min-h-135 md:max-w-4xl md:grid-cols-2 2xl:min-h-155 2xl:max-w-5xl md:short:zoom-[0.95] md:shorter:zoom-[0.88] md:shortest:zoom-[0.8]">
        {/* Topo (só celular): nome e frase sobre o fundo animado */}
        <div className="flex flex-col items-center justify-center gap-4 px-6 pb-24 pt-[calc(2.5rem+env(safe-area-inset-top))] text-center sm:hidden shortest:gap-3 shortest:pt-[calc(2rem+env(safe-area-inset-top))]">
          <p className="text-sm font-medium uppercase tracking-[0.45em] text-white/70">
            Chameleon
          </p>
          <p className="max-w-[15ch] text-balance text-3xl font-semibold leading-tight tracking-tight text-white shortest:text-2xl">
            Alertas animados para suas lives
          </p>
        </div>

        {/* Painel da logo: lateral no desktop, cabeçalho em telas médias */}
        <div className="relative flex h-48 items-center justify-center bg-[#030D2B] max-sm:hidden sm:h-56 md:block md:h-auto">
          <img
            src={chameleon}
            alt="Logo do Chameleon"
            className="absolute inset-0 size-full object-contain p-5 pb-9 sm:p-6 sm:pb-10 md:p-8 2xl:p-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen md:hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(52,211,153,0.22), transparent 65%)",
            }}
          />
          <p className="absolute inset-x-0 bottom-6 hidden text-center text-xs font-medium uppercase tracking-[0.4em] text-white/70 md:block 2xl:bottom-8 2xl:text-sm">
            Chameleon
          </p>
        </div>

        {/* Conteúdo: card flutuante no celular */}
        <div className="relative z-10 -mt-6 flex flex-col justify-between gap-8 rounded-t-3xl bg-card p-6 pt-8 max-sm:gap-6 max-sm:rounded-[2rem] max-sm:px-6 max-sm:pb-7 max-sm:pt-16 max-sm:shadow-[0_0_80px_-24px_rgba(52,211,153,0.4)] sm:p-10 md:mt-0 md:rounded-none 2xl:gap-10 2xl:p-14">
          {/* Selo da logo: metade sobre a borda do card (só celular) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 sm:hidden">
            <div
              aria-hidden
              className="absolute -inset-5 rounded-full bg-emerald-400/35 blur-2xl"
            />
            <img
              src={chameleon}
              alt="Logo do Chameleon"
              className="relative size-24 rounded-[1.6rem] ring-[6px] ring-card shadow-[0_14px_40px_-8px_rgba(52,211,153,0.6)]"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-8 max-sm:gap-6 2xl:gap-10">
            <div className="flex flex-col gap-2 text-center 2xl:gap-3">
              <h1 className="text-3xl font-semibold tracking-tight 2xl:text-4xl">
                Bem-vindo
              </h1>
              <p className="text-sm text-muted-foreground 2xl:text-base">
                Entre para configurar seus alertas
              </p>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm text-balance text-destructive"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogleLogin}
                disabled={redirecting}
                aria-busy={redirecting}
                className="h-12 w-full gap-3 rounded-xl text-base sm:h-11 2xl:h-12"
              >
                {redirecting ? (
                  <Loader2 className="size-4.5 animate-spin" aria-hidden />
                ) : (
                  <GoogleIcon />
                )}
                {redirecting ? "Redirecionando…" : "Continuar com o Google"}
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground 2xl:text-sm">
                Usamos sua conta Google apenas para identificar você. O canal do
                YouTube é conectado depois, no painel.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground max-sm:border-t max-sm:border-border max-sm:pt-5 max-sm:text-xs">
            Primeira vez aqui? Sua conta é criada no primeiro acesso.
          </p>
        </div>
      </div>
    </div>
  );
}
