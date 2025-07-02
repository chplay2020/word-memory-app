import Start from "../Start";
import Countdown from "../Countdown";
import History from "../History";

export default function Dashboard() {
    return (
        <section id="dashboard">
            <Start />
            <Countdown />
            <History />
        </section>
    )
}