import Header from '../components/Header'
import Footer from '../components/Footer'
import { getServerSession } from "next-auth/next";
import authOptions from "../pages/api/auth/[...nextauth]";
import { createHmac } from "crypto";
import type { Session } from "next-auth";

export default async function Page() {
  const session: Session | null = await getServerSession(authOptions);

  console.log('session', session);

  const email = session?.user?.email;
  let privateKey: string | undefined;
  
  if (email) {
    const emailHash = createHmac("sha256", process.env.SECRET_SALT!)
      .update(email).digest("hex");
    
    privateKey = createHmac("sha256", process.env.SECRET_SALT!)
      .update(emailHash).digest("hex");
  }
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Header privateKey={privateKey} />
      <Footer />
    </main>
  )
}
