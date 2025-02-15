import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface GrammarCorrection {
  correction: string;
  explanation: string;
  original?: string;
}

export const GrammarOutput = ({ output, corrections }: { 
  output: string; 
  corrections: GrammarCorrection[];
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Enhanced Text Display */}
      <textarea
        value={output}
        readOnly
        className="w-full p-4 border rounded-lg h-32 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 resize-none"
      />
      
      {/* Corrections Display */}
      <ScrollArea className="h-72 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4">
          <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-4">
            Corrections Made ({corrections.length})
          </h3>
          
          <div className="space-y-4">
            {corrections.map((correction, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Badge variant="outline" className="h-6">
                    #{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="text-sm">
                      {correction.original && (
                        <span className="text-red-500 dark:text-red-400 line-through mr-2">
                          {correction.original}
                        </span>
                      )}
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {correction.correction}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {correction.explanation}
                    </p>
                  </div>
                </div>
                {index < corrections.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
