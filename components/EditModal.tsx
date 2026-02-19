
import React, { useRef, useState } from 'react';
import { X, Upload, Save, Loader } from 'lucide-react';
import { useAppStore } from '../store';

export interface EditField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
    value: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Record<string, string>) => void;
    title: string;
    fields: EditField[];
    onChange: (key: string, value: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, title, fields, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage } = useAppStore();
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const publicUrl = await uploadImage(file);
            setIsUploading(false);
            
            if (publicUrl) {
                onChange(fieldKey, publicUrl);
            }
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct the data object to pass back
        const data = fields.reduce((acc, field) => {
            acc[field.key] = field.value;
            return acc;
        }, {} as Record<string, string>);
        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 animate-scale-in flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 rounded-t-3xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="edit-modal-form" onSubmit={handleSave} className="space-y-6">
                        {fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                                    {field.label}
                                </label>
                                
                                {field.type === 'text' && (
                                    <input 
                                        type="text" 
                                        value={field.value}
                                        onChange={(e) => onChange(field.key, e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-orange dark:focus:border-brand-orange dark:text-white transition-colors"
                                    />
                                )}

                                {field.type === 'textarea' && (
                                    <textarea 
                                        value={field.value}
                                        onChange={(e) => onChange(field.key, e.target.value)}
                                        className="w-full p-3 h-32 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-orange dark:focus:border-brand-orange dark:text-white transition-colors resize-none"
                                    />
                                )}

                                {field.type === 'image' && (
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <input 
                                                type="text" 
                                                value={field.value}
                                                onChange={(e) => onChange(field.key, e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-orange dark:text-white"
                                            />
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={(e) => handleFileUpload(e, field.key)} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    disabled={isUploading}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors text-gray-700 dark:text-white ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isUploading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        {field.value && (
                                            <div className="h-40 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800">
                                                <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 rounded-b-3xl">
                    <button 
                        type="submit" 
                        form="edit-modal-form"
                        disabled={isUploading}
                        className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-red hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />} Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
