import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const { clientName, service, serviceValue, dueDate } = await req.json();

    if (!clientName || !service || !serviceValue || !dueDate) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    await prisma.payment.create({
      data: {
        userId: user.id,
        clientName,
        service,
        amount: Number(serviceValue),
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json({ message: "Pagamento criado" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao cadastrar pagamento." },
      { status: 500 },
    );
  }
}
