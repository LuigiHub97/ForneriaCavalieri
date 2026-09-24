import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { PizzaSale } from "../types";
import { parseDecimal } from "../utils/number";

interface SaleListProps {
  sales: PizzaSale[];
  onDelete: (sale: PizzaSale) => void;
  onUpdateProfit: (sale: PizzaSale, totalProfit: number) => Promise<void>;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

export function SaleList({ sales, onDelete, onUpdateProfit }: SaleListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profitDraft, setProfitDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function startEdit(sale: PizzaSale) {
    setEditingId(sale.id);
    setEditError(null);
    setProfitDraft(sale.totalProfit.toFixed(2).replace(".", ","));
  }

  async function saveEdit(sale: PizzaSale) {
    const value = parseDecimal(profitDraft);
    if (value === null) {
      setEditError("Valor inválido. Use um número, ex.: 12,50");
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      await onUpdateProfit(sale, value);
      setEditingId(null);
    } catch (err) {
      setEditError(getErrorMessage(err, "Não foi possível salvar o lucro."));
    } finally {
      setSaving(false);
    }
  }

  if (sales.length === 0) {
    return <p className="empty-state">Nenhuma venda registrada nesse período.</p>;
  }

  return (
    <div className="table-scroll">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Pizza</th>
            <th>Qtd</th>
            <th>Receita</th>
            <th>Lucro</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td data-label="Data">{dateFormatter.format(new Date(s.date))}</td>
              <td data-label="Pizza">{s.pizzaName}</td>
              <td data-label="Qtd">{s.quantity}</td>
              <td data-label="Receita">{currencyFormatter.format(s.totalRevenue)}</td>
              {editingId === s.id ? (
                <td data-label="Lucro">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={profitDraft}
                    autoFocus
                    onChange={(e) => setProfitDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(s);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  {editError && <p className="form-error">{editError}</p>}
                </td>
              ) : (
                <td data-label="Lucro" className={s.totalProfit >= 0 ? "amount-income" : "amount-expense"}>
                  {currencyFormatter.format(s.totalProfit)}
                </td>
              )}
              <td data-label="" className="row-actions">
                {editingId === s.id ? (
                  <>
                    <button className="btn-link" disabled={saving} onClick={() => saveEdit(s)}>
                      Salvar
                    </button>
                    <button className="btn-link" disabled={saving} onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-link" onClick={() => startEdit(s)}>
                      Editar lucro
                    </button>
                    <button className="btn-link btn-link-danger" onClick={() => onDelete(s)}>
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
