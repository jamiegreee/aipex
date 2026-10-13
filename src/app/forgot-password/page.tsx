import AuthPage from "@/components/learning/AuthPage";
export const metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return <AuthPage mode="forgot" searchParams={searchParams} />;
}
