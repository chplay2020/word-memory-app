import { isEncountered, shuffle } from "../../utils";
import ProgressBar from "../ProgressBar"
import { useState } from "react";
import DEFINITIONS from "../../utils/VOCAB.json";

export default function Challenge(props) {
    const { day, daysWords, handleChangePage, handleIncrementAttempts,
        handleCompleteDay, PLAN } = props;


    const [wordIndex, setWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [showDefinition, setShowDefinition] = useState(false);

    const [listToLearn, setListToLearn] = useState([
        ...daysWords, // Bắt đầu với danh sách từ cần học là danh sách từ trong ngày
        ...shuffle(daysWords), // Lặp lại các từ đã học trong ngày để tạo độ khó
        ...shuffle(daysWords),
        ...shuffle(daysWords)
    ]);

    const word = listToLearn[wordIndex]; // Lấy từ hiện tại từ mảng listToLearn
    const isNewWord = showDefinition || (!isEncountered(day, word)
        && wordIndex < daysWords.length);
    const definition = DEFINITIONS[word]

    function giveUp() {
        setListToLearn([...listToLearn, word]); // Thêm từ hiện tại vào cuối danh sách để không bị mất
        // Hiển thị định nghĩa của từ hiện tại
        setShowDefinition(true);
    }

    return (
        <section id="challenge">
            <h1>{word}</h1>
            {isNewWord && (<p>{definition}</p>)}
            <div className="helper">
                <div>
                    {/* Đoạn code tạo một mảng số từ 0 đến definition.length - 1 
                    và dùng .map() để render ra cùng số lượng thẻ <div>, mỗi thẻ tương ứng một phần tử trong definition. */}
                    {[...Array(definition.length).keys()].map((char, elementIdx) => {
                        // Tạo một thẻ <div> cho mỗi ký tự trong definition
                        // Có thể thêm logic để hiển thị màu sắc hoặc trạng thái khác nhau cho từng ký tự
                        const styleToApply = inputValue.length < char + 1 ? "" :
                            inputValue.split("")[elementIdx].toLowerCase() == definition.split("")[elementIdx].toLowerCase() ? "correct" : "incorrect";

                        return (
                            <div className={" " + styleToApply}
                                key={elementIdx}></div>
                        )
                    })}
                </div>
                <input value={inputValue} onChange={(e) => {
                    if (e.target.value.length == definition.length
                        && e.target.value.length > inputValue.length) {
                        //so sánh từ
                        handleIncrementAttempts();

                        if (e.target.value.toLowerCase() == definition.toLowerCase()) {
                            if (wordIndex >= listToLearn.length - 1) {
                                handleCompleteDay(); // Hoàn thành ngày học
                                return
                            }
                            setWordIndex(wordIndex + 1); // Nếu người dùng nhập đúng, chuyển sang từ tiếp theo
                            setShowDefinition(false); // Ẩn định nghĩa sau khi nhập đúng
                            setInputValue(""); // Xóa giá trị input
                            return
                        }
                    }

                    setInputValue(e.target.value)
                }}
                    type="text" placeholder="Enter the defintion..." />
            </div>

            <div className="Challenge-btns">
                <button onClick={() => {
                    handleChangePage(1); // Quay về Dashboard
                }}
                    className="card-button-secondary">
                    <h6>Quit</h6>
                </button>
                <button onClick={giveUp}
                    className="card-button-primary">
                    <h6>I forgot</h6>
                </button>
            </div>
            <ProgressBar remainder={wordIndex * 100 / listToLearn.length}
                text={`${wordIndex} / ${listToLearn.length}`} />
        </section>
    )
}