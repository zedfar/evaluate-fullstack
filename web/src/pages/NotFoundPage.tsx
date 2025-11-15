import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark text-center px-4">
      <div className="max-w-md flex flex-col items-center">
        {/* Icon atau ilustrasi */}
        <div className="mb-8">
          <span className="material-symbols-outlined text-[100px] text-primary">
            error
          </span>
        </div>

        {/* Judul dan teks */}
        <h1 className="text-5xl font-bold text-[#1c170d] dark:text-white mb-4">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-[#1c170d] font-bold px-6 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
