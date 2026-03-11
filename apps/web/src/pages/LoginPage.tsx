import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </g>
  </svg>
)

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const error = searchParams.get('error')

  useEffect(() => {
    // Reset loading if user navigates back
    setIsLoading(false)
  }, [])

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    window.location.href = '/auth/google'
  }

  const errorMessage =
    error === 'auth_failed'
      ? 'Authentication failed. Please try again.'
      : error === 'unauthorized'
        ? 'You are not authorized to access this page.'
        : error
          ? 'Something went wrong. Please try again.'
          : null

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M7 10h6M10 7v6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-[15px] font-semibold tracking-tight text-neutral-900">
            Order Agent
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.06)] px-8 py-9">
          <div className="mb-7">
            <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900 leading-tight">
              Sign in
            </h2>
            <p className="mt-1.5 text-[13.5px] text-neutral-500 leading-relaxed">
              Continue to your workspace
            </p>
          </div>

          {/* Error state */}
          {errorMessage && (
            <div className="mb-5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-[13px] text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 h-10 px-4 rounded-lg border border-neutral-200 bg-white text-[13.5px] font-medium text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            {isLoading ? (
              <svg
                className="w-4 h-4 animate-spin text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <GoogleIcon />
            )}
            <span>{isLoading ? 'Redirecting…' : 'Continue with Google'}</span>
          </button>

          {/* Divider hint */}
          <p className="mt-6 text-center text-[12px] text-neutral-400 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-5 text-center text-[12px] text-neutral-400">
          New here?{' '}
          <span className="text-neutral-500">
            An account is created automatically on first sign-in.
          </span>
        </p>
      </div>
    </div>
  )
}
