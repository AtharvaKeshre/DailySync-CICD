"use client"

import { useState } from "react"
import { Save, Shield, PaintBucket, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    enableRegistration: true,
    requireEmailVerification: true,
    allowGuestAccess: false,
    maintenanceMode: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    adminAlerts: true,
    userReports: true,
    systemAlerts: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    accentColor: "purple",
    compactMode: false,
    animationsEnabled: true,
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "weekly",
    retentionPeriod: "30days",
  })

  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "System backup has been initiated. You will be notified when complete.",
    })
  }

  const handleRestoreBackup = () => {
    toast({
      title: "Restore Initiated",
      description: "Please select a backup file to restore from.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure core system settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-registration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to create accounts
                    </p>
                  </div>
                  <Switch
                    id="enable-registration"
                    checked={generalSettings.enableRegistration}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, enableRegistration: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-verification">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify email before accessing features
                    </p>
                  </div>
                  <Switch
                    id="require-verification"
                    checked={generalSettings.requireEmailVerification}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, requireEmailVerification: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-guest">Allow Guest Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable limited access without registration
                    </p>
                  </div>
                  <Switch
                    id="allow-guest"
                    checked={generalSettings.allowGuestAccess}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, allowGuestAccess: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode" className="text-amber-500">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable access for non-admin users
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, maintenanceMode: checked})
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Security Settings</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue={60} min={5} max={1440} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PaintBucket className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">Default Theme</Label>
                  <Select 
                    value={appearanceSettings.theme}
                    onValueChange={(value) => 
                      setAppearanceSettings({...appearanceSettings, theme: value})
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <Select 
                    value={appearanceSettings.accentColor}
                    onValueChange={(value) => 
                      setAppearanceSettings({...appearanceSettings, accentColor: value})
                    }
                  >
                    <SelectTrigger id="accent-color">
                      <SelectValue placeholder="Select accent color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="amber">Amber</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use more condensed UI elements
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={appearanceSettings.compactMode}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({...appearanceSettings, compactMode: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Enable Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Use animations for UI transitions
                    </p>
                  </div>
                  <Switch
                    id="animations"
                    checked={appearanceSettings.animationsEnabled}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({...appearanceSettings, animationsEnabled: checked})
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Preview</h3>
                <div className="h-40 rounded-md border flex items-center justify-center">
                  <p className="text-muted-foreground">Theme preview will appear here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-auto">
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system and email notifications
              </CardDescription>
            </CardHeader>


Let's continue with the Admin Settings component:

\
\
\
\
