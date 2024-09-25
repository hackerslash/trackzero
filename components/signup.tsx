"use client";

import Link from "next/link";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      console.log("Signed up successfully", userCredential);
      router.push("/");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      console.log("Signed up with Google successfully", result.user);
      router.push("/");
    } catch (error) {
      console.log("Cannot sign up with Google");
      setError((error as Error).message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
        <svg
            className="mx-auto h-20 w-auto text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 1080 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1 0 0 1 540 256)">
              <rect
                className="hidden"
                x="-540"
                y="-256"
                width="1080"
                height="512"
                fill="white"
              />
            </g>
            <g transform="matrix(1.96 0 0 1.96 580 256)">
              <text
                className="text-[105px] font-black"
                font-family="Raleway"
                fill="rgb(79,70,239)"
              >
                <tspan x="-264.07" y="32.98">
                  TrackZero
                </tspan>
              </text>
            </g>
          </svg>

          <h2 className="mt-6 text-3xl font-bold text-white">Create Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                placeholder="Username"
              />
            </div>
            <div>
              <Label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                placeholder="Email address"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                placeholder="Password"
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              Error: {error}
            </div>
          )}
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleGoogleSignUp}
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// export function Signup() {
//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//       <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-bold text-white">
//             Create Account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" action="#" method="POST">
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <Label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
//                 Username
//               </Label>
//               <Input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
//                 placeholder="Username"
//               />
//             </div>
//             <div>
//               <Label htmlFor="email-address" className="block text-sm font-medium text-gray-400 mb-1">
//                 Email address
//               </Label>
//               <Input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <Label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <div>
//             <Button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign up
//             </Button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
//             </div>
//           </div>

//           <div className="mt-6">
//             <Button
//               className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
//               </svg>
//               Login with Google
//             </Button>
//           </div>
//         </div>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-400">
//             Already a user?{' '}
//             <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
