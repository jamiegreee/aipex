import AuthPage from "@/components/learning/AuthPage";
export const metadata = {
  title: "New password",
  robots: { index: false, follow: false },
};
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return <AuthPage mode="reset" searchParams={searchParams} />;
}
