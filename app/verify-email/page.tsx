export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-blue-50 p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-3 text-blue-900">Verify your email</h1>
        <p className="text-gray-700 mb-3">
          We've sent a verification link to your email.<br />
          Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-400">Didn't get the email? Check your spam folder or request another verification from your profile settings.</p>
      </div>
    </div>
  )
}
