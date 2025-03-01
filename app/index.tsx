import { Redirect } from 'expo-router';

export default function Index() {
  // Replace with your actual auth check
  const isAuthenticated = false;

  // If authenticated, redirect to main app
  // If not authenticated, redirect to auth flow
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/login"} />;
}