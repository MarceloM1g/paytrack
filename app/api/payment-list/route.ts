import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        dueDate: "asc",
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao buscar pagamento." },
      { status: 500 },
    );
  }
}
