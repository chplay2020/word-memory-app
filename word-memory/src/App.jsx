import Challenge from "./components/layouts/Challenge"
import Dashboard from "./components/layouts/Dashboard"
import Layout from "./components/layouts/Layout"
import Welcome from "./components/layouts/Welcome"

function App() {

  const page = 0 // 0: Welcome, 1: Dashboard, 2: Challenge


  return (
    <Layout>
      <Welcome />
      <Dashboard />
      <Challenge />
    </Layout>
  )
}

export default App
