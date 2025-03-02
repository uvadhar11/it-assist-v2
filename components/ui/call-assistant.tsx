"use client";

import { useState } from "react";
import { Phone, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallAssistantInterface() {
  const [callStatus, setCallStatus] = useState<"waiting" | "in-progress">(
    "waiting"
  );

  const handleJoinCall = () => {
    setCallStatus("in-progress");
  };

  const handleEndCall = () => {
    setCallStatus("waiting");
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto pt-6">
      {callStatus === "waiting" ? (
        <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="font-medium">Billy Bob</div>
            <div className="text-sm text-gray-500">AI assistant is active</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">15:30</div>
            <Button
              onClick={handleJoinCall}
              className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1 text-sm"
            >
              Join Call
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 text-white rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="font-medium">Billy Bob</div>
            <div className="text-sm text-gray-400">Call in progress</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">15:31</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full h-8 w-8 p-0"
            >
              <Volume2 size={18} />
            </Button>
            <Button
              onClick={handleEndCall}
              variant="ghost"
              size="icon"
              className="bg-red-500 hover:bg-red-600 rounded-full h-8 w-8 p-0"
            >
              <Phone size={18} className="rotate-135" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
