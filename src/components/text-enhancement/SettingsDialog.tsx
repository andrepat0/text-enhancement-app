import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "@/types/text-enhancement";
import { ToneSelector } from "./ToneOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ settings, onSettingsChange, open, onOpenChange }: SettingsDialogProps) => {
  const handleChange = (key: keyof Settings, value: string | boolean | number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="writing">Writing</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select  value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size ({settings.fontSize}px)</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={([value]) => handleChange("fontSize", value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="writing" className="space-y-6">
            <ToneSelector
              tone={settings.tone}
              onToneChange={(tone) => handleChange("tone", tone)}
            />
            <Separator />
            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="preserve-style">Preserve Writing Style</Label>
                <p className="text-sm text-muted-foreground">Maintain your unique writing voice while enhancing text</p>
              </div>
              <Switch
                id="preserve-style"
                checked={settings.preserveStyle}
                onCheckedChange={(checked) => handleChange("preserveStyle", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="auto-save">Auto-Save</Label>
                <p className="text-sm text-muted-foreground">Automatically save your work every {settings.autoSaveInterval} seconds</p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.autoSaveEnabled}
                onCheckedChange={(checked) => handleChange("autoSaveEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="keyboard-shortcuts">Keyboard Shortcuts</Label>
                <p className="text-sm text-muted-foreground">Enable quick actions with keyboard commands</p>
              </div>
              <Switch
                id="keyboard-shortcuts"
                checked={settings.keyboardShortcuts}
                onCheckedChange={(checked) => handleChange("keyboardShortcuts", checked)}
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-sm text-muted-foreground">Increase visual contrast for better readability</p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleChange("highContrast", checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};