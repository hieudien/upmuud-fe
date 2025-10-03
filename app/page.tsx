import LandingPage from "../components/LandingPage";
import { auth } from '@clerk/nextjs/server'
import Dashboard from "./dashboard/page";


export default async function Home() {
  const { isAuthenticated } = await auth()

  return (
    isAuthenticated ? <Dashboard/> : <LandingPage />
  );
}
