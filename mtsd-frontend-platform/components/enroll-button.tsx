'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function EnrollButton() {
  const [enrolled, setEnrolled] = useState(false)

  const handleEnroll = () => {
    setEnrolled(true)
  }

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={enrolled} 
      className="w-full"
    >
      {enrolled ? 'Enrolled' : 'Enroll in Course'}
    </Button>
  )
}

