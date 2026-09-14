"use client";

import { useState, useEffect } from "react";

interface Payment {
  id: string;
  clientName: string;
  service: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "PAID";
}

type PaymentFormProps = {
  onSuccess: () => void;
  payment: Payment | null;
};

export default function PaymentForm({ onSuccess, payment }: PaymentFormProps) {
  const [clientName, setClientName] = useState("");
  const [service, setService] = useState("");
  const [serviceValue, setServiceValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function save() {
    if (!clientName || !service || !serviceValue || !dueDate) {
      alert("Preencha todos os campos.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      let response;

      if (payment) {
        response = await fetch("/api/edit-payment", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: payment.id,
            clientName,
            service,
            serviceValue,
            dueDate,
          }),
        });
      } else {
        response = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName,
            service,
            serviceValue,
            dueDate,
          }),
        });
      }

      if (!response.ok) {
        alert("Erro");
        return;
      }

      onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (payment) {
      setClientName(payment.clientName);
      setService(payment.service);
      setServiceValue(String(payment.amount));
      setDueDate(payment.dueDate.split("T")[0]);
    } else {
      setClientName("");
      setService("");
      setServiceValue("");
      setDueDate("");
    }
  }, [payment]);

  return (
    <form
      className="bg-[#111] border border-[#333] rounded-xl shadow-md p-6 max-w-md space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <h2 className="text-xl font-semibold">
        {payment ? "Editar Pagamento" : "Novo Pagamento"}
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Nome do cliente
        </label>
        <input
          className="w-full border border-[#333] rounded-lg px-3 py-2"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          type="text"
          name="clientName"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Serviço</label>
        <input
          className="w-full border border-[#333] rounded-lg px-3 py-2"
          value={service}
          onChange={(e) => setService(e.target.value)}
          type="text"
          name="service"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Valor do serviço
        </label>
        <input
          className="w-full border border-[#333] rounded-lg px-3 py-2"
          value={serviceValue}
          onChange={(e) => setServiceValue(e.target.value)}
          type="number"
          step="0.01"
          min="0"
          name="amount"
        />
      </div>

      <div>
        <label>Data de pagamento</label>
        <input
          className="w-full border border-[#333] rounded-lg px-3 py-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          name="dueDate"
          min={todayString}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="
    w-full
    flex
    items-center
    justify-center
    gap-2
    bg-white
    text-black
    font-medium
    py-2.5
    rounded-lg
    transition-all
    duration-200
    hover:bg-white/90
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span>Salvando...</span>
          </>
        ) : payment ? (
          "Salvar Alterações"
        ) : (
          "Criar Pagamento"
        )}
      </button>
    </form>
  );
}
