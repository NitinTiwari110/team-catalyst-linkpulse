"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";
import { requestSignupOtp, verifySignupOtp, OtpSession } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  // Step 1 Form State (explicitly empty string)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field Touched / Blur State
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Step 2 OTP State
  const [step, setStep] = useState<1 | 2>(1);
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null);
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Real-time Gmail check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const isEmailValid = emailRegex.test(email.trim().toLowerCase());

  const emailError = useMemo(() => {
    if (!emailTouched || !email.trim()) return null;
    if (!email.includes("@")) return "Missing '@' in email address.";
    if (email.includes("#")) return "Email cannot contain '#' or invalid symbols.";
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return "Must be a valid @gmail.com address (e.g. name@gmail.com).";
    }
    if (!isEmailValid) return "Please enter a valid Gmail format.";
    return null;
  }, [email, emailTouched, isEmailValid]);

  // Real-time Password Rules
  const passwordRules = useMemo(() => {
    return {
      hasMinLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid =
    passwordRules.hasMinLength &&
    passwordRules.hasUppercase &&
    passwordRules.hasNumber &&
    passwordRules.hasSymbol;

  const isFormValid = name.trim().length >= 2 && isEmailValid && isPasswordValid;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);
    try {
      const session = await requestSignupOtp(name, email.trim().toLowerCase(), password);
      setOtpSession(session);
      setStep(2);
      setResendTimer(30);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBackendError(err.message);
      } else {
        setBackendError("Failed to initiate verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otpValues];
    updated[index] = digit;
    setOtpValues(updated);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpValues(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    if (otpSession?.demoOtp) {
      setOtpValues(otpSession.demoOtp.split(""));
      setBackendError(null);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      setBackendError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!otpSession) return;

    setLoading(true);
    setBackendError(null);

    try {
      await verifySignupOtp(otpSession.email, fullOtp);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBackendError(err.message);
      } else {
        setBackendError("Invalid verification code. Please check your code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4 selection:bg-blue-600/15 selection:text-blue-600">
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="h-[500px] w-full max-w-4xl bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]" />
      </div>

      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Link<span className="text-blue-600">Pulse</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2 font-medium">
          {step === 1
            ? "Create an account to start managing smart links"
            : "Two-Factor Verification Step"}
        </p>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl card-float">
        {step === 1 ? (
          <>
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Create Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic @gmail.com required for verification
              </p>
            </div>

            {backendError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 animate-slide-up">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{backendError}</span>
              </div>
            )}

            {/* Form with AutoComplete Disabled to block Chrome Autofill */}
            <form onSubmit={handleInitiateSignup} autoComplete="off" className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gmail Address (@gmail.com)
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (backendError) setBackendError(null);
                    }}
                    placeholder="name@gmail.com"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-9 text-xs text-slate-900 focus:outline-none transition-all font-medium ${
                      emailError
                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : isEmailValid && emailTouched
                        ? "border-emerald-300 bg-emerald-50/20 focus:border-emerald-500"
                        : "border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                  />
                  {isEmailValid && emailTouched && (
                    <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                  )}
                </div>

                {emailError && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-rose-600 animate-slide-up">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onFocus={() => setPasswordTouched(true)}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-11 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-press absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {(passwordTouched || password.length > 0) && (
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 animate-slide-up">
                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
                        passwordRules.hasMinLength
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {passwordRules.hasMinLength ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3" />}
                      <span>6+ Characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
                        passwordRules.hasUppercase
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {passwordRules.hasUppercase ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3" />}
                      <span>1 Uppercase (A-Z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
                        passwordRules.hasNumber
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {passwordRules.hasNumber ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3" />}
                      <span>1 Number (0-9)</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
                        passwordRules.hasSymbol
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {passwordRules.hasSymbol ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3" />}
                      <span>1 Special Symbol (!@#)</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-glow w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In here
              </Link>
            </p>
          </>
        ) : (
          /* STEP 2: 6-Digit OTP Verification Screen */
          <div className="animate-slide-up">
            <button
              type="button"
              onClick={() => { setStep(1); setBackendError(null); }}
              className="btn-press inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Change email</span>
            </button>

            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Verify Your Email</h2>
                <p className="text-[11px] text-slate-500">
                  Enter the 6-digit code sent to your Gmail
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-200/90 bg-blue-50/70 p-3.5 text-xs text-blue-900">
              <p className="font-semibold flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Check your inbox &amp; spam folder:</span>
              </p>
              <p className="font-mono text-xs font-bold text-blue-700 mt-1 pl-5">
                {otpSession?.maskedEmail}
              </p>
            </div>

            {otpSession?.demoOtp && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Demo OTP: <strong className="font-mono text-sm tracking-widest text-emerald-700">{otpSession.demoOtp}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="btn-press rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {backendError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{backendError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5">
              <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-11 sm:w-12 rounded-xl border border-slate-200 bg-slate-50/80 text-center font-mono text-lg font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.join("").length !== 6}
                className="btn-glow w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify Code &amp; Create Account</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-500">
                {resendTimer > 0 ? (
                  <span>Resend code in <strong>{resendTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (otpSession) {
                        requestSignupOtp(name, email, password).then((s) => {
                          setOtpSession(s);
                          setResendTimer(30);
                        });
                      }
                    }}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Resend Code Now
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Client-side pre-validation + Spring Security 6 encryption</span>
      </div>
    </div>
  );
}