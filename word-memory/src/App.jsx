import Challenge from "./components/layouts/Challenge"
import Dashboard from "./components/layouts/Dashboard"
import Layout from "./components/layouts/Layout"
import Welcome from "./components/layouts/Welcome"
import { useState, useEffect } from "react"

import WORDS from "./utils/VOCAB.json"

import { countdownIn24Hours, getWordByIndex, PLAN } from "./utils"

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

  function handleCompleteDay() {
    const newDay = day + 1
    const newDatetime = Date.now()
    setDay(newDay)
    setDatetime(newDatetime)

    localStorage.setItem("day", JSON.stringify({
      day: newDay,
      datetime: newDatetime
    }))
    setSelectedPage(1) // go to dashboard

  }

  function handleIncrementAttempts() {
    //take the current attempt number, and add 1 and save it to local storage
    const newRecord = attempts + 1
    localStorage.setItem("attempts", newRecord)
    setAttempts(newRecord)
  }

  useEffect(() => {
    // this callback function is triggered on page load
    if (!localStorage) { return }

    if (localStorage.getItem("username")) {
      //if we find the item (so get item return something), when we enter the if block
      setName(localStorage.getItem("username"))

      setSelectedPage(1) // go to dashboard
    }

    if (localStorage.getItem("attempts")) {
      // nếu có attempts trong localStorage thì lấy ra
      // nếu không có thì sẽ trả về null, và parseInt(null) sẽ là NaN
      setAttempts(parseInt(localStorage.getItem("attempts")))
    }

    if (localStorage.getItem("history")) {
      setHistory(JSON.parse(localStorage.getItem("history")))
    }

    if (localStorage.getItem("day")) {
      const { day: d, datetime: dt } = JSON.parse(localStorage.getItem("day"))
      setDatetime(dt)
      setDay(d)

      if (d > 1 && dt) {
        const diff = countdownIn24Hours(dt) // lấy thời gian còn lại tính từ ngày hiện tại đến ngày đã lưu trong localStorage
        // nếu diff < 0 thì có nghĩa là đã quá 24h kể từ ngày đó
        if (diff < 0) {
          console.log('Failed challenge')
          let newHistory = { ...history }
          const timestamp = new Date(dt)
          const formattedTimestamp = timestamp.toString().split(' ').slice(1, 4).join(' ')
          newHistory[formattedTimestamp] = d
          setHistory(newHistory)
          setDay(1)
          setDatetime(null)
          setAttempts(0)

          localStorage.setItem('attempts', 0)
          localStorage.setItem('history', JSON.stringify(newHistory))
          localStorage.setItem('day', JSON.stringify({ day: 1, datetime: null })) // 'day' là key, giá trị sau là value cần lưu trữ
        }
      }

    }


  }, [])


  const pages = {
    0: <Welcome handleCreateAccount={handleCreateAccount} username="hello world" name={name} setName={setName} />,
    1: <Dashboard name={name} attempts={attempts} PLAN={PLAN} day={day}
      handleChangePage={handleChangePage} daysWords={daysWords} datetime={datetime} history={history} />,
    2: <Challenge PLAN={PLAN} day={day} handleChangePage={handleChangePage} daysWords={daysWords}
      handleCompleteDay={handleCompleteDay} handleIncrementAttempts={handleIncrementAttempts} />
  }


  return (
    <Layout>
      {pages[selectedPage]}
    </Layout>
  )
}

export default App
