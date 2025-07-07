import { calcLevel, calculateAccuracy, calculateNewWords } from "../utils"
import ProgressBar from "./ProgressBar"


export default function (props) {
    const { name, day, attempts, PLAN } = props

    const currlv1 = calcLevel(day)
    const flooredlv1 = Math.floor(currlv1)
    const remainder = (currlv1 - flooredlv1) * 100


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
                    <h4>{calculateNewWords(day - 1)}</h4>
                </div>
                <div>
                    <p>Accuracy (%)</p>
                    <h4>{(calculateAccuracy(attempts, day)).toFixed(1) * 100}</h4>
                </div>
            </div>

            <ProgressBar text={`lvl ${flooredlv1}`} remainder={remainder} />
        </div>
    )
}
