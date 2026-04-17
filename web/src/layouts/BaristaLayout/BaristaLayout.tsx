import ProtectedLayout from "../ProtectedLayout";

const BaristaLayout = () => {
  return (
    <ProtectedLayout allowedRoles={["barista"]} />
  );
}

export default BaristaLayout;