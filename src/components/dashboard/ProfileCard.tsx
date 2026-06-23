"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { User, Mail, Calendar } from "lucide-react";
import Image from "next/image";

export function ProfileCard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card className="p-6" aria-label="Loading profile">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { name, email, image } = session.user;

  return (
    <Card className="p-6" aria-label="Profil pengguna">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-purple-100">
            {image ? (
              <Image
                src={image}
                alt={name || "User avatar"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {name || "Pengguna"}
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" />
              {email}
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Bergabung {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
