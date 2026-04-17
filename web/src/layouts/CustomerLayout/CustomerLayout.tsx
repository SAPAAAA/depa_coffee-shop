import ProtectedLayout from "@/layouts/ProtectedLayout";

const CustomerLayout = () => {
  return (
    <ProtectedLayout allowedRoles={["customer"]} />
  );
}

export default CustomerLayout;