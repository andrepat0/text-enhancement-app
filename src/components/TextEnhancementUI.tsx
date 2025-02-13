import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Eye, History, Settings2, Wand2 } from 'lucide-react';

const TextEnhancementUI = () => {
  const [userId] = useState(() => localStorage.getItem('userId') || '');
  const [apiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [revisionHistory, setRevisionHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [settings, setSettings] = useState({
    tone: 'professional',
    preserveStyle: true,
    maxLength: 1000,
    targetAudience: 'general',
    focusAreas: ['punctuation', 'sentence_structure'],
    fontSize: 16,
    highContrast: false,
    theme: 'light'
  });

  useEffect(() => {
    if (showPreview && inputText) {
      const preview = inputText.replace(/\b([a-z])/g, (_, p1) => p1.toUpperCase());
      setPreviewText(preview);
    }
  }, [inputText, showPreview]);

  const handleApiCall = async (endpoint) => {
    if (!inputText) {
      setError('Please enter some text');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          text: inputText,
          tone: settings.tone,
          preserve_style: settings.preserveStyle,
          max_length: settings.maxLength,
          target_audience: settings.targetAudience,
          focus_areas: settings.focusAreas
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setOutputText(data.result);
        setRevisionHistory(prev => [...prev, {
          timestamp: new Date().toISOString(),
          text: data.result,
          changes: data.fixes || []
        }]);
      } else {
        setError(data.error || `Failed to process ${endpoint}`);
      }
    } catch (err) {
      setError(`API call failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Text Enhancement Suite
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="hover:bg-purple-50 dark:hover:bg-gray-800"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('settingsDialog')?.showModal()}
              className="hover:bg-purple-50 dark:hover:bg-gray-800"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-semibold">Input Text</CardTitle>
              <div className="flex flex-wrap gap-3">
                <Select value={settings.tone} onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={settings.targetAudience} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border rounded-lg h-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 dark:border-gray-700 resize-none"
                placeholder="Enter your text here..."
                style={{ fontSize: `${settings.fontSize}px` }}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">
                  {showPreview ? 'Live Preview' : 'Enhanced Output'}
                </CardTitle>
                {!showPreview && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRevisionHistory(prev => [...prev])}
                    className="hover:bg-purple-50 dark:hover:bg-gray-800"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <textarea
                value={showPreview ? previewText : outputText}
                readOnly
                className="w-full p-4 border rounded-lg h-64 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 resize-none"
                style={{ fontSize: `${settings.fontSize}px` }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={() => handleApiCall('craft-tone')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
          >
            {isLoading && <RotateCw className="w-4 h-4 mr-2 animate-spin" />}
            Craft Tone
          </Button>
          <Button
            onClick={() => handleApiCall('improve-grammar')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
          >
            {isLoading && <RotateCw className="w-4 h-4 mr-2 animate-spin" />}
            Improve Grammar
          </Button>
          <Button
            onClick={() => handleApiCall('generate-reply')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md"
          >
            {isLoading && <RotateCw className="w-4 h-4 mr-2 animate-spin" />}
            Generate Reply
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <dialog id="settingsDialog" className="p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 backdrop:bg-black backdrop:bg-opacity-50">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('settingsDialog')?.close()}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium">Font Size</label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, fontSize: value }))}
                  min={12}
                  max={24}
                  step={1}
                  className="w-48"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="font-medium">High Contrast Mode</label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="font-medium">Preserve Style</label>
                <Switch
                  checked={settings.preserveStyle}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, preserveStyle: checked }))}
                />
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default TextEnhancementUI;