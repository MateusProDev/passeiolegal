"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would use Firebase Auth
      // For now, this is a placeholder
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', backgroundColor: 'white', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Passeio Legal</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Admin Panel Login</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>
          Credenciais: use sua conta Firebase Auth
        </p>
      </div>
    </div>
  );
}
