import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
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

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "O ID é obrigatório" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status: "PAID",
      },
    });

    if (payment.count === 0) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Pagamento marcado como pago com sucesso." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao marcar pagamento como pago." },
      { status: 500 },
    );
  }
}
