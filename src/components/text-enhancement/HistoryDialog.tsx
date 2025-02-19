import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RevisionHistoryItem, Change } from "@/types/text-enhancement";

interface HistoryDialogProps {
  revisionHistory: RevisionHistoryItem[];
}

export const HistoryDialog = ({ revisionHistory }: HistoryDialogProps) => {
  return (
    <dialog id="historyDialog" className="modal p-0 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Revision History</h3>
          <Button variant="ghost" size="sm" onClick={() => (document.getElementById("historyDialog") as HTMLDialogElement)?.close()}>
            ✕
          </Button>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {revisionHistory.map((revision, index) => (
            <motion.div
              key={revision.timestamp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {new Date(revision.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {revision.changes.map((change: Change, changeIndex: number) => (
                  <div key={changeIndex} className="text-sm">
                    <span className="font-medium">{change.type}:</span> {change.description}
                  </div>
                ))}
              </div>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <p className="text-sm">{revision.text}</p>
              </div>
              {index < revisionHistory.length - 1 && <Separator className="my-4" />}
            </motion.div>
          ))}
        </ScrollArea>
      </div>
    </dialog>
  );
};