import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // 1. Auth Guard
  if (!session) {
    redirect('/login');
  }

  // 2. Fetch Subscription Data
  await dbConnect();
  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">User not found</h1>
          <p className="text-slate-600">Please contact support.</p>
        </div>
      </div>
    );
  }

  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing';

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">SaaS App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">{user.email}</span>
              <a 
                href="/api/auth/signout" 
                className="text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your subscription and billing details.
            </p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-slate-100">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900">
                Subscription Status
              </h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                isActive 
                  ? 'bg-green-50 text-green-700 ring-green-600/20' 
                  : 'bg-amber-50 text-amber-700 ring-amber-600/20'
              }`}>
                {user.subscriptionStatus === 'trialing' ? 'Free Trial' : 
                 user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Current Plan</dt>
                <dd className="mt-1 text-sm text-slate-900">Pro Plan (Monthly)</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Trial Ends At</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Stripe Customer ID</dt>
                <dd className="mt-1 text-sm font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                  {user.stripeCustomerId || 'N/A'}
                </dd>
              </div>
            </dl>

            <div className="mt-8 pt-6 border-t border-slate-100">
              {isActive ? (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Everything looks good!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your subscription is active and you have full access to all features.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Action Required</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>We couldn't find an active subscription for your account.</p>
                      </div>
                      <div className="mt-4">
                        <form action="/api/checkout" method="POST">
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                          >
                            Add Payment Method &rarr;
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
