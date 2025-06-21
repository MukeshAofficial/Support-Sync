"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Settings, CheckCircle, AlertCircle, ExternalLink, Zap } from "lucide-react"
import Link from "next/link"

interface Integration {
  id: string
  name: string
  description: string
  logo: string
  category: string
  status: "connected" | "disconnected" | "error"
  apiKey?: string
  webhookUrl?: string
  isEnabled: boolean
}

const integrations: Integration[] = [
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Sync tickets and customer data with Zendesk Support",
    logo: "🎫",
    category: "helpdesk",
    status: "disconnected",
    isEnabled: false,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect with Salesforce CRM for customer insights",
    logo: "☁️",
    category: "crm",
    status: "connected",
    apiKey: "sk_live_••••••••••••••••",
    isEnabled: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and alerts to Slack channels",
    logo: "💬",
    category: "communication",
    status: "connected",
    webhookUrl: "https://hooks.slack.com/services/••••••••••",
    isEnabled: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Integrate with HubSpot CRM and Marketing Hub",
    logo: "🧡",
    category: "crm",
    status: "error",
    apiKey: "hub_••••••••••••••••",
    isEnabled: false,
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Enable SMS and voice communication channels",
    logo: "📱",
    category: "communication",
    status: "connected",
    apiKey: "AC••••••••••••••••••",
    isEnabled: true,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Send notifications to Microsoft Teams channels",
    logo: "🟦",
    category: "communication",
    status: "disconnected",
    isEnabled: false,
  },
  {
    id: "jira",
    name: "Jira",
    description: "Create and manage issues in Atlassian Jira",
    logo: "🔷",
    category: "project-management",
    status: "disconnected",
    isEnabled: false,
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    description: "Sync support tickets with Freshdesk",
    logo: "🍃",
    category: "helpdesk",
    status: "disconnected",
    isEnabled: false,
  },
]

export default function IntegrationsPage() {
  const [integrationList, setIntegrationList] = useState<Integration[]>(integrations)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (integrationId: string) => {
    setIsConnecting(true)

    // Simulate API connection
    setTimeout(() => {
      setIntegrationList((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                status: "connected",
                apiKey: apiKey || "sk_live_••••••••••••••••",
                webhookUrl: webhookUrl || undefined,
                isEnabled: true,
              }
            : integration,
        ),
      )
      setSelectedIntegration(null)
      setApiKey("")
      setWebhookUrl("")
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrationList((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: "disconnected",
              apiKey: undefined,
              webhookUrl: undefined,
              isEnabled: false,
            }
          : integration,
      ),
    )
  }

  const handleToggle = (integrationId: string, enabled: boolean) => {
    setIntegrationList((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, isEnabled: enabled } : integration,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Not Connected</Badge>
    }
  }

  const categories = [
    { id: "all", name: "All Integrations", count: integrationList.length },
    { id: "helpdesk", name: "Help Desk", count: integrationList.filter((i) => i.category === "helpdesk").length },
    { id: "crm", name: "CRM", count: integrationList.filter((i) => i.category === "crm").length },
    {
      id: "communication",
      name: "Communication",
      count: integrationList.filter((i) => i.category === "communication").length,
    },
    {
      id: "project-management",
      name: "Project Management",
      count: integrationList.filter((i) => i.category === "project-management").length,
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const filteredIntegrations =
    selectedCategory === "all" ? integrationList : integrationList.filter((i) => i.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">App Integrations</h1>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Zap className="w-4 h-4 mr-1" />
            Powered by Bhindi AI
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {integrationList.filter((i) => i.status === "connected").length}
              </div>
              <div className="text-sm text-gray-600">Connected Apps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {integrationList.filter((i) => i.isEnabled).length}
              </div>
              <div className="text-sm text-gray-600">Active Integrations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{integrationList.length}</div>
              <div className="text-sm text-gray-600">Available Apps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {integrationList.filter((i) => i.status === "error").length}
              </div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-sm">
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                      {getStatusIcon(integration.status)}
                    </div>
                    <CardDescription className="mt-2">{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {integration.status === "connected" && (
                        <div className="space-y-2">
                          {integration.apiKey && (
                            <div className="text-xs text-gray-500">API Key: {integration.apiKey}</div>
                          )}
                          {integration.webhookUrl && (
                            <div className="text-xs text-gray-500">Webhook: {integration.webhookUrl}</div>
                          )}
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                              Enable Integration
                            </Label>
                            <Switch
                              id={`toggle-${integration.id}`}
                              checked={integration.isEnabled}
                              onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedIntegration(integration)}
                              className="flex-1"
                            >
                              Configure
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDisconnect(integration.id)}
                              className="flex-1"
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => setSelectedIntegration(integration)}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            size="sm"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Connection Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedIntegration.logo}</span>
                  <span>Connect {selectedIntegration.name}</span>
                </CardTitle>
                <CardDescription>
                  Enter your {selectedIntegration.name} credentials to establish the connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                {selectedIntegration.category === "communication" && (
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      placeholder="https://hooks.example.com/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    Need help finding your API key?
                    <a href="#" className="underline ml-1">
                      View documentation
                    </a>
                  </p>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIntegration(null)
                    setApiKey("")
                    setWebhookUrl("")
                  }}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleConnect(selectedIntegration.id)}
                  disabled={!apiKey || isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Setup Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Choose Integration</h3>
                <p className="text-sm text-gray-600">
                  Select the app you want to connect from our supported integrations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Enter Credentials</h3>
                <p className="text-sm text-gray-600">Provide your API key and any additional configuration details</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Automating</h3>
                <p className="text-sm text-gray-600">
                  Enable the integration and let Bhindi AI orchestrate your workflows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
