import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const P = "/make-server-f021205c";
const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.get(`${P}/health`, (c) => c.json({ status: "ok" }));

// ── Helpers ───────────────────────────────────────────────────────────────

const hashPw = async (pw: string): Promise<string> => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const authUser = async (c: any) => {
  const h = c.req.header("Authorization");
  if (!h?.startsWith("Bearer ")) return null;
  const uid = await kv.get(`session:${h.slice(7)}`);
  if (!uid) return null;
  return kv.get(`user:${uid}`);
};

const safe = (u: any) => { if (!u) return null; const { passwordHash: _, ...s } = u; return s; };

// ── Seed ──────────────────────────────────────────────────────────────────

app.post(`${P}/seed`, async (c) => {
  if (await kv.get("seeded_v2")) return c.json({ message: "Already seeded" });

  const users = [
    {
      id: "admin-001", email: "admin@blackdiamond.com", phone: "+10000000000",
      passwordHash: await hashPw("admin123"), firstName: "Admin", lastName: "Diamond",
      otherNames: "", mothersMaidenName: "", dob: "1980-01-01",
      country: "United States", state: "New York", address: "1 Black Diamond Plaza",
      annualRevenue: ">$100,000", role: "admin",
      balance: 0, totalInvested: 0, weeklyReturn: 0, solanaAddress: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: "investor-001", email: "investor1@blackdiamond.com", phone: "+11111111111",
      passwordHash: await hashPw("client123"), firstName: "James", lastName: "Harrington",
      otherNames: "", mothersMaidenName: "Smith", dob: "1985-06-15",
      country: "United States", state: "California", address: "123 Sunset Boulevard, Los Angeles",
      annualRevenue: "$50,000-$100,000", role: "investor",
      balance: 12500, totalInvested: 10000, weeklyReturn: 3000,
      solanaAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      createdAt: new Date().toISOString(),
    },
    {
      id: "investor-002", email: "investor2@blackdiamond.com", phone: "+12222222222",
      passwordHash: await hashPw("client123"), firstName: "Sarah", lastName: "Mitchell",
      otherNames: "Anne", mothersMaidenName: "Johnson", dob: "1990-03-22",
      country: "United Kingdom", state: "England", address: "45 Kensington Gardens, London",
      annualRevenue: "$50,000-$100,000", role: "investor",
      balance: 27500, totalInvested: 50000, weeklyReturn: 15000,
      solanaAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const u of users) {
    await kv.set(`user:${u.id}`, u);
    await kv.set(`email:${u.email}`, u.id);
  }
  await kv.set("users_list", users.map(u => u.id));

  await kv.set("deposit_methods", {
    bitcoin: { enabled: true, label: "Bitcoin (BTC)", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "" },
    usdt:    { enabled: true, label: "USDT (ERC-20)",  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", network: "ERC-20" },
    eth:     { enabled: true, label: "Ethereum (ETH)", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", network: "" },
    solana:  { enabled: true, label: "Solana (SOL)" },
    bank:    {
      enabled: true, label: "Bank Transfer",
      bankName: "Black Diamond Capital Bank",
      accountName: "Black Diamond Company Ltd",
      accountNumber: "1234567890",
      routing: "021000021",
      swift: "BOFAUS3N",
    },
  });

  await kv.set("admin_settings", { supportEmail: "hjkkh4957@gmail.com" });

  const now = new Date();
  const weeksAgo = (n: number) => new Date(now.getTime() - n * 7 * 86400000).toISOString();

  await kv.set("transactions:investor-001", [
    { id: "t1", userId: "investor-001", type: "deposit",  amount: 10000, currency: "USDT", status: "completed", createdAt: weeksAgo(4), note: "Initial deposit – Growth Package" },
    { id: "t2", userId: "investor-001", type: "return",   amount: 3000,  currency: "USD",  status: "completed", createdAt: weeksAgo(3), note: "Weekly return (30%)" },
    { id: "t3", userId: "investor-001", type: "return",   amount: 3000,  currency: "USD",  status: "completed", createdAt: weeksAgo(2), note: "Weekly return (30%)" },
    { id: "t4", userId: "investor-001", type: "return",   amount: 3000,  currency: "USD",  status: "completed", createdAt: weeksAgo(1), note: "Weekly return (30%)" },
    { id: "t5", userId: "investor-001", type: "return",   amount: 3000,  currency: "USD",  status: "pending",   createdAt: weeksAgo(0), note: "Weekly return (30%) – Processing" },
  ]);

  await kv.set("transactions:investor-002", [
    { id: "t6", userId: "investor-002", type: "deposit",  amount: 50000, currency: "BTC",  status: "completed", createdAt: weeksAgo(5), note: "Initial deposit – Premier Package" },
    { id: "t7", userId: "investor-002", type: "return",   amount: 15000, currency: "USD",  status: "completed", createdAt: weeksAgo(4), note: "Weekly return (30%)" },
    { id: "t8", userId: "investor-002", type: "return",   amount: 15000, currency: "USD",  status: "completed", createdAt: weeksAgo(3), note: "Weekly return (30%)" },
    { id: "t9", userId: "investor-002", type: "return",   amount: 15000, currency: "USD",  status: "completed", createdAt: weeksAgo(2), note: "Weekly return (30%)" },
    { id: "t10",userId: "investor-002", type: "return",   amount: 15000, currency: "USD",  status: "completed", createdAt: weeksAgo(1), note: "Weekly return (30%)" },
  ]);

  await kv.set("seeded_v2", true);
  return c.json({ message: "Seeded" });
});

// ── Auth ──────────────────────────────────────────────────────────────────

app.post(`${P}/auth/signup`, async (c) => {
  const b = await c.req.json();
  if (!b.email || !b.password || !b.firstName) return c.json({ error: "Missing required fields" }, 400);
  if (await kv.get(`email:${b.email}`)) return c.json({ error: "Email already registered" }, 400);

  const id = crypto.randomUUID();
  const user = {
    id, email: b.email, phone: b.phone || "",
    passwordHash: await hashPw(b.password),
    firstName: b.firstName, lastName: b.lastName || "",
    otherNames: b.otherNames || "", mothersMaidenName: b.mothersMaidenName || "",
    dob: b.dob || "", country: b.country || "", state: b.state || "",
    address: b.address || "", annualRevenue: b.annualRevenue || "",
    role: "investor", balance: 0, totalInvested: 0, weeklyReturn: 0,
    solanaAddress: "", createdAt: new Date().toISOString(),
  };

  await kv.set(`user:${id}`, user);
  await kv.set(`email:${b.email}`, id);
  const list: string[] = (await kv.get("users_list")) || [];
  list.push(id);
  await kv.set("users_list", list);

  const token = crypto.randomUUID();
  await kv.set(`session:${token}`, id);
  return c.json({ token, user: safe(user) });
});

app.post(`${P}/auth/login`, async (c) => {
  const { email, password } = await c.req.json();
  const uid = await kv.get(`email:${email}`);
  if (!uid) return c.json({ error: "Invalid credentials" }, 401);
  const user = await kv.get(`user:${uid}`);
  if (!user || (await hashPw(password)) !== user.passwordHash)
    return c.json({ error: "Invalid credentials" }, 401);
  const token = crypto.randomUUID();
  await kv.set(`session:${token}`, uid);
  return c.json({ token, user: safe(user) });
});

app.get(`${P}/auth/me`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  return c.json(safe(u));
});

app.post(`${P}/auth/logout`, async (c) => {
  const h = c.req.header("Authorization");
  if (h?.startsWith("Bearer ")) await kv.del(`session:${h.slice(7)}`);
  return c.json({ ok: true });
});

// ── Users ─────────────────────────────────────────────────────────────────

app.get(`${P}/users`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const list: string[] = (await kv.get("users_list")) || [];
  const users = (await Promise.all(list.map(id => kv.get(`user:${id}`)))).filter(Boolean).map(safe);
  return c.json(users);
});

app.get(`${P}/user/:id`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (u.role !== "admin" && u.id !== id) return c.json({ error: "Forbidden" }, 403);
  const target = await kv.get(`user:${id}`);
  if (!target) return c.json({ error: "Not found" }, 404);
  return c.json(safe(target));
});

