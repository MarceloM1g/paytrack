"use client";

import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";

import { FiMoreVertical } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

interface Payment {
  id: string;
  clientName: string;
  service: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "PAID";
}

const statusConfig = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-400/10 text-amber-400",
    dotClassName: "bg-amber-400",
  },
  PAID: {
    label: "Pago",
    className: "bg-emerald-400/10 text-emerald-400",
    dotClassName: "bg-emerald-400",
  },
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PaymentList() {
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  async function getPaymentList() {
    try {
      const response = await fetch("/api/payment-list", {
        method: "GET",
      });

      if (!response.ok) {
        alert("Erro");
        return;
      }

      const data = await response.json();
      setPaymentList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadPayments = async () => {
      await getPaymentList();
    };

    loadPayments();
  }, []);

  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function deletePayment(id: string) {
    try {
      const response = await fetch(`/api/delete-payment?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Erro ao deletar Pagamento");
        return;
      }

      setPaymentList((prev) => prev.filter((payment) => payment.id !== id));
      setOpenMenu(null);
    } catch (error) {
      console.log(error);
    }
  }

  async function markPaid(id: string) {
    try {
      setOpenMenu(null);

      const response = await fetch("/api/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        alert("Erro ao marcar como pago.");
        return;
      }

      setPaymentList((prev) =>
        prev.map((payment) =>
          payment.id === id ? { ...payment, status: "PAID" } : payment,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div>
        <button
          onClick={() => {
            setEditingPayment(null);
            setOpenForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#f7f7f7] text-[#111] px-4 py-2 rounded-full mb-4 font-medium text-base hover:bg-[#111] hover:text-[#f7f7f7] active:scale-[0.98] transition-all duration-300"
        >
          <span className="text-lg leading-none">+</span>
          Criar Pagamento
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      {openForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setOpenForm(false);
            setEditingPayment(null);
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="rounded-xl p-6">
            <PaymentForm
              payment={editingPayment}
              onSuccess={() => {
                setOpenForm(false);
                setEditingPayment(null);
                getPaymentList();
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {!loading && paymentList.length === 0 && (
          <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center">
            <h3 className="text-lg font-medium text-white">
              Nenhum pagamento cadastrado
            </h3>

            <p className="text-white/50 mt-2">
              Crie seu primeiro pagamento para começar a acompanhar cobranças.
            </p>
          </div>
        )}

        {paymentList.map((payment) => {
          const status = statusConfig[payment.status];

          return (
            <div
              key={payment.id}
              className="group relative bg-[#111] border border-white/[0.08] rounded-2xl p-4 hover:bg-[#151515] hover:border-white/[0.14] transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Cliente */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {payment.clientName}
                    </h3>

                    <p className="text-sm text-white/40 truncate mt-0.5">
                      {payment.service}
                    </p>
                  </div>
                </div>

                {/* Informações */}
                <div className="hidden sm:flex items-center gap-10 shrink-0">
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">
                      Valor
                    </p>

                    <span className="font-semibold text-white">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">
                      Vencimento
                    </p>

                    <span className="text-sm text-white/70">
                      {formatDate(payment.dueDate)}
                    </span>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">
                      Status
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.dotClassName}`}
                      />

                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === payment.id ? null : payment.id)
                    }
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <FiMoreVertical size={18} />
                  </button>

                  {openMenu === payment.id && (
                    <div className="absolute right-0 top-11 w-52 bg-[#151515] border border-white/[0.1] rounded-xl p-1.5 shadow-2xl shadow-black/40 z-50">
                      <button
                        onClick={() => {
                          setEditingPayment(payment);
                          setOpenForm(true);
                          setOpenMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <FiEdit size={16} />
                        Editar
                      </button>

                      {payment.status === "PENDING" && (
                        <button
                          onClick={() => markPaid(payment.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <FiCheck size={16} />
                          Marcar como pago
                        </button>
                      )}

                      <div className="h-px bg-white/[0.06] my-1" />

                      <button
                        onClick={() => deletePayment(payment.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/[0.06] transition-colors"
                      >
                        <FiTrash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="sm:hidden mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                    Valor
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                    Vencimento
                  </p>

                  <p className="text-sm text-white/60">
                    {formatDate(payment.dueDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dotClassName}`}
                    />

                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
