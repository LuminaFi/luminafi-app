'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useAccount } from 'wagmi';

const InvestorSettings = () => {
  const { address } = useAccount();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    loanUpdates: true,
    repaymentNotifications: true,
    marketingEmails: false,
  });

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const promptDisconnect = () => {
    setShowWarningAlert(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {showSuccessAlert && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {showWarningAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Disconnecting your wallet will log you out. You can reconnect at any
            time.
            <div className="mt-2 flex gap-2">
              <Button variant="destructive" size="sm">
                Disconnect
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWarningAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="wallet">Wallet & Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileUpdate}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your investor profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userName">Username</Label>
                    <Input id="userName" defaultValue="johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution/Company</Label>
                  <Input id="institution" defaultValue="Acme Investments" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeSource">Income Source</Label>
                  <Select defaultValue="business">
                    <SelectTrigger id="incomeSource">
                      <SelectValue placeholder="Select income source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your investing goals..."
                    defaultValue="Passionate investor focused on supporting educational opportunities in technology and science fields."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Wallet & Security Settings */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet & Security</CardTitle>
              <CardDescription>
                Manage your wallet connection and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Connected Wallet</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ethereum Wallet</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {address || '0x0000...0000'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={promptDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Security Settings</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enable 2FA for additional security
                    </p>
                  </div>
                  <Button variant="outline">Set Up</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Transaction Confirmations
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Require confirmation for all transactions
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Investment Limit</p>
                    <p className="text-xs text-muted-foreground">
                      Maximum investment amount per transaction
                    </p>
                  </div>
                  <div className="w-32">
                    <Input
                      defaultValue="5"
                      type="number"
                      min="0"
                      className="text-right"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setShowSuccessAlert(true)}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Loan Request Updates</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when new loan requests are available
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.loanUpdates}
                    onCheckedChange={() => handleToggle('loanUpdates')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Repayment Notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when you receive repayments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.repaymentNotifications}
                    onCheckedChange={() =>
                      handleToggle('repaymentNotifications')
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Marketing Communications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() => handleToggle('marketingEmails')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Notification Frequency
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Email Digest Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setShowSuccessAlert(true)}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestorSettings;
