import ProgressBar from "../ProgressBar"

export default function Challenge() {
    const word = "copacetic"
    const definition = "In excellent order"

    return (
        <section id="challenge">
            <h1>{word}</h1>
            <p>{definition}</p>
            <div className="helper">
                <div>
                    {/* Đoạn code tạo một mảng số từ 0 đến definition.length - 1 
                    và dùng .map() để render ra cùng số lượng thẻ <div>, mỗi thẻ tương ứng một phần tử trong definition. */}
                    {[...Array(definition.length).keys()].map((element, elementIdx) => {
                        // Tạo một thẻ <div> cho mỗi ký tự trong definition
                        // Có thể thêm logic để hiển thị màu sắc hoặc trạng thái khác nhau cho từng ký tự
                        return (
                            <div key={elementIdx}></div>
                        )
                    })}
                </div>
                <input type="text" placeholder="Enter the defintion..." />
            </div>

            <div className="Challenge-btns">
                <button className="card-button-secondary">
                    <h6>Quit</h6>
                </button>
                <button className="card-button-primary">
                    <h6>I forgot</h6>
                </button>
            </div>
            <ProgressBar />
        </section>
    )
}