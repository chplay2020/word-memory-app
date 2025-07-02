import ProgressBar from "./ProgressBar"


export default function () {

    const name = "User"
    const day = 16

    return (
        <div className="card stats-card">
            <div className="welcome-text">
                <h6>Welcome</h6>
                <h4 className="text-large">
                    {name}
                </h4>
            </div>

            <div className="stats-column">
                <div>
                    <p>Steak 🔥</p>
                    <h4>{day - 1}</h4>
                </div>
                <div>
                    <p>Words seen</p>
                    <h4>{101}</h4>
                </div>
                <div>
                    <p>Accuracy (%)</p>
                    <h4>{93.3.toFixed(2)}</h4>
                </div>
            </div>

            <ProgressBar />
        </div>
    )
}
