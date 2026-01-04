// stack/server.tsx
import { StackServerApp } from "@stackframe/stack";
import { stackClientApp } from "./client";

export const stackServerApp = new StackServerApp({
  // Se clientApp o inheritsFrom danno errore, lascialo vuoto 
  // o usa la proprietà corretta per la tua versione che è semplicemente:
  tokenStore: "nextjs-cookie", 
});