"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ContactMessage } from "@/types";
import { formatDate } from "@/lib/utils";
import { Mail, MailOpen, Search, Trash2, Eye, Reply, Send, MessageSquare, Calendar } from "lucide-react";

function MessagesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Fetch contact messages for the museum
  const { data: messages, isLoading } = useQuery({
    queryKey: ['/contact-messages', user?.museumId],
    enabled: !!user?.museumId
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) =>
      apiRequest("PATCH", `/contact-messages/${messageId}`, { isRead: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/contact-messages'] });
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark message as read. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) =>
      apiRequest("DELETE", `/contact-messages/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/contact-messages'] });
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: (replyData: {
      messageId: string;
      subject: string;
      message: string;
    }) => apiRequest("POST", `/contact-messages/${replyData.messageId}/reply`, {
      subject: replyData.subject,
      message: replyData.message
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/contact-messages'] });
      setIsReplyDialogOpen(false);
      setReplySubject("");
      setReplyMessage("");
      setSelectedTemplate("");
      toast({
        title: "Reply sent",
        description: "Your response has been sent to the visitor via email.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);

    // Mark as read if not already read
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleReplyToMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplySubject(`Re: ${message.subject}`);
    setReplyMessage("");
    setSelectedTemplate("");
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replySubject.trim() || !replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    sendReplyMutation.mutate({
      messageId: selectedMessage.id,
      subject: replySubject,
      message: replyMessage
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  // Email templates for quick responses
  const emailTemplates = [
    {
      id: "general_thanks",
      name: "General Thank You",
      subject: "Thank you for your inquiry",
      content: `Thank you for contacting us. We appreciate your interest in our museum and will get back to you within 2-3 business days.

If you have any urgent questions, please don't hesitate to call us directly.

Best regards,
The Museum Team`
    },
    {
      id: "group_visit",
      name: "Group Visit Information",
      subject: "Group Visit Information",
      content: `Thank you for your interest in organizing a group visit to our museum.

We offer special group rates and guided tours for groups of 10 or more people. Our educational programs can be tailored to different age groups and interests.

Please let us know:
- Preferred date and time
- Number of visitors
- Age group (if applicable)
- Any special requirements

We'll be happy to arrange a memorable experience for your group.

Best regards,
The Education Team`
    },
    {
      id: "accessibility",
      name: "Accessibility Information",
      subject: "Accessibility Services",
      content: `Thank you for your accessibility inquiry.

Our museum is fully accessible and we provide:
- Wheelchair accessibility throughout all floors
- Accessible restrooms and parking spaces
- Audio guides and visual aids
- Sign language interpretation (with advance notice)
- Large print materials

Please let us know if you need any specific accommodations for your visit.

Best regards,
The Visitor Services Team`
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setReplySubject(template.subject);
      setReplyMessage(template.content);
    }
  };

  // Filter messages based on search query
  const messagesList = (messages as ContactMessage[]) || [];
  const filteredMessages = messagesList.filter((message: ContactMessage) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalMessages = messagesList.length;
  const unreadMessages = messagesList.filter((m: ContactMessage) => !m.isRead).length;
  const todayMessages = messagesList.filter((m: ContactMessage) => {
    const today = new Date();
    const messageDate = m.createdAt ? new Date(m.createdAt) : new Date();
    return messageDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-primary">Contact Messages</h1>
          <p className="text-muted-foreground">Manage visitor messages and inquiries with reply functionality</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Reply className="h-3 w-3 mr-1" />
            Reply Feature Active
          </Badge>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-blue-600">{totalMessages}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadMessages}</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <MailOpen className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-green-600">{todayMessages}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold text-purple-600">
                  {messagesList.filter(m => m.responseStatus === 'replied').length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Send className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Messages Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredMessages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message: ContactMessage) => (
                  <TableRow key={message.id} className={!message.isRead ? "bg-blue-50" : ""}>
                    <TableCell>
                      <Badge variant={message.isRead ? "secondary" : "default"}>
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{message.name}</p>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{message.subject}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {message.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      {formatDate(message.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReplyToMessage(message)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No messages found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms." : "No contact messages have been received yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Original Message Info */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                <p className="font-medium mb-2">Subject: {selectedMessage.subject}</p>
                <p className="text-sm">{selectedMessage.message}</p>
              </div>

              {/* Email Templates */}
              <div className="space-y-2">
                <Label htmlFor="template-select">Quick Templates (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  handleTemplateSelect(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or write custom response" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reply Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply-subject">Subject</Label>
                  <Input
                    id="reply-subject"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-message">Message</Label>
                  <Textarea
                    id="reply-message"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Enter your response message"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={sendReplyMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendReplyMutation.isPending ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From</label>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <p>{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="bg-muted p-4 rounded-lg mt-2">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Received</label>
                <p>{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MessagesManagement;