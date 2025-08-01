import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Conta Criada com Sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada e está aguardando aprovação do administrador. 
            Você receberá um email quando sua assinatura for ativada.
          </p>

          <Link className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          href={'/app/'}> Voltar ao inicio </Link>
        </div>
      </div>
    </div>
  );
}