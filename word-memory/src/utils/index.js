import PLAN from './year_plan.json'
import WORDS from './VOCAB.json' // Import danh sách từ vựng từ file VOCAB.json

// Hàm đếm ngược đến hết 24h kể từ mốc targetUTCMillis (miligiây UTC)
export function countdownIn24Hours(targetUTCMillis) {
    const currentTime = Date.now() // Lấy thời gian hiện tại (miligiây UTC)
    const endOfDay = targetUTCMillis + 24 * 60 * 60 * 1000 // Cộng thêm 24h vào mốc target
    const remainingTime = endOfDay - currentTime // Tính số ms còn lại đến hết 24h
    return remainingTime // Trả về số ms còn lại (nếu âm là đã quá 24h)
}

// Hàm chuyển đổi mili giây sang giờ, phút, giây (có thể trả về số âm nếu ms âm)
export function convertMilliseconds(ms) {
    const absTime = Math.abs(ms) // Lấy giá trị tuyệt đối của ms
    const hours = Math.floor(absTime / (1000 * 60 * 60)) // Đổi ms sang giờ
    const minutes = Math.floor((absTime % (1000 * 60 * 60)) / (1000 * 60)) // Lấy phần phút còn lại
    const seconds = Math.floor((absTime % (1000 * 60)) / 1000) // Lấy phần giây còn lại

    return {
        hours: ms >= 0 ? hours : -hours, // Nếu ms âm thì trả về số âm
        minutes: ms >= 0 ? minutes : -minutes,
        seconds: ms >= 0 ? seconds : -seconds
    }
}

// Hàm tạo mảng các chỉ số từ đã học đến ngày học (có thể offset lùi/tiến ngày)
// offset = 0: lấy đến đúng ngày học, offset = -1: lấy đến ngày học-1
function generateWordArr(day, offset = 0) {
    let totalWords = [] // Mảng tổng hợp chỉ số từ đã học
    for (let dayIndex in PLAN) { // Lặp qua từng ngày trong PLAN (PLAN là object, key là số ngày)
        if (dayIndex - offset > day) { // Nếu đã vượt quá ngày cần lấy thì dừng
            break
        }
        const words = PLAN[dayIndex] // Lấy mảng chỉ số từ của ngày đó
        totalWords = [...totalWords, ...words] // Gộp vào mảng tổng
    }
    return totalWords // Trả về mảng chỉ số từ đã học
}

// Hàm tính số lượng từ mới đã học đến ngày học (không tính trùng lặp)
export function calculateNewWords(day) {
    let totalWords = generateWordArr(day) // Lấy tất cả chỉ số từ đã học đến ngày học
    const wordSet = new Set(totalWords) // Loại bỏ các chỉ số trùng lặp
    return wordSet.size // Trả về số lượng từ mới đã học
}

// Hàm tính độ chính xác (accuracy) theo công thức tùy chỉnh
// a: tổng số câu hỏi đã làm, day: ngày hiện tại
export function calculateAccuracy(a, day) {
    let totalWords = generateWordArr(day, -1) // Lấy danh sách từ đến ngày day-1
    console.log(a, totalWords)
    return (totalWords.length * 4) / a // Công thức: số từ * 4 chia cho số câu hỏi đã làm
}

// Hàm kiểm tra một từ đã từng gặp trước ngày day chưa
export function isEncountered(day, word) {
    // Lấy danh sách chỉ số từ đã học đến ngày day-1, chuyển sang từ thực tế
    let totalWords = generateWordArr(day - 1).map(e => getWordByIndex(WORDS, parseInt(e)).word)
    console.log(totalWords)
    return totalWords.includes(word) // Kiểm tra từ đã từng gặp chưa
}

// Hàm tính mức độ trung bình (số lần lặp lại/từ) đến ngày day-1
export function calcLevel(day) {
    let totalWords = generateWordArr(day, -1) // Lấy danh sách từ đến ngày day-1
    let d = {} // Đối tượng đếm số lần xuất hiện của từng từ
    for (let word of totalWords) {
        d[word] = (d?.[word] || 0) + 1 // Nếu đã có thì +1, chưa có thì khởi tạo = 1
    }
    // Tính tổng số lần xuất hiện và số từ khác nhau
    let avgLevel = Object.keys(d).reduce((acc, curr) => {
        return { num: acc.num + 1, total: acc.total + d[curr] }
    }, { total: 0, num: 0 })
    return avgLevel.total / avgLevel.num // Trả về mức độ trung bình (số lần lặp/từ)
}

// Hàm đảo trộn mảng (Fisher-Yates shuffle)
export function shuffle(arr) {
    let array = [...arr] // Tạo bản sao mảng gốc
    let currentIndex = array.length

    // Đảo trộn từng phần tử từ cuối về đầu
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        // Đổi chỗ phần tử hiện tại với phần tử ngẫu nhiên
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }
    return array // Trả về mảng đã đảo trộn
}

