"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminLogin() {
  console.log("[LOGIN] Component started rendering");

  const router = useRouter();
  console.log("[LOGIN] Router initialized:", !!router);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("[LOGIN] State initialized");

  const handleLogin = async (e: React.FormEvent) => {
    console.log("[LOGIN] handleLogin called");
    e.preventDefault();
    setLoading(true);
    console.log("[LOGIN] Loading set to true");

    try {
      console.log("[LOGIN] Fetching /api/auth/login");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[LOGIN] Response received:", response.status);

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token } = await response.json();
      console.log("[LOGIN] Token received");
      localStorage.setItem("authToken", token);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("[LOGIN] Error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
      console.log("[LOGIN] Loading set to false");
    }
  };

  console.log("[LOGIN] About to return JSX");

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
              onChange={(e) => {
                console.log("[LOGIN] Email changed:", e.target.value);
                setEmail(e.target.value);
              }}
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
              onChange={(e) => {
                console.log("[LOGIN] Password changed");
                setPassword(e.target.value);
              }}
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