app.put(`${P}/user/:id`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const id = c.req.param("id");
  const existing = await kv.get(`user:${id}`);
  if (!existing) return c.json({ error: "Not found" }, 404);
  const updates = await c.req.json();
  const updated = { ...existing, ...updates, id, role: existing.role, passwordHash: existing.passwordHash };
  await kv.set(`user:${id}`, updated);
  return c.json(safe(updated));
});

// ── Deposit Methods ───────────────────────────────────────────────────────

app.get(`${P}/deposit-methods`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  return c.json((await kv.get("deposit_methods")) || {});
});

app.put(`${P}/deposit-methods`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const data = await c.req.json();
  await kv.set("deposit_methods", data);
  return c.json(data);
});

// ── Transactions ──────────────────────────────────────────────────────────

app.get(`${P}/transactions/:userId`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  const uid = c.req.param("userId");
  if (u.role !== "admin" && u.id !== uid) return c.json({ error: "Forbidden" }, 403);
  return c.json((await kv.get(`transactions:${uid}`)) || []);
});

app.post(`${P}/transactions`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const b = await c.req.json();
  const txn = {
    id: crypto.randomUUID(), userId: b.userId, type: b.type,
    amount: b.amount, currency: b.currency || "USD",
    status: b.status || "completed",
    createdAt: new Date().toISOString(), note: b.note || "",
  };
  const list = (await kv.get(`transactions:${b.userId}`)) || [];
  list.unshift(txn);
  await kv.set(`transactions:${b.userId}`, list);
  return c.json(txn);
});

