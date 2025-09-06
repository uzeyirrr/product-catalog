'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ContactFormSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  images: string[];
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export default function ContactFormsPage() {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Form gönderimlerini yükle
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    try {
      const stored = localStorage.getItem('contactFormSubmissions');
      console.log('Raw localStorage data:', stored); // Debug için
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Parsed submissions:', parsed); // Debug için
        setSubmissions(parsed);
      }
    } catch (error) {
      console.error('Form gönderimleri yüklenirken hata:', error);
    }
  };

  const updateSubmissionStatus = (id: number, status: ContactFormSubmission['status']) => {
    const updatedSubmissions = submissions.map(submission => 
      submission.id === id 
        ? { ...submission, status, updatedAt: new Date().toISOString() }
        : submission
    );
    
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
  };

  const deleteSubmission = (id: number) => {
    const updatedSubmissions = submissions.filter(submission => submission.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
  };

  const viewSubmission = (submission: ContactFormSubmission) => {
    console.log('Selected submission:', submission); // Debug için
    console.log('Images array:', submission.images); // Debug için
    setSelectedSubmission(submission);
    setIsDetailDialogOpen(true);
    
    // Görüldü olarak işaretle
    if (submission.status === 'new') {
      updateSubmissionStatus(submission.id, 'read');
    }
  };

  const getStatusBadge = (status: ContactFormSubmission['status']) => {
    const statusConfig = {
      new: { label: 'Neu', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      read: { label: 'Gelesen', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      replied: { label: 'Beantwortet', variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
      closed: { label: 'Geschlossen', variant: 'destructive' as const, color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    read: submissions.filter(s => s.status === 'read').length,
    replied: submissions.filter(s => s.status === 'replied').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kontaktformular</h1>
        <p className="text-gray-600">Verwalten Sie eingehende Kontaktanfragen</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Neu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gelesen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.read}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beantwortet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Anfragen ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Noch keine Kontaktanfragen vorhanden.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{formatDate(submission.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewSubmission(submission)}>
                              Anzeigen
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateSubmissionStatus(submission.id, 'replied')}
                              disabled={submission.status === 'replied'}
                            >
                              Als beantwortet markieren
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateSubmissionStatus(submission.id, 'closed')}
                              disabled={submission.status === 'closed'}
                            >
                              Schließen
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteSubmission(submission.id)}
                              className="text-red-600"
                            >
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kontaktanfrage Details</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Kişisel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-gray-900">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div>{getStatusBadge(selectedSubmission.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eingegangen</label>
                  <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zuletzt aktualisiert</label>
                  <p className="text-gray-900">{formatDate(selectedSubmission.updatedAt)}</p>
                </div>
              </div>

              {/* Nachricht */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Bilder */}
              {(() => {
                console.log('Rendering images section for submission:', selectedSubmission.id);
                console.log('Images array:', selectedSubmission.images);
                console.log('Images length:', selectedSubmission.images?.length);
                console.log('Images condition:', selectedSubmission.images && selectedSubmission.images.length > 0);
                return null;
              })()}
              {selectedSubmission.images && selectedSubmission.images.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hochgeladene Bilder ({selectedSubmission.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedSubmission.images.map((image, index) => {
                      console.log('Image URL:', image); // Debug için
                      return (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Projekt Bild ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              console.error('Image load error:', image);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', image);
                            }}
                          />
                          <a 
                            href={image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg"
                          >
                            <span className="text-white opacity-0 hover:opacity-100 text-sm">Vergrößern</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hochgeladene Bilder
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    <p>Keine Bilder hochgeladen</p>
                    <p className="text-xs mt-1">Debug: images = {JSON.stringify(selectedSubmission.images)}</p>
                  </div>
                </div>
              )}

              {/* Aktionen */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Schließen
                </Button>
                <Button
                  onClick={() => {
                    updateSubmissionStatus(selectedSubmission.id, 'replied');
                    setIsDetailDialogOpen(false);
                  }}
                  disabled={selectedSubmission.status === 'replied'}
                >
                  Als beantwortet markieren
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
