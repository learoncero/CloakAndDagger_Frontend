import { Role } from "@/app/types";

type Props = {
  role: Role;
};

export default function RoleInformation({ role }: Props) {
  const formattedRole = role.replace(/_/g, " ");

  return (
    <div className="roleInformation bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-md mb-8">
      <div className="flex items-center border-b border-gray-400 mb-2 pb-2">
        <p className="text-lg font-semibold">Role:</p>
        <p className="ml-2 text-lg font-semibold">{formattedRole}</p>
      </div>
    </div>
  );
}