// ── Chat ──────────────────────────────────────────────────────────────────

app.get(`${P}/chat/:userId`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  const uid = c.req.param("userId");
  if (u.role !== "admin" && u.id !== uid) return c.json({ error: "Forbidden" }, 403);
  return c.json((await kv.get(`chat:${uid}`)) || []);
});

app.post(`${P}/chat`, async (c) => {
  const u = await authUser(c);
  if (!u) return c.json({ error: "Unauthorized" }, 401);
  const { userId, message } = await c.req.json();
  if (u.role !== "admin" && u.id !== userId) return c.json({ error: "Forbidden" }, 403);
  const msg = {
    id: crypto.randomUUID(), userId,
    senderName: u.role === "admin" ? "Support Agent" : `${u.firstName} ${u.lastName}`,
    senderEmail: u.email, message,
    createdAt: new Date().toISOString(),
    isAdmin: u.role === "admin",
  };
  const list = (await kv.get(`chat:${userId}`)) || [];
  list.push(msg);
  await kv.set(`chat:${userId}`, list);
  return c.json(msg);
});

app.get(`${P}/admin/chats`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const list: string[] = (await kv.get("users_list")) || [];
  const all = await Promise.all(list.map(async id => {
    const user = await kv.get(`user:${id}`);
    const msgs = (await kv.get(`chat:${id}`)) || [];
    return { userId: id, userName: user ? `${user.firstName} ${user.lastName}` : id, userEmail: user?.email, messages: msgs };
  }));
  return c.json(all);
});

// ── Admin Settings ────────────────────────────────────────────────────────

app.get(`${P}/admin/settings`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  return c.json((await kv.get("admin_settings")) || { supportEmail: "hjkkh4957@gmail.com" });
});

app.put(`${P}/admin/settings`, async (c) => {
  const u = await authUser(c);
  if (!u || u.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const data = await c.req.json();
  await kv.set("admin_settings", data);
  return c.json(data);
});

Deno.serve(app.fetch);
