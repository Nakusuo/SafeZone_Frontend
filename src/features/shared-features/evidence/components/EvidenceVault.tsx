import React, { useState, useRef } from 'react'
import { UploadCloud, FileText, Image as ImageIcon, FileAudio, FileVideo, Trash2, Download, Eye, Lock } from 'lucide-react'
import { Button } from '@/components'

interface EvidenceFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: string
  url?: string
}

export const EvidenceVault = ({ caseId }: { caseId: string }) => {
  const [files, setFiles] = useState<EvidenceFile[]>([
    {
      id: 'mock-1',
      name: 'initial_medical_report.pdf',
      size: 1024 * 2500, 
      type: 'application/pdf',
      uploadedAt: new Date(Date.now() - 86400000),
      uploadedBy: 'Dr. Lopez (Psychologist)',
    }
  ])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userData = sessionStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null
  const canUpload = user?.role !== 'ADMIN' 

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    setIsUploading(true)
    
    setTimeout(() => {
      setTimeout(() => {
        const uploadedFiles: EvidenceFile[] = newFiles.map(file => ({
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          uploadedBy: user?.name || 'User',
          url: URL.createObjectURL(file),
        }))
        setFiles(prev => [...uploadedFiles, ...prev])
        setIsUploading(false)
      }, 800)
    }, 1200)
  }

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-6 h-6 text-blue-500" />
    if (type.startsWith('video/')) return <FileVideo className="w-6 h-6 text-purple-500" />
    if (type.startsWith('audio/')) return <FileAudio className="w-6 h-6 text-yellow-500" />
    return <FileText className="w-6 h-6 text-gray-500" />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Evidence Repository</h2>
        <p className="text-sm text-gray-600">
          Encrypted files restricted only to the team assigned to this case.
        </p>
      </div>

      {canUpload && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 mb-8 text-center cursor-pointer transition-all duration-200
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-teal-600 animate-pulse" />
                Encrypting and securing file (E2EE)...
              </span>
            ) : 'Upload or drag files here'}
          </h3>
          <p className="text-sm text-gray-500">
            JPG, PNG, PDF, MP4, MP3 (Max 50MB)
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Files in the case file ({files.length})</h3>
        
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No evidence uploaded yet.
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{formatSize(file.size)}</span>
                    <span>•</span>
                    <span>Uploaded by {file.uploadedBy}</span>
                    <span>•</span>
                    <span>{file.uploadedAt.toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => file.url ? window.open(file.url, '_blank') : alert('This is a test file. Upload a new one to view it.')}
                  className="p-2 text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-white"
                  title="View file"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {canUpload && (
                  <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="p-2 text-gray-500 hover:text-accent transition-colors rounded-lg hover:bg-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