// Hàm lấy từ và nghĩa theo index trong object wordsDict
export function getWordByIndex(wordsDict, index) {
    const keys = Object.keys(wordsDict) // Lấy danh sách key (từ)
    const word = keys[index] // Lấy từ theo index
    const definition = wordsDict[word] // Lấy nghĩa của từ
    return { word, definition } // Trả về object gồm từ và nghĩa
}

// Hàm tạo lịch học lặp lại ngắt quãng động cho toàn bộ từ
export function generateDynamicSpacedRepetitionSchedule(
    totalWords, // Tổng số từ cần học
    maxNewPerDay = 3, // Số từ mới tối đa mỗi ngày
    maxReviewsPerDay = 10 // Số từ ôn tập tối đa mỗi ngày
) {
    const intervals = [1, 3, 7, 14, 30, 60, 120, 240] // Các khoảng lặp lại (ngày)
    const schedule = {} // Lịch học (object, key là ngày, value là mảng chỉ số từ)
    let day = 1 // Ngày bắt đầu
    let nextWordIndex = 0 // Chỉ số từ tiếp theo sẽ học
    let learningQueue = [] // Hàng đợi các từ đang học (chưa hoàn thành hết các lần review)

    const MAX_DAYS = 500 // Giới hạn số ngày tối đa để tránh vòng lặp vô hạn

    while (true) {
        if (day > MAX_DAYS) {
            console.warn("Stopped early due to hitting MAX_DAYS") // Cảnh báo nếu vượt quá số ngày tối đa
            break
        }

        const today = [] // Danh sách chỉ số từ học/review hôm nay

        // Bước 1: Lấy các từ cần review hôm nay (nextReview === day)
        let reviewsToday = learningQueue.filter(entry => entry.nextReview === day)
        let reviewCount = reviewsToday.length

        // Bước 2: Nếu hôm nay không có review, kéo các review tương lai về hôm nay (đảm bảo không bị trống)
        if (reviewCount === 0 && learningQueue.length > 0) {
            const futureReviews = learningQueue
                .filter(entry => entry.nextReview > day)
                .sort((a, b) => a.nextReview - b.nextReview)

            const slotsAvailable = maxReviewsPerDay - reviewCount
            const toPull = futureReviews.slice(0, slotsAvailable)

            for (const entry of toPull) {
                entry.nextReview = day // Đặt lại ngày review là hôm nay
                reviewsToday.push(entry)
                reviewCount++
            }
        }

        // Bước 3: Thêm các từ review vào danh sách hôm nay
        for (const entry of reviewsToday) {
            today.push(entry.wordIndex)
        }

        // Bước 4: Thêm từ mới nếu số lượng review chưa vượt quá giới hạn
        if (reviewCount <= maxReviewsPerDay && nextWordIndex < totalWords) {
            let newWordsToday = 0
            while (
                newWordsToday < maxNewPerDay &&
                nextWordIndex < totalWords &&
                reviewCount < maxReviewsPerDay
            ) {
                const wordIndex = nextWordIndex++ // Lấy chỉ số từ mới
                today.push(wordIndex) // Thêm vào danh sách hôm nay
                learningQueue.push({
                    wordIndex,
                    nextReview: day + intervals[0], // Lịch review lần đầu (ngày tiếp theo)
                    intervalIndex: 0 // Bắt đầu từ khoảng lặp đầu tiên
                })
                newWordsToday++
                reviewCount++
            }
        }

        // Lưu lịch học của ngày hôm nay vào object schedule
        schedule[day] = today

        // Bước 5: Cập nhật hàng đợi học (tăng interval hoặc loại bỏ nếu đã xong)
        learningQueue = learningQueue
            .map(entry => {
                if (entry.nextReview === day) {
                    if (entry.intervalIndex < intervals.length - 1) {
                        // Nếu chưa hết các lần review, cập nhật lần tiếp theo
                        return {
                            ...entry,
                            nextReview: day + intervals[entry.intervalIndex + 1],
                            intervalIndex: entry.intervalIndex + 1
                        }
                    } else {
                        return null // Đã hoàn thành hết các lần review, loại khỏi queue
                    }
                }
                return entry // Các entry khác giữ nguyên
            })
            .filter(Boolean) // Loại bỏ các entry null

        // Bước 6: Kiểm tra điều kiện dừng (học hết từ và không còn từ nào cần review)
        if (nextWordIndex >= totalWords && learningQueue.length === 0) {
            break
        }

        day++ // Sang ngày tiếp theo
    }

    return schedule // Trả về lịch học (object, key là ngày, value là mảng chỉ số từ)
}

// Khởi tạo PLAN bằng lịch học động dựa trên số lượng từ trong WORDS
export const PLAN = generateDynamicSpacedRepetitionSchedule(Object.keys(WORDS).length)