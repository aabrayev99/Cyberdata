'use client'

import React from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface FileUploadProps {
  onFileUploaded: (url: string) => void
  type: 'profile' | 'course' | 'video'
  currentFile?: string
  accept?: string
  maxSize?: string
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  type,
  currentFile,
  accept,
  maxSize = type === 'video' ? '100MB' : '10MB',
  className = ''
}) => {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [dragActive, setDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getAcceptTypes = () => {
    if (accept) return accept
    
    switch (type) {
      case 'profile':
        return 'image/jpeg,image/png,image/webp,image/gif'
      case 'course':
        return 'image/jpeg,image/png,image/webp'
      case 'video':
        return 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
      default:
        return 'image/*'
    }
  }

  const handleFile = async (file: File) => {
    if (!file) return

    try {
      setIsUploading(true)
      setError('')
      setSuccess('')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Файл успешно загружен!')
        onFileUploaded(result.url)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Ошибка загрузки файла')
      }
    } catch (error) {
      setError('Ошибка загрузки файла')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeFile = () => {
    onFileUploaded('')
    setSuccess('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileTypeLabel = () => {
    switch (type) {
      case 'profile': return 'фото профиля'
      case 'course': return 'изображение курса'
      case 'video': return 'видео'
      default: return 'файл'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current file display */}
      {currentFile && (
        <div className="relative">
          {type === 'video' ? (
            <div className="relative">
              <video 
                src={currentFile} 
                controls 
                className="w-full h-40 object-cover rounded-lg border border-cyber-light-gray"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={currentFile} 
                alt="Preview" 
                className={`rounded-lg border border-cyber-light-gray object-cover ${
                  type === 'profile' ? 'w-32 h-32 mx-auto' : 'w-full h-40'
                }`}
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-neon-cyan bg-neon-cyan/10' 
            : 'border-cyber-light-gray hover:border-neon-cyan'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={getAcceptTypes()}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-cyber-gray/30">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-neon-cyan" />
            )}
          </div>

          <div>
            <p className="font-cyber text-white mb-2">
              {isUploading ? 'Загрузка...' : `Загрузить ${getFileTypeLabel()}`}
            </p>
            <p className="text-sm text-gray-400 font-mono">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-500 font-mono mt-2">
              Максимальный размер: {maxSize}
            </p>
          </div>

          {!currentFile && (
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Выбрать файл
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm font-mono animate-pulse-neon flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 p-3 rounded-md text-sm font-mono animate-pulse-neon flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
    </div>
  )
}

export default FileUpload