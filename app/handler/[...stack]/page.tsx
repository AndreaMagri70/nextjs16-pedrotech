//vecchia versione

// import { StackHandler } from "@stackframe/stack";

// export default function Handler() {
//   return <StackHandler fullPage />;
// }

// nuova versione
// app/handler/[...stack]/page.tsx
// app/handler/[...stack]/page.tsx

import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server"; 

export default async function Handler(props: { params: Promise<{ stack?: string[] }> }) {
  const params = await props.params;

  return (
    <StackHandler 
      app={stackServerApp} 
      params={params} 
    />
  );
}