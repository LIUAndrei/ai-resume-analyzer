import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils'

interface FileUploaderProps {
  file?: File | null
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null
      onFileSelect?.(file)
    },
    [onFileSelect],
  )

  const maxFileSize = 20 * 1024 * 1024

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
      maxSize: maxFileSize,
    })

  // const file = acceptedFiles[0] || null

  return (
    <div className="w-full gradient-border">
      <div className="" {...getRootProps()}>
        <input type="text" {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <img src="/public/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center space-x-3">
                <div className="">
                  <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer p-2"
                onClick={(e) => {
                  onFileSelect?.(null)

                  console.log(file)
                }}
              >
                <img
                  src="/public/icons/cross.svg"
                  alt="remove"
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            <div className="">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload </span>or drag
                and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF up to {formatSize(maxFileSize)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader
