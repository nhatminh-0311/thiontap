// === Trộn mảng (Fisher-Yates) ===
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // === Trộn thứ tự đáp án trong 1 câu hỏi ===
  function shuffleOptions(question) {
    const keys = Object.keys(question.options);
    shuffleArray(keys);
  
    const newOptions = {};
    let correctKey = "";
  
    keys.forEach((key, i) => {
      const newLabel = String.fromCharCode(97 + i); // 'a', 'b', ...
      newOptions[newLabel] = question.options[key];
      if (key === question.correct) {
        correctKey = newLabel;
      }
    });
  
    return {
      ...question,
      options: newOptions,
      correct: correctKey
    };
  }
  
  // === Tạo HTML 1 khối câu hỏi ===
  function createQuestionBlock(q, index) {
    const container = document.createElement("div");
    container.className = "question-block";
    container.innerHTML = `<p><strong>Câu ${index}:</strong> ${q.text}</p>`;
  
    Object.entries(q.options).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${index}`;
      input.value = key;
      input.id = `q${index}-${key}`;
  
      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = `${key.toUpperCase()}. ${value}`;
  
      const wrapper = document.createElement("div");
      wrapper.appendChild(input);
      wrapper.appendChild(label);
  
      container.appendChild(wrapper);
    });
  
    container.dataset.correct = q.correct;
    container.dataset.qindex = index;
    return container;
  }
  
  // === Hiển thị toàn bộ đề ===
  function renderEnglishQuiz(questionsData) {
    const form = document.getElementById("quizForm");
    form.innerHTML = "";
    let questionIndex = 1;
  
    const shuffledData = [...questionsData];
    shuffleArray(shuffledData);
  
    shuffledData.forEach(item => {
      // Câu hỏi nhóm
      if (item.group && item.questions) {
        shuffleArray(item.questions);
        const groupDiv = document.createElement("div");
        groupDiv.className = "question-group";
        groupDiv.innerHTML = `<h3>${item.group}</h3>`;
  
        item.questions.forEach(q => {
          const shuffledQ = shuffleOptions(q);
          const qDiv = createQuestionBlock(shuffledQ, questionIndex);
          groupDiv.appendChild(qDiv);
          questionIndex++;
        });
  
        form.appendChild(groupDiv);
      }
      // Câu hỏi lẻ
      else if (item.text && item.options) {
        const shuffledQ = shuffleOptions(item);
        const qDiv = createQuestionBlock(shuffledQ, questionIndex);
        form.appendChild(qDiv);
        questionIndex++;
      }
    });
  }
  
  // === Nộp bài ===
  function submitQuiz() {
    const results = document.getElementById("result");
    let score = 0;
    let total = 0;
  
    const blocks = document.querySelectorAll(".question-block");
  
    blocks.forEach(block => {
      const correct = block.dataset.correct;
      const qindex = block.dataset.qindex;
      const selected = block.querySelector(`input[name="question-${qindex}"]:checked`);
      const allInputs = block.querySelectorAll("input");
  
      if (selected) {
        if (selected.value === correct) {
          score++;
          selected.nextSibling.style.color = "green";
        } else {
          selected.nextSibling.style.color = "red";
        }
      }
  
      allInputs.forEach(inp => {
        if (inp.value === correct) {
          inp.nextSibling.style.fontWeight = "bold";
          inp.nextSibling.style.textDecoration = "underline";
        }
      });
  
      total++;
    });
  
    results.innerHTML = `<h3>🎯 Bạn đúng ${score} / ${total} câu.</h3>`;
  }
  
  // === Gọi khi tải xong ===
  window.onload = () => {
    renderEnglishQuiz(englishQuestions); // Phải có biến englishQuestions từ file questions_english.js
  };
  