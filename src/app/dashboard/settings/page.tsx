import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { BillingActions } from "./BillingActions";

export default async function SettingsPage() {
  const userId = (await getCurrentUserId())!;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Current plan</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{user?.plan}</p>
        <div className="mt-4">
          <BillingActions plan={user?.plan ?? "FREE"} />
        </div>
      </div>
    </div>
  );
}
