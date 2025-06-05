import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CompanyRegistrationForm from './components/CompanyRegistrationForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <CompanyRegistrationForm />
    </>
  )
}

export default App
