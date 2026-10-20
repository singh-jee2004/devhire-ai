import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/candidate/dashboard";

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.user) {
            const user = data.user;
            const queryRole = searchParams.get("role");
            const role = queryRole || user.user_metadata?.role || "candidate";

            // Sync user to profiles table
            await supabase.from("profiles").upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || "Developer",
                email: user.email || "",
                role,
            });

            // Determine redirect target
            const target = next !== "/candidate/dashboard"
                ? next
                : (role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");

            return NextResponse.redirect(`${origin}${target}`);
        }
    }

    // Return the user to login if something went wrong
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
