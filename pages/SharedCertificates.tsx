
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { Certificate } from '../types';
import { Award, Calendar, AlertCircle, X, ZoomIn, FileText } from 'lucide-react';

const SharedCertificates: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSharedLink, data } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setError('Link non valido');
        setLoading(false);
        return;
    }

    const linkData = getSharedLink(id);
    
    if (!linkData) {
        setError('Link inesistente o scaduto.');
        setLoading(false);
        return;
    }

    // Check expiration
    if (linkData.expirationDate) {
        const now = new Date();
        const exp = new Date(linkData.expirationDate);
        if (now > exp) {
            setError('Questo link è scaduto.');
            setLoading(false);
            return;
        }
    }

    // Filter certificates
    const foundCerts = (data.certificates || []).filter(c => linkData.certificateIds.includes(c.id));
    setCertificates(foundCerts);
    setLoading(false);

  }, [id, data.certificates, getSharedLink]);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div></div>;

  if (error) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Accesso Negato</h2>
                <p className="text-gray-500">{error}</p>
              </div>
          </div>
      );
  }

  // Group by section for display
  const groupedCerts = certificates.reduce((acc, cert) => {
      (acc[cert.section] = acc[cert.section] || []).push(cert);
      return acc;
  }, {} as Record<string, Certificate[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-12">
        
        {/* Simple Header */}
        <div className="max-w-6xl mx-auto mb-16 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-red-600 shadow-lg mb-6">
                <Award className="text-white w-8 h-8" strokeWidth={2} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                Certificazioni Ufficiali
            </h1>
            <p className="text-gray-500 text-lg">Portfolio Professionale Verificato</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
            {Object.entries(groupedCerts).map(([section, certs]) => (
                <div key={section} className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2 inline-block pr-8">
                        {section}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certs.map(cert => (
                            <div key={cert.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800 group">
                                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-black overflow-hidden cursor-pointer" onClick={() => cert.image && setSelectedImage(cert.image)}>
                                    {cert.image ? (
                                        <>
                                            <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <ZoomIn className="text-white drop-shadow-md" size={32} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-700">
                                            <Award size={64} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
                                        <Calendar size={12} /> {cert.date}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                        {cert.title}
                                    </h3>
                                    {cert.description && (
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {cert.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedImage(null)}>
                <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                    <X size={40} />
                </button>
                <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
        )}

         <div className="mt-20 text-center text-xs text-gray-400">
            Powered by BartenderSchool App
        </div>
    </div>
  );
};

export default SharedCertificates;
