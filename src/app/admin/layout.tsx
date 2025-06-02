import "~/app/admin/styles.css";

export const metadata = {
  title: "Admin Dashboard - Image Management",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
