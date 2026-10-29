import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").toLowerCase();
const RESERVED = new Set(["www", "app", "panel", "api"]);

/**
 * 1) kervanpide.siparisai.com  → /r/kervanpide
 * 2) restoranin-kendi-adresi.com → /r/~restoranin-kendi-adresi.com
 * 3) /panel/* için Supabase oturumunu yeniler.
 */
export async function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const url = request.nextUrl;

  const tenant = tenantFromHost(host);
  if (tenant && !url.pathname.startsWith("/api")) {
    const target = url.clone();
    target.pathname = `/r/${encodeURIComponent(tenant)}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(target);
  }

  if (url.pathname.startsWith("/panel")) {
    return refreshSession(request);
  }
  return NextResponse.next();
}

function tenantFromHost(host: string): string | null {
  if (!host || host === ROOT || host.startsWith("localhost") || host.endsWith(".vercel.app")) {
    return null;
  }
  if (host.endsWith(`.${ROOT}`)) {
    const sub = host.slice(0, -(ROOT.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) return null;
    return sub;
  }
  const bare = host.replace(/^www\./, "").split(":")[0];
  return `~${bare}`;
}

async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
        },
      },
    },
  );
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    const login = request.nextUrl.clone();
    login.pathname = "/giris";
    login.search = "";
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
