import Challenge from "./components/layouts/Challenge"
import Dashboard from "./components/layouts/Dashboard"
import Layout from "./components/layouts/Layout"
import Welcome from "./components/layouts/Welcome"
import { useState, useEffect } from "react"

import WORDS from "./utils/VOCAB.json"

import { getWordByIndex, PLAN } from "./utils"

function App() {
  const [selectedPage, setSelectedPage] = useState(0)
  //const selectedPage = 0
  // 0: Welcome, 1: Dashboard, 2: Challenge
  const [name, setName] = useState("")
  const [day, setDay] = useState(1)
  const [datetime, setDatetime] = useState(null)
  const [history, setHistory] = useState([])
  const [attempts, setAttempts] = useState(0)

  // PLAN là object, key là số ngày, value là mảng các chỉ số từ đã học trong ngày đó
  // PLAN[day] sẽ trả về mảng các chỉ số từ cần học trong ngày
  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word //.word lấy từ thực tế từ object WORDS
  })

  console.log(daysWords)

  function handleChangePage(pageIndex) {
    setSelectedPage(pageIndex)
  }

  function handleCreateAccount() {
    if (!name) { return }
    localStorage.setItem("username", name)
    handlePageChange(1)
  }

  useEffect(() => {
    // this callback function is triggered on page load
    if (!localStorage) { return }

    if (localStorage.getItem("username")) {
      //if we find the item (so get item return something), when we enter the if block
      setName(localStorage.getItem("username"))

      setSelectedPage(1) // go to dashboard
    }
  }, [])

  const pages = {
    0: <Welcome handleCreateAccount={handleCreateAccount} username="hello world" name={name} setName={setName} />,
    1: <Dashboard name={name} attempts={arguments} PLAN={PLAN} day={day}
      handleChangePage={handleChangePage} daysWords={daysWords} datetime={datetime} history={history} />,
    2: <Challenge />
  }


  return (
    <Layout>
      {pages[selectedPage]}
    </Layout>
  )
}

export default App
