"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, FileText, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useApplications } from "@/hooks/useApplications";
import { useUserProfile } from "@/hooks/useUserProfile";
import { signOutUser } from "@/lib/firebase/auth";
import { ResumeUpload } from "@/features/applications/components/ResumeUpload";
import { formatDate } from "@/lib/helpers/format";

type Tab = "saved" | "applied" | "profile" | "settings";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedJobs, loading: savedLoading, unsaveJob } = useSavedJobs();
  const { applications, loading: appsLoading } = useApplications();
  const { profile, updateProfile } = useUserProfile();

  const [activeTab, setActiveTab] = useState<Tab>("saved");
  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-md py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Sign In Required</h1>
        <p className="text-muted-foreground">
          Please sign in to access your dashboard.
        </p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateProfile({ headline, phone, location });
      setProfileMessage("Profile updated successfully.");
    } catch {
      setProfileMessage("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-8 border-b">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.displayName || user.displayName || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOutUser()}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
        {/* Sidebar Nav */}
        <nav className="flex flex-col space-y-1">
          <Button
            variant={activeTab === "saved" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark className="h-4 w-4" />
            Saved Jobs ({savedJobs.length})
          </Button>
          <Button
            variant={activeTab === "applied" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveTab("applied")}
          >
            <FileText className="h-4 w-4" />
            Applied Jobs ({applications.length})
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-4 w-4" />
            Profile & Resume
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Button>
        </nav>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === "saved" && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
                <CardDescription>
                  Jobs you have bookmarked for later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedLoading ? (
                  <p className="text-muted-foreground">Loading saved jobs...</p>
                ) : savedJobs.length === 0 ? (
                  <p className="text-muted-foreground">No saved jobs yet.</p>
                ) : (
                  savedJobs.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <Link
                          href={`/jobs/${item.jobSlug}`}
                          className="font-semibold hover:text-primary"
                        >
                          {item.jobTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.companyName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unsaveJob(item.jobId)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "applied" && (
            <Card>
              <CardHeader>
                <CardTitle>Applied Jobs</CardTitle>
                <CardDescription>
                  Track the status of your submitted applications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appsLoading ? (
                  <p className="text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <p className="text-muted-foreground">No applications submitted yet.</p>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <Link
                          href={`/jobs/${app.jobSlug}`}
                          className="font-semibold hover:text-primary"
                        >
                          {app.jobTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {app.companyName} • Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>
                    Upload your standard resume for quick applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUpload
                    value={profile?.resumeUrl}
                    onUpload={(url) => updateProfile({ resumeUrl: url })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="headline">Headline / Role</Label>
                      <Input
                        id="headline"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={headline || profile?.headline || ""}
                        onChange={(e) => setHeadline(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g. San Francisco, CA"
                        value={location || profile?.location || ""}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="e.g. +1 (555) 000-0000"
                        value={phone || profile?.phone || ""}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {profileMessage && (
                      <p className="text-sm text-primary">{profileMessage}</p>
                    )}
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium mt-1">{user.email}</p>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="destructive" size="sm" onClick={() => signOutUser()}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}