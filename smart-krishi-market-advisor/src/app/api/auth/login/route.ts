import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return Response.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));

    if (!user) {
      return Response.json({ success: false, message: "User not found with this email" }, { status: 404 });
    }

    if (password) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return Response.json({ success: false, message: "Invalid password" }, { status: 401 });
      }
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
