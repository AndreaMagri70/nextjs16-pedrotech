export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full space-y-4">
      {/* Spinner animato viola */}
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      
      {/* Testo di cortesia */}
      <p className="text-gray-500 font-medium animate-pulse">
        Caricamento inventario...
      </p>
    </div>
  );
}