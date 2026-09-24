import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { SalesSummary } from "../types";
import { parseDecimal } from "../utils/number";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface EmpresaSummaryCardsProps {
  summary: SalesSummary;
  onSaveProfit: (totalProfit: number) => Promise<void>;
  onClearProfit: () => Promise<void>;
}

export function EmpresaSummaryCards({ summary, onSaveProfit, onClearProfit }: EmpresaSummaryCardsProps) {
  const profitPositive = summary.totalProfit >= 0;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setDraft(summary.totalProfit.toFixed(2).replace(".", ","));
    setError(null);
    setEditing(true);
  }

  async function run(action: () => Promise<void>) {
    setSaving(true);
    setError(null);
    try {
      await action();
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível salvar o lucro."));
    } finally {
      setSaving(false);
    }
  }

  function save() {
    const value = parseDecimal(draft);
    if (value === null) {
      setError("Valor inválido. Use um número, ex.: 1.250,00");
      return;
    }
    run(() => onSaveProfit(value));
  }

  return (
    <div className="summary-cards">
      <div className="stat-card">
        <div className="stat-icon stat-icon-balance">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M7 15l4-4 3 3 5-6" />
          </svg>
        </div>
        <span className="stat-label">Pizzas vendidas</span>
        <span className="stat-value">{summary.quantity}</span>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-income">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--good)" strokeWidth="2.2">
            <path d="M12 19V5" />
            <path d="M6 11l6-6 6 6" />
          </svg>
        </div>
        <span className="stat-label">Receita</span>
        <span className="stat-value">{currencyFormatter.format(summary.totalRevenue)}</span>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-expense">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--critical)" strokeWidth="2.2">
            <path d="M12 5v14" />
            <path d="M6 13l6 6 6-6" />
          </svg>
        </div>
        <span className="stat-label">Despesas</span>
        <span className="stat-value">{currencyFormatter.format(summary.totalCost)}</span>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-balance">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <circle cx="17" cy="14.5" r="1.2" fill="var(--accent)" stroke="none" />
          </svg>
        </div>
        <span className="stat-label">Lucro líquido{summary.profitIsManual ? " (manual)" : ""}</span>
        {editing ? (
          <>
            <input
              type="text"
              inputMode="decimal"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            {error && <p className="form-error">{error}</p>}
            <div className="row-actions">
              <button type="button" className="btn-link" disabled={saving} onClick={save}>
                Salvar
              </button>
              <button type="button" className="btn-link" disabled={saving} onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={`stat-value ${profitPositive ? "stat-positive" : "stat-negative"}`}>
              {currencyFormatter.format(summary.totalProfit)}
            </span>
            {error && <p className="form-error">{error}</p>}
            <div className="row-actions">
              <button type="button" className="btn-link" onClick={startEdit}>
                Editar lucro
              </button>
              {summary.profitIsManual && (
                <button type="button" className="btn-link" disabled={saving} onClick={() => run(onClearProfit)}>
                  Voltar ao automático ({currencyFormatter.format(summary.autoProfit ?? 0)})
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
