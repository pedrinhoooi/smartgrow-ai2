export default function AdminPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin — SmartGrow AI</h1>
      <p>
        Para manter simples e 100% funcional sem gateway, a aprovação é manual via API:
      </p>
      <ol>
        <li>Aprovar PF: POST <code>/api/admin/pf/approve</code> com JSON: {"{ "userId": "...", "approve": true }"}</li>
        <li>Aprovar pagamento Pix: POST <code>/api/admin/payment/approve</code> com JSON: {"{ "paymentId": "...", "approve": true }"}</li>
      </ol>
      <p style={{ color: "#555" }}>
        Dica: crie um usuário ADMIN no banco (role=ADMIN) para usar essas rotas com segurança.
      </p>
    </main>
  );
}
