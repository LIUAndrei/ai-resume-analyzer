import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader'
import Navbar from '~/components/Navbar'

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget.closest('form')
    if (!form) return
    const formData = new FormData(form)
    const companyName = formData.get('company-name')
    const jobTitle = formData.get('job-title')
    const jobDescription = formData.get('job-description')

    console.log(file)
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
                <FileUploader onFileSelect={handleFileSelect} />
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
