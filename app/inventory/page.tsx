import Sidebar from "@/components/sidebar";
import getCurrentUser from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/lib/actions/products";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// export default async function InventoryPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ q?: string }>;
// }) {
//   const user = await getCurrentUser();
//   const userId = user.id;

//   const params = await searchParams;
//   const q = (params.q ?? "").trim();

//   const totalProducts = await prisma.product.findMany({ 
//     where: { userId, name: { contains: q } },
//    });

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>; // Aggiunto page
}) {
  // 1. Autenticazione (Codice Profe)
  const user = await getCurrentUser();
  const userId = user.id;

  // 2. Gestione parametri URL (Codice Profe + Paginazione)
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const currentPage = Number(params.page) || 1; // Recupera la pagina o parte da 1
  const pageSize = 10; // Quanti prodotti per pagina
  const skipValue = (currentPage - 1) * pageSize; // L'abbiamo chiamata skipValue per chiarezza

  // 3. Query Prisma Integrata
  // Usiamo Promise.all per fare due operazioni contemporaneamente e velocizzare il sito
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { 
        userId, 
        name: { contains: q } 
      },
      take: pageSize,                // Prendi solo 10
      // skip: (currentPage - 1) * pageSize,  Salta quelli delle pagine prima
      skip: skipValue,     // Salta i precedenti (Qui l'errore dovrebbe sparire)
      orderBy: { createdAt: "desc" } // I più recenti in alto
    }),
    prisma.product.count({           // Conta quanti sono in totale per la ricerca attuale
      where: { userId, name: { contains: q } }
    })
  ]);

  // 4. Calcolo per la UI
  const totalPages = Math.ceil(totalCount / pageSize);

  const totalProducts = await prisma.product.findMany({ 
  where: { userId, name: { contains: q } },
});

  return (
      <div className="min-h-screen bg-gray-50">
              <Sidebar currentPath="/inventory" />
              <main className="ml-64 p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 ">Inventory</h1>
                      <p className="text-sm text-gray-500">Manage your products and track inventory levels</p>
                    </div>
                  </div>
                </div>


                <div className="space-y-6">
                  {/* Search */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <form className="flex gap-2" action="/inventory" method="GET">
                      <input
                        name="q"
                        placeholder="Search products..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                      />
                      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Search
                      </button>
                                           
                    </form>
                  </div>


                  {/* Products table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-violet-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Low Stock At</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product, key) =>(
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm text-gray-500">{product.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{product.sku || "-"}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">$ {Number(product.price).toFixed(2)}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{product.quantity}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{product.lowStockAt}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">
                              <form 
                              action={async (formData: FormData) => {
                                "use server";
                                await deleteProduct(formData);
                              }}
                              >
                                <input type="hidden" name="id" value={product.id} />
                                <button className="text-red-600 hover:text-red-900 font-bold">
                                  DELETE
                                </button>
                              </form>
                            </td>

                          </tr>
                        ))}
              </tbody>
            </table>

          </div>
          <div className="flex justify-center">
            
          {/* Sotto la tabella */}
            <div className="py-4 bg-white border-t border-gray-200 rounded-b-lg flex justify-center">
              <Pagination>
                <PaginationContent>

                  {/* Bottone Indietro */}
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/inventory?page=${currentPage - 1}${q ? `&q=${q}` : ""}`}
                      aria-disabled={currentPage <= 1}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {/* Ciclo per i numerini */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={`/inventory?page=${p}${q ? `&q=${q}` : ""}`}
                        isActive={currentPage === p}                       
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Bottone Avanti */}
                  <PaginationItem>
                    <PaginationNext
                      href={`/inventory?page=${currentPage + 1}${q ? `&q=${q}` : ""}`}
                      aria-disabled={currentPage >= totalPages}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>

    </div>



  )
}
