"use client";

import { useState } from "react";
import { useMuseums } from "@/hooks/useMuseums";
import ContactForm from "@/components/shared/ContactForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [selectedMuseumId, setSelectedMuseumId] = useState<string>("");
  const { museums, isLoading } = useMuseums({ approved: true });

  // Find the selected museum from the museums array
  const selectedMuseum = museums?.find(
    (museum) => museum.id.toString() === selectedMuseumId
  );

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative h-[90vh] overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="images/juneteenth-celebration-with-symbolic-representation-end-slavery-united-states-min.jpg"
            alt="Juneteenth celebration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
              <Mail className="h-4 w-4 mr-2" />
              Contact & Connect
            </div>

            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Get in Touch With <span className="text-yellow-300">Museums</span>
            </h1>

            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Have questions or feedback? Reach out directly to our partner
              museums or contact our platform team.
            </p>
          </div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 mt-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  {/* <Museum className="h-4 w-4 text-primary" /> */}
                  Select a Museum to Contact
                </label>

                <Select
                  value={selectedMuseumId}
                  onValueChange={setSelectedMuseumId}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Choose a museum..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading museums...
                      </SelectItem>
                    ) : museums && museums.length > 0 ? (
                      museums.map((museum) => (
                        <SelectItem
                          key={museum.id}
                          value={museum.id.toString()}
                        >
                          {museum.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No museums available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedMuseum && (
                <div className="p-4 bg-muted/50 rounded-md mb-6 border border-muted">
                  <div className="flex items-start gap-4">
                    {selectedMuseum.logoUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={selectedMuseum.logoUrl}
                          alt={selectedMuseum.name}
                          className="w-16 h-16 rounded-md object-cover border-2 border-white shadow-sm"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-primary">
                        {selectedMuseum.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedMuseum.location}, {selectedMuseum.city},{" "}
                        {selectedMuseum.country}
                      </p>
                      {selectedMuseum.website && (
                        <a
                          href={selectedMuseum.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-destructive hover:underline flex items-center gap-1"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedMuseumId ? (
                <ContactForm
                  museumId={selectedMuseumId}
                  museumName={selectedMuseum?.name || ""}
                />
              ) : (
                <div className="text-center p-8 bg-background rounded-md border border-dashed">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Please select a museum from the dropdown above to contact
                    them directly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Contact Methods */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Other Ways to Connect
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-muted/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">General Inquiries</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    For questions about MuseumConnect or museum partnership
                    opportunities:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      info@museumconnect.example.com
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Technical Support</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Experiencing issues with the platform or need assistance?
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      support@museumconnect.example.com
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Monday-Friday, 9am-5pm EST
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
