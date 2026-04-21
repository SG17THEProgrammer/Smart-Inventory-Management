export function generateAlerts({
  stock,
  threshold,
  stockoutDays,
}: {
  stock: number;
  threshold: number;
  stockoutDays: number | null;
}) {
  const alerts = [];

  if (stock <= threshold) {
    alerts.push("⚠️ Low stock level");
  }

  if (stockoutDays !== null && stockoutDays < 3) {
    alerts.push("🚨 Stock will run out very soon");
  }

  if (stockoutDays !== null && stockoutDays < 1) {
    alerts.push("🔥 Critical: Immediate restock required");
  }

  return alerts;
}