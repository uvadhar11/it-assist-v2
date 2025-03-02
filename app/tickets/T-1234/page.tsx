import Link from "next/link";
// import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  PhoneIcon,
  PlayIcon,
  //   PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ArrowLeft,
} from "lucide-react";

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  //   // Generate params for all ticket IDs we want to pre-render
  const defaultParams = [
    { id: "T-1234" },
    //     // { id: "T-1235" },
    //     // { id: "T-1236" },
    //     // { id: "T-1237" },
    //     // { id: "T-1238" },
  ];

  return defaultParams;
  //   // return customParams ? customParams : defaultParams;
}

// export default async function CallDetails({
//   params,
// }: {
//   params: Promise<{ callID: string }>;
// }) {
//   const callID = (await params).callID;
//   return (
//     <div>
//       <h1>Call {callID}</h1>
//     </div>
//   );
// }

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  // const callID = (await params).callId;
  const callID = "T-1234";

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 w-screen bg-[url('/gradient.png')] bg-cover bg-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tickets</span>
            </Button>
          </Link>
          <span className="text-sm text-gray-500">Ticket #{callID}</span>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="flex">
            {/* Left sidebar with avatar */}
            {/* <div className="w-16 bg-gray-200 flex-shrink-0">
              <div className="p-3">
                <Avatar className="h-10 w-10 bg-gray-300">
                  <span className="sr-only">User avatar</span>
                </Avatar>
              </div>
            </div> */}

            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Header section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-gray-600 mb-1">Subject</h2>
                  <h1 className="text-xl font-semibold">
                    Product not working as expected
                  </h1>
                </div>
                <Button
                  variant="default"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Close Ticket
                </Button>
              </div>

              {/* Tabs and content */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-4 bg-transparent border-b border-gray-200 w-full justify-start">
                  <TabsTrigger
                    value="summary"
                    className="data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2"
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="transcript"
                    className="data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2"
                  >
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestions"
                    className="data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2"
                  >
                    Suggestions
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-6">
                  <TabsContent value="summary" className="mt-0 flex-1">
                    <div className="bg-gray-100 rounded p-4 h-full overflow-y-auto">
                      <h3 className="font-medium mb-3">Call Summary</h3>
                      <p className="text-gray-700 mb-3">
                        Customer reported issues with their recently purchased
                        software. The application crashes when attempting to
                        import large files.
                      </p>

                      <h4 className="font-medium mt-4 mb-2">Key Points:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Customer purchased the software 2 weeks ago</li>
                        <li>Issue occurs only with files larger than 100MB</li>
                        <li>Customer has already tried reinstalling</li>
                        <li>
                          Error message mentions &quote;memory allocation&quote;
                        </li>
                      </ul>

                      <h4 className="font-medium mt-4 mb-2">Next Steps:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Escalate to development team</li>
                        <li>
                          Send customer temporary workaround documentation
                        </li>
                        <li>Schedule follow-up call in 3 days</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="transcript" className="mt-0 flex-1">
                    <div className="bg-gray-100 rounded p-4 h-full overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Agent (00:12)</p>
                          <p className="text-gray-800">
                            Thank you for calling support. How can I help you
                            today?
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Customer (00:18)
                          </p>
                          <p className="text-gray-800">
                            Hi, I&#39;m having trouble with your software. It
                            keeps crashing when I try to import my files.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Agent (00:25)</p>
                          <p className="text-gray-800">
                            I&#39;m sorry to hear that. Can you tell me more
                            about when this happens?
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Customer (00:32)
                          </p>
                          <p className="text-gray-800">
                            It only happens with larger files, around 100MB or
                            more. Smaller files work fine.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Agent (00:45)</p>
                          <p className="text-gray-800">
                            I see. And does it show any error message when it
                            crashes?
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Customer (00:52)
                          </p>
                          <p className="text-gray-800">
                            Yes, something about memory allocation. I&#39;ve
                            already tried reinstalling it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="suggestions" className="mt-0 flex-1">
                    <div className="bg-gray-100 rounded p-4 h-full overflow-y-auto">
                      <h3 className="font-medium mb-3">AI Suggestions</h3>

                      <div className="space-y-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="text-sm font-medium mb-1">
                            Known Issue: Memory Allocation
                          </h4>
                          <p className="text-sm text-gray-700">
                            This appears to match known issue #4872. The
                            development team has a fix scheduled for the next
                            release.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>

                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="text-sm font-medium mb-1">
                            Suggested Workaround
                          </h4>
                          <p className="text-sm text-gray-700">
                            Recommend splitting large files into smaller chunks
                            before import. Our documentation has a guide for
                            this process.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Send to Customer
                          </Button>
                        </div>

                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="text-sm font-medium mb-1">
                            Similar Tickets
                          </h4>
                          <p className="text-sm text-gray-700">
                            3 similar tickets were resolved in the past week.
                            Check related solutions.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Similar Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Right sidebar with ticket info */}
                  <div className="w-64 flex-shrink-0">
                    <Card className="p-5 border border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Ticket #</h3>
                          <p className="text-gray-700">{callID}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-1">Status</h3>
                          <Badge
                            variant="outline"
                            className="bg-yellow-500 text-white"
                          >
                            In Progress
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-1">Phone #</h3>
                          <p className="text-gray-700">(555) 123-4567</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-1">Email</h3>
                          <p className="text-gray-700 text-sm">
                            customer@example.com
                          </p>
                        </div>

                        <Button
                          variant="default"
                          className="w-full bg-black text-white hover:bg-gray-800 mt-4"
                        >
                          Update
                        </Button>
                      </div>
                    </Card>

                    {/* Audio player */}
                    <Card className="mt-4 bg-gray-200 border-0">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PhoneIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-xs text-gray-600">
                            Call ended • 3:30
                          </span>
                        </div>

                        <div className="bg-gray-700 p-3 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Slider
                              defaultValue={[33]}
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                          </div>

                          <div className="flex justify-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-gray-600"
                            >
                              <SkipBackIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-gray-600"
                            >
                              <PlayIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-gray-600"
                            >
                              <SkipForwardIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
