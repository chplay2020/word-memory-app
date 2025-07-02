import Challenge from "./components/layouts/Challenge"
import Dashboard from "./components/layouts/Dashboard"
import Layout from "./components/layouts/Layout"
import Welcome from "./components/layouts/Welcome"

function App() {

  const selectedPage = 2 // 0: Welcome, 1: Dashboard, 2: Challenge

  const pages = {
    0: <Welcome />,
    1: <Dashboard />,
    2: <Challenge />
  }


  return (
    <Layout>
      {pages[selectedPage]}
    </Layout>
  )
}

export default App
