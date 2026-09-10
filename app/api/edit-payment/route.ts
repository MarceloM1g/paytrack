import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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

    const { id, clientName, service, serviceValue, dueDate } = await req.json();

    if (!id || !clientName || !service || !serviceValue || !dueDate) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 },
      );
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        clientName,
        service,
        amount: Number(serviceValue),
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(
      { message: "Pagamento Editado com sucesso." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao editar pagamento." },
      { status: 500 },
    );
  }
}
