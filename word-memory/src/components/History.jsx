export default function History(props) {
    const { history } = props;
    const historyKeys = Object.keys(history);

    return (
        <div className="card history-card">
            <h4>History</h4>
            {historyKeys.length == 0 ? (
                <p>You have no attemps! Press <b>Start</b> to begin ⭐</p>
            ) : (
                <div className="history-list">
                    <div className="card-button-secondary">
                        <div>
                            <p>Started</p>
                            <h6>Mar 25 2025</h6>
                        </div>
                        <div>
                            <p>Streak</p>
                            <h6>53</h6>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}