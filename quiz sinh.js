// quiz.js

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateQuiz() {
  const quizForm = document.getElementById('quizForm');
  const shuffledQuestions = shuffle(questions);

  shuffledQuestions.forEach((q, index) => {
    const qId = `q${index + 1}`;
    const shuffledOptions = shuffle(Object.entries(q.options));

    const qDiv = document.createElement('div');
    qDiv.className = 'question';

    // Thêm số thứ tự vào câu hỏi
    qDiv.innerHTML = `<h3>Câu ${index + 1}: ${q.text}</h3>`;
    // Sau dòng: qDiv.innerHTML = ...
if (q.image) {
  const img = document.createElement('img');
  img.src = q.image;
  img.alt = "Hình minh họa";
  img.style.maxWidth = "100%";
  img.style.margin = "10px 0";
  qDiv.appendChild(img);
}


    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    shuffledOptions.forEach(([key, value]) => {
      const inputType = q.type === "multi" ? "checkbox" : "radio";
      const label = document.createElement('label');
      label.innerHTML = `<input type="${inputType}" name="${qId}${q.type === "multi" ? '[]' : ''}" value="${key}"> ${value}`;
      optionsDiv.appendChild(label);
    });

    qDiv.appendChild(optionsDiv);
    quizForm.appendChild(qDiv);

    q.id = qId;
  });
}

function submitQuiz() {
  let score = 0;

  questions.forEach(q => {
    const inputs = document.querySelectorAll(`input[name="${q.id}${q.type === 'multi' ? '[]' : ''}"]`);
    const selected = Array.from(inputs).filter(i => i.checked).map(i => i.value);
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];

    inputs.forEach(input => {
      const label = input.parentElement;
      label.style.backgroundColor = "transparent";
      label.style.color = "#333";
      label.style.fontWeight = "normal";
    });

    const isCorrect = selected.sort().join(",") === correct.sort().join(",");

    if (isCorrect) {
      score++;
      selected.forEach(val => {
        const el = document.querySelector(`input[name="${q.id}${q.type === 'multi' ? '[]' : ''}"][value="${val}"]`);
        if (el) {
          el.parentElement.style.color = "green";
          el.parentElement.style.backgroundColor = "#e6ffe6";
          el.parentElement.style.fontWeight = "bold";
        }
      });
    } else {
      selected.forEach(val => {
        const el = document.querySelector(`input[name="${q.id}${q.type === 'multi' ? '[]' : ''}"][value="${val}"]`);
        if (el) {
          el.parentElement.style.color = "red";
          el.parentElement.style.backgroundColor = "#ffe6e6";
          el.parentElement.style.fontWeight = "bold";
        }
      });
      correct.forEach(val => {
        const el = document.querySelector(`input[name="${q.id}${q.type === 'multi' ? '[]' : ''}"][value="${val}"]`);
        if (el) {
          el.parentElement.style.border = "2px solid green";
          el.parentElement.style.backgroundColor = "#e6ffe6";
        }
      });
    }
  });

  document.getElementById('result').innerHTML = `🎯 Bạn đúng ${score}/${questions.length} câu<br>📊 Điểm: <strong>${(score / questions.length * 10).toFixed(1)}</strong>`;
  document.querySelector(".submit-btn").disabled = true;
  document.querySelector(".submit-btn").innerText = "Đã nộp bài";
  document.querySelector(".submit-btn").style.backgroundColor = "#999";
}

window.onload = () => {
  generateQuiz();
  startTimer(submitQuiz); // Bắt đầu đếm ngược, hết giờ sẽ gọi submitQuiz
};
