console.log("message");

const QUESTIONS_URL = "https://www.algoexpert.io/api/fe/questions";
const SUBMISSIONS_URL = "https://www.algoexpert.io/API/fe/submissions";

async function fetchQuestionsAndSubmissions() {
  const [questionsRes, submissionsRes] = await Promise.all([
    fetch(QUESTIONS_URL),
    fetch(SUBMISSIONS_URL)
  ]);
  return await Promise.all([questionsRes.json(), submissionsRes.json()]);
}

async function getQuestionsByCategory(questions) {
  const questionsByCategory = {};
  questions.forEach((question) => {
    if (questionsByCategory[question.category]) {
      questionsByCategory[question.category].push(question);
    } else {
      questionsByCategory[question.category] = [question];
    }
  });
  return questionsByCategory;
}

async function getSubmissionsById(submissions) {
  const submissionsByID = {};
  submissions.forEach((submission) => {
    submissionsByID[submission.questionId] = submission.status;
  });
  return submissionsByID;
}
async function fetchAndAppend() {
  const [questions, submissions] = await fetchQuestionsAndSubmissions();
  const questionsByCategory = await getQuestionsByCategory(questions);
  const submissionsByID = await getSubmissionsById(submissions);
  const wrapper = document.getElementById("wrapper");
  for (let [category, questions] of Object.entries(questionsByCategory)) {
    const categoryDiv = createCategory(category, questions, submissionsByID);
    wrapper.append(categoryDiv);
  }
}

fetchAndAppend();
function createCategory(category, questions, submissions) {
  let correctcount = 0;
  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");
  const h2 = document.createElement("h2");
  categoryDiv.append(h2);
  questions.forEach((question) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    const h3 = document.createElement("h3");
    h3.textContent = question.name;
    const status = document.createElement("div");
    status.classList.add("status");
    status.classList.add(
      submissions[question.id]?.toLowerCase().replace("_", "-")
    );
    console.log(submissions[question.id]);
    if(submissions[question.id] === 'CORRECT'){
      correctcount++;
    }
    questionDiv.append(status);
    questionDiv.append(h3);
    categoryDiv.append(questionDiv);
  });
  h2.textContent = `${category}-  ${correctcount}/${questions.length}`;
  return categoryDiv;
}
