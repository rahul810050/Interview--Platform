"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useUserRole } from "@/hooks/useUserRole";
import { QUICK_ACTIONS } from "@/constants";
import ActionCard from "@/components/ActionCard";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import MeetingCard from "@/components/MeetingCard";

export default function Home() {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();

  const queryResult = useQuery(api.interviews.getMyInterviews);
  const interviews = queryResult?.data ?? [];
  const status = queryResult?.status ?? "loading";

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    if (title === "New Call") {
      setModalType("start");
      setShowModal(true);
    } else if (title === "Join Interview") {
      setModalType("join");
      setShowModal(true);
    } else {
      router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively."
            : "Access your upcoming interviews and preparations."}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard key={action.title} action={action} onClick={() => handleQuickAction(action.title)} />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">View and join your scheduled interviews.</p>
          </div>

          <div className="mt-8">
            {status === "loading" && (
              <div className="flex justify-center py-12" aria-live="polite">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-12 text-red-500">
                Failed to load interviews. Please try again.
              </div>
            )}

            {status === "success" && (
              <>
                {interviews.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {interviews.map((interview: any) => (
                      <MeetingCard key={interview._id} interview={interview} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">You have no scheduled interviews at the moment.</div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
