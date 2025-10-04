import { prepareInstructions } from 'constants/index'
import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import FileUploader from '~/components/FileUploader'
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img'
import { usePuterStore } from '~/lib/puter'
import { generateUUID } from '~/lib/utils'

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string
    jobTitle: string
    jobDescription: string
    file: File
  }) => {
    setIsProcessing(true)
    setStatusText('Uploading file. Please wait...')
    const uploadedFile = await fs.upload([file])
    if (!uploadedFile) {
      setStatusText('Error:Failed to upload file')
      return
    }
    setStatusText('Converting PDF to image...')
    const imageFile = await convertPdfToImage(file)
    if (!imageFile.file) {
      setStatusText('Error:Failed to create a PDF screenshot')
      return
    }
    setStatusText('Uploading PDF screenshot image...')
    const uploadedImage = await fs.upload([imageFile.file])
    if (!uploadedImage) {
      setStatusText('Error: Failed to upload PDF screenshot image')
      return
    }
    setStatusText('Preparing data...')

    const uuid = generateUUID()
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobDescription,
      jobTitle,
      feedback: '',
    }

    await kv.set(`resume: ${uuid}`, JSON.stringify(data))
    setStatusText('Analyzing ...')

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    )

    if (!feedback) return setStatusText('Error: Failed to analyze resume')

    const feedbackText =
      typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text

    data.feedback = JSON.parse(feedbackText)

    await kv.set(`resume:${uuid}`, JSON.stringify(data))
    setStatusText('Analysis complete. Redirecting...')
    navigate(`/resume/${uuid}`)
  }

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget.closest('form')
    if (!form) return
    const formData = new FormData(form)
    const companyName = formData.get('company-name') as string
    const jobTitle = formData.get('job-title') as string
    const jobDescription = formData.get('job-description') as string

    if (!file) return

    handleAnalyze({ companyName, jobTitle, jobDescription, file })
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <p>Smart feedback for your job application</p>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="" className="w-full" />
            </>
          ) : (
            <h2 className="">
              Drop your resume for ATS tips and improvement tips.
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              action=""
              className="flex flex-col gap-4 mt-8"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name" className="">
                  Company name
                </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title" className="">
                  Job title
                </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description" className="">
                  Job description
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader" className="">
                  Upload resume
                </label>
                <FileUploader onFileSelect={handleFileSelect} file={file} />
              </div>
              <button className="primary-button" type="submit">
                Analyze resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default Upload
