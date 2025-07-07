import Start from "../Start";
import Countdown from "../Countdown";
import History from "../History";

export default function Dashboard(props) {
    return (
        <section id="dashboard">
            <Start {...props} />
            <Countdown {...props} />
            <History {...props} />
        </section>
    )
}